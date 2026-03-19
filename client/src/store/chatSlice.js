import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentChat: null,
  messages: [],
  onlineUsers: [],
  socket: null,
  notifications: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationsAsRead: (state, action) => {
      const senderId = action.payload;
      state.notifications = state.notifications.map(n => 
        n.senderId === senderId ? { ...n, isRead: true } : n
      );
    },
  },
});

export const {
  setConversations,
  setCurrentChat,
  setMessages,
  addMessage,
  setOnlineUsers,
  setSocket,
  setNotifications,
  addNotification,
  markNotificationsAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
