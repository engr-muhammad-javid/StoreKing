import { createSlice } from '@reduxjs/toolkit';

// Default messages by key
const defaultMessages = {
  1: 'Your order is successfully placed.',
  2: 'Your order is confirmed.',
  3: 'Your order is on the way.',
  4: 'Your order is successfully delivered.',
  5: 'Your order is canceled.',
  6: 'Your order is rejected.',
  7: 'You have a new order.',
  8: 'You have been assigned an order for delivery.',
};

// Notification types
const notificationTypes = ['mail', 'sms', 'push_notification'];

// Generate initial state for all notification types and keys
const generateInitialState = () => {
  const state = {};
  notificationTypes.forEach((type) => {
    state[type] = {};
    Object.entries(defaultMessages).forEach(([key, message]) => {
      state[type][key] = {
        enabled: false,
        message,
      };
    });
  });
  return state;
};

const initialState = {
  data: generateInitialState(),
};

const notificationAlertSlice = createSlice({
  name: 'notificationAlert',
  initialState,
  reducers: {
    toggleNotificationAlertMessage: (state, action) => {
      const { type, key } = action.payload;
      if (state.data[type] && state.data[type][key]) {
        state.data[type][key].enabled = !state.data[type][key].enabled;
      }
    },
    updateNotificationAlertMessage: (state, action) => {
      const { type, key, message } = action.payload;
      if (state.data[type] && state.data[type][key]) {
        state.data[type][key].message = message;
      }
    },
    setNotificationAlertState: (state, action) => {
      const newData = action.payload;
      if (newData && typeof newData === 'object') {
        state.data = newData;
      }
    },
  },
});

export const {
  toggleNotificationAlertMessage,
  updateNotificationAlertMessage,
  setNotificationAlertState,
} = notificationAlertSlice.actions;

export default notificationAlertSlice.reducer;
