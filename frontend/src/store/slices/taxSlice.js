// src/store/slices/taxSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithToken,
  getWithToken,
  putWithToken,
  deleteWithToken,
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// ─── Async Thunks ───────────────────────────────────────────────
export const fetchTaxes = createAsyncThunk(
  "tax/fetchTaxes",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.tax);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch taxes");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTax = createAsyncThunk(
  "tax/createTax",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.tax);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create tax");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateTax = createAsyncThunk(
  "tax/updateTax",
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.tax}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update tax");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTax = createAsyncThunk(
  "tax/deleteTax",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.tax}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete tax");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ─── Slice ──────────────────────────────────────────────────────
const taxSlice = createSlice({
  name: "tax",
  initialState: {
    taxes: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    error: null,
    success: false,
  },
  reducers: {
    resetTaxState: (state) => {
      state.loading = {
        fetch: false,
        create: false,
        update: false,
        delete: false,
      };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTaxes.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.taxes = action.payload;
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createTax.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.taxes.push(action.payload);
      })
      .addCase(createTax.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateTax.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.taxes.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.taxes[index] = action.payload;
        }
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteTax.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.taxes = state.taxes.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetTaxState } = taxSlice.actions;
export default taxSlice.reducer;
