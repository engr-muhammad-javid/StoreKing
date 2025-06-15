// src/store/siteSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for site operations
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

export const updateSite = createAsyncThunk(
  "site/updateSite",
  async ({data}, { rejectWithValue }) => {
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

const siteSlice = createSlice({
  name: "site",
  initialState: {
    site: [],
    currentBrand: null,
    loading: false,
    error: null,
    success: false,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Site
      .addCase(fetchSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSite.fulfilled, (state, action) => {
        state.loading = false;
        state.site = action.payload;
      })
      .addCase(fetchSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.site = false;
      })
      
      // Create Site
      .addCase(createSite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.site = action.payload;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Site
      .addCase(updateSite.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.site = action.payload;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default siteSlice.reducer;