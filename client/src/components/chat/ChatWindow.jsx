import React, { useEffect, useRef, useState } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessages, addMessage, removeMessage, addNotification } from '../../store/chatSlice';
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
  }, [currentChat, setMessages, dispatch]);

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

    const handleMessageDeleted = (messageId) => {
      dispatch(removeMessage(messageId));
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
    socket.on('getMessageDeleted', handleMessageDeleted);
    socket.on('displayTyping', handleDisplayTyping);

    return () => {
      socket.off('getMessage', handleGetMessage);
      socket.off('getMessageDeleted', handleMessageDeleted);
      socket.off('displayTyping', handleDisplayTyping);
    };
  }, [socket, currentChat, user._id, dispatch]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!currentChat) {
    return (
      <div className="h-full flex items-center justify-center flex-col text-slate-600 bg-white/10 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 p-12 bg-white/60 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex items-center justify-center flex-col text-center transform transition-all hover:scale-105 duration-500">
          <div className="w-28 h-28 mb-8 rounded-[32px] bg-gradient-to-br from-blue-600 to-cyan-400 p-0.5 shadow-xl shadow-blue-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
            <div className="w-full h-full bg-white rounded-[30px] flex items-center justify-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">Your Messages</h3>
          <p className="text-base font-bold text-slate-500 max-w-xs">Select a conversation from the sidebar to securely connect and collaborate.</p>
        </div>
      </div>
    );
  }

  const chatPartner = currentChat.participants.find((p) => p._id !== user._id);
  const isOnline = onlineUsers.some((u) => u.userId === chatPartner?._id);

  return (
    <div className="h-full flex flex-col relative bg-white/20">
      {/* Premium Header */}
      <div className="p-4 sm:p-5 flex items-center bg-white/70 backdrop-blur-2xl sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white">
         <div className="relative group cursor-pointer shrink-0">
             {chatPartner?.profileImage ? (
                <img src={`${BASE_URL}${chatPartner.profileImage}`} alt={chatPartner.name} className="w-14 h-14 rounded-[18px] object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-all duration-300" />
             ) : (
                <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-inner border border-white/50 group-hover:scale-105 transition-transform duration-300">
                   {chatPartner?.name?.charAt(0).toUpperCase()}
                </div>
             )}
              {isOnline && (
                 <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm"></span>
              )}
         </div>
         <div className="ml-5">
             <h3 className="font-black text-xl text-slate-800 tracking-tight">{chatPartner?.name}</h3>
             <p className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
               {isOnline ? (
                 <>
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   <span className="text-emerald-600">Active Now</span>
                 </>
               ) : (
                 <span className="text-slate-400">Offline</span>
               )}
             </p>
         </div>
         <div className="ml-auto flex items-center gap-3">
             <button className="w-10 h-10 rounded-xl bg-white text-slate-400 hover:text-blue-600 border border-slate-100 shadow-sm flex items-center justify-center hover:shadow-md transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
             </button>
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 relative z-0">
        <div className="text-center my-6">
          <span className="bg-slate-900/5 backdrop-blur-sm text-slate-500 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl">
            This is the start of your secure conversation
          </span>
        </div>
        
        {messages.map((msg, index) => (
          <div key={msg._id} ref={index === messages.length - 1 ? scrollRef : null}>
            <MessageBubble 
              message={msg} 
              isOwn={msg.senderId === user._id}
              chatPartnerId={chatPartner?._id}
            />
          </div>
        ))}
        {isTyping && (
             <div className="flex justify-start w-full group mb-2" ref={scrollRef}>
                 <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl rounded-tl-sm p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] flex items-center gap-2">
                     <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                     <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 </div>
             </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-3xl sticky bottom-0 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] border-t border-white p-3 sm:p-5">
         <ChatInput chatPartner={chatPartner} conversationId={currentChat._id} />
      </div>
    </div>
  );
};

export default ChatWindow;
