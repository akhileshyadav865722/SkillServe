import React, { useState } from 'react';
import api from '../../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setConversations } from '../../store/chatSlice';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ chatPartner, conversationId }) => {
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const { conversations, socket } = useSelector((state) => state.chat);
  const { user } = useContext(AuthContext);
  
  // Throttle typing events
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && chatPartner) {
        socket.emit("typing", {
            senderId: user._id,
            receiverId: chatPartner._id,
            isTyping: e.target.value.length > 0
        });

        if (typingTimeout) clearTimeout(typingTimeout);
        
        setTypingTimeout(
            setTimeout(() => {
                socket.emit("typing", {
                    senderId: user._id,
                    receiverId: chatPartner._id,
                    isTyping: false
                });
            }, 2000)
        );
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    try {
      const res = await api.post('/chat/message/send', {
        text: newMessage,
        conversationId,
      });

      // Optimistically add message
      dispatch(addMessage(res.data));
      setNewMessage('');

      // Emit socket event
      if (socket && chatPartner) {
          socket.emit('sendMessage', {
              ...res.data,
              recipientId: chatPartner._id
          });
          socket.emit("typing", {
              senderId: user._id,
              receiverId: chatPartner._id,
              isTyping: false
          });
      }

      // Update conversation list with new last message
      const updatedConversations = conversations.map(c => {
          if (c._id === conversationId) {
              return { ...c, lastMessage: res.data.text, updatedAt: new Date().toISOString() };
          }
          return c;
      });
      // Sort so updated is at top
      dispatch(setConversations(updatedConversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))));

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-white/40 backdrop-blur-2xl border-t border-white/50 relative z-10 rounded-b-[24px]">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
        <input
          type="text"
          className="flex-1 border border-white/60 bg-white/60 backdrop-blur-md placeholder-gray-500 focus:bg-white/90 focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-transparent rounded-full py-3.5 px-6 text-gray-800 font-medium transition-all duration-300 shadow-inner outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleTyping}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`p-3.5 rounded-full flex items-center justify-center transition-all duration-300 transform group ${
            newMessage.trim() 
              ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg shadow-[var(--color-primary)]/30 hover:scale-105 hover:-translate-y-0.5 active:scale-95' 
              : 'bg-white/50 text-gray-400 cursor-not-allowed border border-white/40'
          }`}
        >
          <Send size={20} className={`transition-transform duration-300 ${newMessage.trim() ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-0.5" : ""}`} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
