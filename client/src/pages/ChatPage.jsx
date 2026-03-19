import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setSocket, setOnlineUsers } from '../store/chatSlice';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { BASE_URL } from '../api/axios';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const newSocket = io(BASE_URL);
      dispatch(setSocket(newSocket));

      newSocket.emit('addNewUser', user._id);

      newSocket.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, dispatch]);

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-blob-gradient overflow-hidden" style={{ height: 'calc(100vh - 81px)' }}>
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-full mx-auto glass rounded-[32px] overflow-hidden border border-white/60 shadow-2xl relative z-10 transition-all">
        {/* Sidebar (Top on mobile, Left on desktop) */}
        <div className="h-[120px] sm:h-[180px] md:h-full w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white/60 backdrop-blur-xl md:z-20 overflow-y-auto shadow-[0_4px_30px_rgba(0,0,0,0.06)] md:shadow-[4px_0_30px_rgba(0,0,0,0.06)] border-b md:border-b-0 md:border-r border-white/60 relative z-30">
          <ConversationList />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white/50 backdrop-blur-md flex flex-col relative z-10 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
