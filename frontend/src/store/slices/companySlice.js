// src/store/companySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for company operations
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.company);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch company");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (companyData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(companyData, endPoint.company);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create company");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({data}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, endPoint.company);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update company");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    company: [],
    currentBrand: null,
    loading: false,
    error: null,
    success: false,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Company
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.company = false;
      })
      
      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.company = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default companySlice.reducer;