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
