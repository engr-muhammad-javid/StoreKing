// src/store/slices/cookieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWithToken, postWithToken, putWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch cookies settings
export const fetchCookie = createAsyncThunk(
  "cookie/fetchCookie",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.cookie);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch cookie");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create cookie settings
export const createCookie = createAsyncThunk(
  "cookie/createCookie",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.cookie);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create cookie");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update cookie settings
export const updateCookie = createAsyncThunk(
  "cookie/updateCookie",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.cookie);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update cookie");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cookieSlice = createSlice({
  name: "cookie",
  initialState: {
    cookie: null,
    loading: { fetch: false, create: false, update: false },
    success: false,
    error: null,
  },
  reducers: {
    resetCookieState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCookie.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchCookie.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.cookie = action.payload;
      })
      .addCase(fetchCookie.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createCookie.pending, (state) => {
        state.loading.create = true;
        state.success = false;
      })
      .addCase(createCookie.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.cookie = action.payload;
      })
      .addCase(createCookie.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateCookie.pending, (state) => {
        state.loading.update = true;
        state.success = false;
      })
      .addCase(updateCookie.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        state.cookie = action.payload;
      })
      .addCase(updateCookie.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetCookieState } = cookieSlice.actions;
export default cookieSlice.reducer;
