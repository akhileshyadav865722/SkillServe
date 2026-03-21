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
    <div className="w-full relative z-10 transition-all">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative max-w-4xl mx-auto">
        
        {/* Input Wrapper */}
        <div className="flex-1 relative group">
          <input
            type="text"
            className="w-full bg-white border-2 border-slate-200/80 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 rounded-full py-4 px-6 text-slate-800 font-bold transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] outline-none text-base tracking-wide"
            placeholder="Write a message..."
            value={newMessage}
            onChange={handleTyping}
          />
          
          {/* Decorative glowing dot */}
          {newMessage.length > 0 && (
             <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50"></div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`shrink-0 p-4 rounded-full flex items-center justify-center transition-all duration-300 transform group border ${
            newMessage.trim() 
              ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white border-blue-400/30 shadow-xl shadow-blue-500/40 hover:scale-[1.05] hover:-translate-y-1 active:scale-95' 
              : 'bg-white text-slate-300 border-slate-200 cursor-not-allowed shadow-sm'
          }`}
        >
          <Send size={20} strokeWidth={newMessage.trim() ? 3 : 2} className={`transition-transform duration-300 ${newMessage.trim() ? "group-hover:translate-x-1 group-hover:-translate-y-1" : ""}`} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
