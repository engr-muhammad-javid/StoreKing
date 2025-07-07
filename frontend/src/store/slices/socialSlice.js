// src/store/slices/socialSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postWithToken, getWithToken, putWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch social links
export const fetchSocial = createAsyncThunk(
  "social/fetchSocial",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.social);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create social links
export const createSocial = createAsyncThunk(
  "social/createSocial",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.social);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update social links
export const updateSocial = createAsyncThunk(
  "social/updateSocial",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.social);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update");
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const socialSlice = createSlice({
  name: "social",
  initialState: {
    social: null,
    loading: { fetch: false, create: false, update: false },
    success: false,
    error: null,
  },
  reducers: {
    resetSocialState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocial.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchSocial.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.social = action.payload;
      })
      .addCase(fetchSocial.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createSocial.pending, (state) => {
        state.loading.create = true;
        state.success = false;
      })
      .addCase(createSocial.fulfilled, (state, action) => {
        state.loading.create = false;
        state.social = action.payload;
        state.success = true;
      })
      .addCase(createSocial.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateSocial.pending, (state) => {
        state.loading.update = true;
        state.success = false;
      })
      .addCase(updateSocial.fulfilled, (state, action) => {
        state.loading.update = false;
        state.social = action.payload;
        state.success = true;
      })
      .addCase(updateSocial.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetSocialState } = socialSlice.actions;
export default socialSlice.reducer;
