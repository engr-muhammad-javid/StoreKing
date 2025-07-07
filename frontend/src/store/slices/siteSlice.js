// src/store/slices/siteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunk: Fetch Site Settings
export const fetchSite = createAsyncThunk(
  "site/fetchSite",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.site);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch site");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk: Create Site Settings
export const createSite = createAsyncThunk(
  "site/createSite",
  async (siteData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(siteData, endPoint.site);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create site");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk: Update Site Settings
export const updateSite = createAsyncThunk(
  "site/updateSite",
  async ({ data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.site);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update site");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const siteSlice = createSlice({
  name: "site",
  initialState: {
    site: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
    },
    error: null,
    success: false,
  },
  reducers: {
    resetSiteState: (state) => {
      state.loading = {
        fetch: false,
        create: false,
        update: false,
      };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Site
      .addCase(fetchSite.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchSite.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.site = action.payload;
      })
      .addCase(fetchSite.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
        state.site = null;
      })

      // Create Site
      .addCase(createSite.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.site = action.payload;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update Site
      .addCase(updateSite.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        state.site = action.payload;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetSiteState } = siteSlice.actions;
export default siteSlice.reducer;
