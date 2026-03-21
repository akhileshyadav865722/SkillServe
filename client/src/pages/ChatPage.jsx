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
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50 relative overflow-hidden isolate" style={{ height: 'calc(100vh - 81px)' }}>
      
      {/* Cool Multi-Color Aurora Gradients matching RequestsList */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-300/60 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-cyan-300/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-blue-300/50 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[50%] left-[50%] w-[30%] h-[40%] bg-violet-300/50 rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-6xl h-full mx-auto bg-white/40 backdrop-blur-3xl rounded-[32px] overflow-hidden border border-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] relative z-10 transition-all">
        {/* Sidebar (Top on mobile, Left on desktop) */}
        <div className="h-[120px] sm:h-[180px] md:h-full w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white/50 md:z-20 overflow-y-auto border-b md:border-b-0 md:border-r border-white/80 relative z-30 shadow-[4px_0_30px_rgb(0,0,0,0.02)]">
          <ConversationList />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 bg-white/30 flex flex-col relative z-10 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
