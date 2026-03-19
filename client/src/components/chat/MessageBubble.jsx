import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} w-full group mb-1`}>
      <div
        className={`max-w-[75%] rounded-2xl p-3.5 px-5 shadow-sm transition-all duration-300 hover:shadow-md ${
          isOwn
            ? 'glass bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white rounded-tr-sm border border-white/10 shadow-[0_4px_15px_rgb(127,90,240,0.25)]'
            : 'glass bg-white/90 backdrop-blur-xl text-gray-800 border border-white/60 rounded-tl-sm shadow-[0_4px_15px_rgb(0,0,0,0.04)]'
        }`}
      >
        <p className={`text-[15px] leading-relaxed break-words font-medium ${isOwn ? 'text-white' : 'text-gray-700'}`}>{message.text}</p>
        <div className={`flex justify-end items-center mt-1.5 space-x-1.5 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">{format(new Date(message.createdAt), 'p')}</span>
          {isOwn && (
              message.isRead ? <CheckCheck size={14} className="text-white/90" /> : <Check size={14} className="text-white/60" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
