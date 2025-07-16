// src/store/slices/themeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWithToken, postWithToken, putWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch Theme
export const fetchTheme = createAsyncThunk(
  "theme/fetchTheme",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.theme);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to fetch theme");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create Theme
export const createTheme = createAsyncThunk(
  "theme/createTheme",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.theme);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to create theme");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update Theme
export const updateTheme = createAsyncThunk(
  "theme/updateTheme",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.theme);
      if (!resp.status) return rejectWithValue(resp.message || "Failed to update theme");
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: null,
    loading: { fetch: false, create: false, update: false },
    success: false,
    error: null,
  },
  reducers: {
    resetThemeState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = { fetch: false, create: false, update: false };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheme.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchTheme.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.theme = action.payload;
      })
      .addCase(fetchTheme.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      .addCase(createTheme.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(createTheme.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.theme = action.payload;
      })
      .addCase(createTheme.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      .addCase(updateTheme.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(updateTheme.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        state.theme = action.payload;
      })
      .addCase(updateTheme.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetThemeState } = themeSlice.actions;
export default themeSlice.reducer;
