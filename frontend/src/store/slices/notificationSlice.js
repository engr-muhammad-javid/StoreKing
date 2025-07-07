// src/store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch notification settings
export const fetchNotification = createAsyncThunk(
  "notification/fetchNotification",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.notification);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create notification settings
export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.notification);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update notification settings
export const updateNotification = createAsyncThunk(
  "notification/updateNotification",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.notification);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
    },
    success: false,
    error: null,
  },
  reducers: {
    resetNotificationState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotification.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchNotification.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.notification = action.payload;
      })
      .addCase(fetchNotification.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createNotification.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.loading.create = false;
        state.notification = action.payload;
        state.success = true;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateNotification.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.loading.update = false;
        state.notification = action.payload;
        state.success = true;
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
