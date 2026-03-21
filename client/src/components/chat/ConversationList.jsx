import React, { useEffect, useState } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setConversations, setCurrentChat, markNotificationsAsRead, removeConversation, togglePinConversation } from '../../store/chatSlice';
import { Pin, Trash2 } from 'lucide-react';

const ConversationList = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { conversations, currentChat, onlineUsers, notifications, socket } = useSelector((state) => state.chat);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState(null); // prevent rapid clicking

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
  }, [user, dispatch]);

  // Socket listener for real-time conversation deletion
  useEffect(() => {
    if (!socket) return;
    const handleConversationDeleted = (conversationId) => {
        dispatch(removeConversation(conversationId));
    };
    socket.on('getConversationDeleted', handleConversationDeleted);

    return () => {
        socket.off('getConversationDeleted', handleConversationDeleted);
    }
  }, [socket, dispatch]);

  const handleSelectChat = (chat) => {
    dispatch(setCurrentChat(chat));
    const chatPartner = chat.participants.find((p) => p._id !== user._id);
    if (chatPartner) {
        dispatch(markNotificationsAsRead(chatPartner._id));
    }
  };

  const handleDeleteConversation = async (e, chat, chatPartnerId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this entire conversation permanently?")) return;
    
    setActingOn(chat._id);
    try {
        await api.delete(`/chat/conversation/${chat._id}`);
        dispatch(removeConversation(chat._id));
        if (socket && chatPartnerId) {
            socket.emit("deleteConversation", { conversationId: chat._id, receiverId: chatPartnerId });
        }
    } catch (error) {
        console.error('Failed to delete conversaton', error);
        alert('Failed to delete conversation.');
    } finally {
        setActingOn(null);
    }
  };

  const handleTogglePin = async (e, chat) => {
    e.stopPropagation();
    setActingOn(chat._id);
    try {
        await api.put(`/chat/conversation/${chat._id}/pin`);
        dispatch(togglePinConversation({ conversationId: chat._id, userId: user._id }));
    } catch (error) {
        console.error('Failed to pin conversaton', error);
    } finally {
        setActingOn(null);
    }
  };

  if (loading) return (
    <div className="h-full flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  // Sorting logic: Pinned items at the top
  const sortedConversations = [...conversations].sort((a, b) => {
      const aPinned = a.pinnedBy?.includes(user._id) ? 1 : 0;
      const bPinned = b.pinnedBy?.includes(user._id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/60 bg-white/40 sticky top-0 z-10 backdrop-blur-md">
        <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-500 tracking-tight flex items-center gap-2">
          Messages
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 text-xs text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-full font-bold shadow-lg shadow-red-500/30 ml-2 animate-pulse border border-white/50">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2 relative overflow-x-hidden">
        {sortedConversations.length === 0 ? (
          <div className="text-slate-500 font-bold text-center mt-10">No messages yet.</div>
        ) : (
          sortedConversations.map((chat) => {
            const chatPartner = chat.participants.find((p) => p._id !== user._id);
            const isOnline = onlineUsers.some((u) => u.userId === chatPartner?._id);
            const unreadCount = notifications.filter(n => n.senderId === chatPartner?._id && !n.isRead).length;
            const isPinned = chat.pinnedBy?.includes(user._id);

            return (
              <div
                key={chat._id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                  currentChat?._id === chat._id 
                    ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-blue-100 scale-[1.02] translate-x-1 ring-1 ring-blue-500/10' 
                    : 'bg-white/40 hover:bg-white/80 border border-white hover:border-blue-100 hover:shadow-md'
                }`}
              >
                {/* Floating Actions on Hover */}
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-300 ${
                  currentChat?._id === chat._id ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}>
                    <button 
                        onClick={(e) => handleTogglePin(e, chat)} 
                        disabled={actingOn === chat._id}
                        className={`p-2 rounded-xl backdrop-blur-md shadow-sm border transition-all ${
                            isPinned ? 'bg-blue-100/80 text-blue-600 border-blue-200 hover:bg-blue-200' : 'bg-white/90 text-slate-400 hover:text-blue-600 border-white hover:shadow-md'
                        }`}
                        title={isPinned ? "Unpin Chat" : "Pin Chat"}
                    >
                        <Pin size={16} strokeWidth={isPinned ? 3 : 2} className={isPinned ? "fill-blue-600/20" : ""} />
                    </button>
                    
                    <button 
                        onClick={(e) => handleDeleteConversation(e, chat, chatPartner?._id)} 
                        disabled={actingOn === chat._id}
                        className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-rose-400 hover:text-white hover:bg-rose-500 border border-white hover:border-rose-500 shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                        title="Delete Chat"
                    >
                        <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                    
                    {/* Background to mask text when actions appear */}
                    <div className="absolute -left-8 w-8 h-full bg-gradient-to-r from-transparent to-white pointer-events-none mix-blend-multiply"></div>
                </div>

                <div className="relative shrink-0 z-0">
                  {chatPartner?.profileImage ? (
                    <img src={`${BASE_URL}${chatPartner.profileImage}`} alt={chatPartner.name} className="w-14 h-14 rounded-2xl object-cover border border-white shadow-sm group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-inner group-hover:scale-105 transition-transform border border-white/50">
                      {chatPartner?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isOnline && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm animate-pulse"></span>
                  )}
                </div>
                
                <div className="ml-4 flex-1 min-w-0 pr-8 group-hover:pr-20 transition-all duration-300 z-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-black flex items-center gap-1.5 truncate ${currentChat?._id === chat._id ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {chatPartner?.name}
                      {isPinned && <Pin size={12} strokeWidth={3} className="text-blue-500 shrink-0" />}
                    </h3>
                    {unreadCount > 0 && (
                      <span className="bg-cyan-500 text-white text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full shadow-md shadow-cyan-500/20 shrink-0">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate font-medium ${currentChat?._id === chat._id || unreadCount > 0 ? 'text-slate-700 font-bold' : 'text-slate-500'}`}>
                    {chat.lastMessage || 'Start a conversation'}
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
