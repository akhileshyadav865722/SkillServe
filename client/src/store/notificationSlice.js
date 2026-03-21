import { createSlice } from '@reduxjs/toolkit';

let storedNs = [];
try {
  const item = localStorage.getItem('skillserve_notifications');
  if (item) storedNs = JSON.parse(item);
} catch (e) {
  storedNs = [];
}

const initialState = {
  notifications: storedNs
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(newNotification);
      localStorage.setItem('skillserve_notifications', JSON.stringify(state.notifications));
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      localStorage.setItem('skillserve_notifications', JSON.stringify(state.notifications));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      localStorage.setItem('skillserve_notifications', JSON.stringify([]));
    }
  }
});

export const { addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
