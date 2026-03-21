import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../store/chatSlice';

const MessageBubble = ({ message, isOwn, chatPartnerId }) => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.chat);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this message?")) return;
    
    setIsDeleting(true);
    try {
      // Delete in DB
      await api.delete(`/chat/message/${message._id}`);
      
      // Emit via sockets so it vanishes for the receiver
      if (socket && chatPartnerId) {
        socket.emit("deleteMessage", { messageId: message._id, receiverId: chatPartnerId });
      }

      // Remove from our own Redux state locally
      dispatch(removeMessage(message._id));
      
    } catch (error) {
      console.error("Failed to delete message", error);
      alert("Failed to delete the message. It might have already been deleted.");
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full mb-2`}>
        <div className="opacity-0 translate-y-2 scale-95 transition-all duration-500 max-w-[75%]"></div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full group mb-2 relative animate-fade-in`}>
      
      {/* Delete Button (Only visible on hover for Own Messages) */}
      {isOwn && (
        <button 
          onClick={handleDelete}
          className="absolute top-1/2 -translate-y-1/2 right-[calc(75%+12px)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-[-10px] transition-all duration-300 p-2 bg-white rounded-full shadow-md border border-rose-100 text-rose-400 hover:text-white hover:bg-rose-500 hover:shadow-rose-500/30 focus:outline-none"
          title="Delete Message"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:px-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-lg ${
          isOwn
            ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-tr-sm border border-blue-400/30 hover:shadow-cyan-500/20 transform hover:-translate-y-0.5'
            : 'bg-white/95 backdrop-blur-xl text-slate-800 border border-white rounded-tl-sm hover:-translate-y-0.5'
        }`}
      >
        <p className={`text-[15.5px] leading-relaxed break-words font-medium ${isOwn ? 'text-white' : 'text-slate-700'}`}>
          {message.text}
        </p>
        
        <div className={`flex justify-end items-center mt-2 space-x-1.5 ${isOwn ? 'text-white/80' : 'text-slate-400'}`}>
          <span className="text-[10px] font-black tracking-widest uppercase opacity-80">
            {format(new Date(message.createdAt), 'p')}
          </span>
          {isOwn && (
              message.isRead ? <CheckCheck size={16} strokeWidth={3} className="text-white drop-shadow-sm" /> : <Check size={16} strokeWidth={3} className="text-white/60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
