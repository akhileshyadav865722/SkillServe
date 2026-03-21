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
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c._id !== action.payload);
      if (state.currentChat && state.currentChat._id === action.payload) {
        state.currentChat = null; // Clear active chat if it was deleted
      }
    },
    togglePinConversation: (state, action) => {
      const { conversationId, userId } = action.payload;
      state.conversations = state.conversations.map(c => {
        if (c._id === conversationId) {
            // Guarantee pinnedBy array exists
            const pinnedBy = c.pinnedBy || [];
            const isPinned = pinnedBy.includes(userId);
            return { ...c, pinnedBy: isPinned ? pinnedBy.filter(id => id !== userId) : [...pinnedBy, userId] };
        }
        return c;
      });
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
    removeMessage: (state, action) => {
      // action.payload is the messageId
      state.messages = state.messages.filter(msg => msg._id !== action.payload);
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
  removeConversation,
  togglePinConversation,
  setCurrentChat,
  setMessages,
  addMessage,
  removeMessage,
  setOnlineUsers,
  setSocket,
  setNotifications,
  addNotification,
  markNotificationsAsRead,
} = chatSlice.actions;

export default chatSlice.reducer;
