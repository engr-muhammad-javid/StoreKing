// src/store/slices/mailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch Mail Settings
export const fetchMail = createAsyncThunk(
  "mail/fetchMail",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.mail);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch mail settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create Mail Settings
export const createMail = createAsyncThunk(
  "mail/createMail",
  async (mailData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(mailData, endPoint.mail);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create mail settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Mail Settings
export const updateMail = createAsyncThunk(
  "mail/updateMail",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.mail);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update mail settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState: {
    mail: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
    },
    success: false,
    error: null,
  },
  reducers: {
    resetMailState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMail.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchMail.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.mail = action.payload;
      })
      .addCase(fetchMail.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createMail.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMail.fulfilled, (state, action) => {
        state.loading.create = false;
        state.mail = action.payload;
        state.success = true;
      })
      .addCase(createMail.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateMail.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMail.fulfilled, (state, action) => {
        state.loading.update = false;
        state.mail = action.payload;
        state.success = true;
      })
      .addCase(updateMail.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetMailState } = mailSlice.actions;
export default mailSlice.reducer;
