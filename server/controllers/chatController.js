const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Create or access conversation
// @route   POST /api/chat/conversation/create
// @access  Private
exports.accessConversation = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "UserId param not sent with request" });
  }

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId], $size: 2 }
    })
    .populate("participants", "-password")

    if (conversation) {
      return res.status(200).json(conversation);
    } else {
      const newConversation = new Conversation({
        participants: [req.user._id, userId],
        lastMessage: ""
      });

      const savedConversation = await newConversation.save();
      const fullConversation = await Conversation.findOne({ _id: savedConversation._id }).populate("participants", "-password");
      res.status(200).json(fullConversation);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch user conversations
// @route   GET /api/chat/conversation
// @access  Private
exports.fetchConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user._id] }
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new message
// @route   POST /api/chat/message/send
// @access  Private
exports.sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;

  if (!conversationId || !text) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  try {
    const newMessage = new Message({
      senderId: req.user._id,
      conversationId: conversationId,
      text: text,
    });

    let message = await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a conversation
// @route   GET /api/chat/message/:conversationId
// @access  Private
exports.allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/message/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Ensure the user deleting the message is the sender
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this message" });
    }

    await message.deleteOne();
    
    // Optionally update the conversation's lastMessage if this was the last one
    const latestMessage = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 });
    await Conversation.findByIdAndUpdate(message.conversationId, {
      lastMessage: latestMessage ? latestMessage.text : ""
    });

    res.status(200).json({ success: true, messageId: req.params.messageId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an entire conversation
// @route   DELETE /api/chat/conversation/:conversationId
// @access  Private
exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Ensure user is part of the conversation
    if (!conversation.participants.includes(req.user._id)) {
        return res.status(401).json({ message: "Not authorized to delete this conversation" });
    }

    // Delete all associated messages
    await Message.deleteMany({ conversationId: conversation._id });
    
    // Delete the conversation itself
    await conversation.deleteOne();

    res.status(200).json({ success: true, conversationId: req.params.conversationId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle pin conversation
// @route   PUT /api/chat/conversation/:conversationId/pin
// @access  Private
exports.pinConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(req.user._id)) {
        return res.status(401).json({ message: "Not authorized" });
    }

    const { _id: userId } = req.user;
    
    // Toggle logic
    if (conversation.pinnedBy.includes(userId)) {
        conversation.pinnedBy = conversation.pinnedBy.filter(id => id.toString() !== userId.toString());
    } else {
        conversation.pinnedBy.push(userId);
    }
    
    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
