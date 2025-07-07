import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Fetch Company
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

// Create Company
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

// Update Company
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ data }, { rejectWithValue }) => {
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

// Slice
const companySlice = createSlice({
  name: "company",
  initialState: {
    company: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
    },
    error: null,
    success: false,
  },
  reducers: {
    resetCompanyState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = {
        fetch: false,
        create: false,
        update: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Company
      .addCase(fetchCompany.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.company = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Create Company
      .addCase(createCompany.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading.create = false;
        state.company = action.payload;
        state.success = true;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update Company
      .addCase(updateCompany.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading.update = false;
        state.company = action.payload;
        state.success = true;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      });
  },
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;
