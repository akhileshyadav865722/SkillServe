import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabling because socket instances are non-serializable
    }),
});
