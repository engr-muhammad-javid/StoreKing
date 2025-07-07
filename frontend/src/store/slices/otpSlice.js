// src/store/slices/otpSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch OTP settings
export const fetchOtp = createAsyncThunk(
  "otp/fetchOtp",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.otp);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch OTP settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create OTP settings
export const createOtp = createAsyncThunk(
  "otp/createOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(otpData, endPoint.otp);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create OTP settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update OTP settings
export const updateOtp = createAsyncThunk(
  "otp/updateOtp",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.otp);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update OTP settings");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    otp: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
    },
    success: false,
    error: null,
  },
  reducers: {
    resetOtpState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtp.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchOtp.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.otp = action.payload;
      })
      .addCase(fetchOtp.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createOtp.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOtp.fulfilled, (state, action) => {
        state.loading.create = false;
        state.otp = action.payload;
        state.success = true;
      })
      .addCase(createOtp.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateOtp.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOtp.fulfilled, (state, action) => {
        state.loading.update = false;
        state.otp = action.payload;
        state.success = true;
      })
      .addCase(updateOtp.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer;
