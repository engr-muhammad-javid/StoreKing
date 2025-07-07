import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  entity: null,
  mode: 'add',
  initialData: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.entity = action.payload.entity;
      state.mode = action.payload.mode || 'add';
      state.initialData = action.payload.initialData || {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.entity = null;
      state.mode = 'add';
      state.initialData = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;