import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setConversations, setCurrentChat, markNotificationsAsRead } from '../../store/chatSlice';

const ConversationList = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { conversations, currentChat, onlineUsers, notifications } = useSelector((state) => state.chat);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversation');
        dispatch(setConversations(res.data));
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchConversations();
  }, [user, setConversations]);

  const handleSelectChat = (chat) => {
    dispatch(setCurrentChat(chat));
    // Find the other user
    const chatPartner = chat.participants.find((p) => p._id !== user._id);
    if (chatPartner) {
        dispatch(markNotificationsAsRead(chatPartner._id));
    }
  };

  if (loading) return <div className="p-4 text-center">Loading chats...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-white/40 bg-white/30 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] tracking-tight drop-shadow-sm flex items-center gap-2">
          Messages
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full font-bold shadow-md shadow-red-500/30 ml-2 animate-pulse">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">No messages yet.</div>
        ) : (
          conversations.map((chat) => {
            const chatPartner = chat.participants.find((p) => p._id !== user._id);
            const isOnline = onlineUsers.some((u) => u.userId === chatPartner?._id);
            const unreadCount = notifications.filter(n => n.senderId === chatPartner?._id && !n.isRead).length;

            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center p-3.5 mx-2 my-1.5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                  currentChat?._id === chat._id 
                    ? 'bg-white/90 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-[var(--color-primary)]/30 backdrop-blur-xl scale-[1.02]' 
                    : 'hover:bg-white/60 border border-transparent hover:shadow-sm hover:border-white/50'
                }`}
              >
                <div className="relative">
                  {chatPartner?.profileImage ? (
                    <img src={`${BASE_URL}${chatPartner.profileImage}`} alt={chatPartner.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {chatPartner?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate">{chatPartner?.name}</h3>
                    {unreadCount > 0 && (
                      <span className="bg-[var(--color-secondary)] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{unreadCount}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.lastMessage || 'New Conversation'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
