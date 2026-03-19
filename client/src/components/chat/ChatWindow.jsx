import React, { useEffect, useRef, useState } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, addMessage, addNotification } from '../../store/chatSlice';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatWindow = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { currentChat, messages, socket, onlineUsers } = useSelector((state) => state.chat);
  const scrollRef = useRef();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await api.get(`/chat/message/${currentChat._id}`);
        dispatch(setMessages(res.data));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [currentChat, setMessages]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (message) => {
      // If the message belongs to current open chat
      if (currentChat && message.conversationId === currentChat._id) {
        dispatch(addMessage(message));
      } else {
         // Create notification if message isn't from current chat
         dispatch(addNotification({
             senderId: message.senderId,
             isRead: false,
             date: new Date()
         }));
      }
    };

    const handleDisplayTyping = ({ senderId, isTyping }) => {
        if (currentChat) {
             const chatPartner = currentChat.participants.find((p) => p._id !== user._id);
             if (chatPartner && chatPartner._id === senderId) {
                setIsTyping(isTyping);
                setTypingUser(chatPartner.name);
             }
        }
    };

    socket.on('getMessage', handleGetMessage);
    socket.on('displayTyping', handleDisplayTyping);

    return () => {
      socket.off('getMessage', handleGetMessage);
      socket.off('displayTyping', handleDisplayTyping);
    };
  }, [socket, currentChat, addMessage, user._id, addNotification]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!currentChat) {
    return (
      <div className="h-full flex items-center justify-center flex-col text-gray-600 bg-white/20 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative background blobs for empty state */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--color-primary)]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-secondary)]/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 p-10 glass rounded-[32px] border border-white/60 shadow-xl flex items-center justify-center flex-col animate-fade-in max-w-sm text-center transform transition-all hover:scale-105 duration-500">
          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] p-0.5 shadow-lg shadow-[var(--color-primary)]/20 animate-bounce-slow">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[var(--color-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-800 mb-2 tracking-tight">Your Messages</h3>
          <p className="text-sm font-medium text-gray-500">Select a conversation from the sidebar to start chatting with professionals or clients.</p>
        </div>
      </div>
    );
  }

  const chatPartner = currentChat.participants.find((p) => p._id !== user._id);
  const isOnline = onlineUsers.some((u) => u.userId === chatPartner?._id);

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 flex items-center bg-white/80 backdrop-blur-3xl sticky top-0 z-20 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] border-b border-white">
         <div className="relative group cursor-pointer">
             {chatPartner?.profileImage ? (
                <img src={`${BASE_URL}${chatPartner.profileImage}`} alt={chatPartner.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[var(--color-primary)] transition-all duration-300" />
             ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold shadow-md shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-transform duration-300">
                   {chatPartner?.name?.charAt(0).toUpperCase()}
                </div>
             )}
              {isOnline && (
                 <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
         </div>
         <div className="ml-3">
             <h3 className="font-bold text-gray-800">{chatPartner?.name}</h3>
             <p className="text-xs font-semibold text-gray-500">{isOnline ? <span className="text-green-500">Active Now</span> : 'Offline'}</p>
         </div>
      </div>

      {/* Cute Clean Horizontal Divider */}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-transparent relative z-0">
        {messages.map((msg, index) => (
          <div key={index} ref={index === messages.length - 1 ? scrollRef : null}>
            <MessageBubble message={msg} isOwn={msg.senderId === user._id} />
          </div>
        ))}
        {isTyping && (
             <div className="text-xs text-gray-500 italic ml-2" ref={scrollRef}>
                 {typingUser} is typing...
             </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-3xl sticky bottom-0 z-20 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.1)] border-t border-white rounded-b-[32px] overflow-hidden">
         <ChatInput chatPartner={chatPartner} conversationId={currentChat._id} />
      </div>
    </div>
  );
};

export default ChatWindow;
