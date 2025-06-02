import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for tax operations
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

export const fetchSingleTax = createAsyncThunk(
  "tax/fetchSingleTax",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.tax}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Tax not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createTax = createAsyncThunk(
  "tax/createTax",
  async (taxData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(taxData, endPoint.tax);
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
      return id; // Return the deleted tax ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    taxes: [],
    currentTax: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetTaxState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentTax: (state) => {
      state.currentTax = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Taxes
      .addCase(fetchTaxes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.loading = false;
        state.taxes = action.payload;
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Tax
      .addCase(fetchSingleTax.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleTax.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTax = action.payload;
      })
      .addCase(fetchSingleTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Tax
      .addCase(createTax.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.taxes.push(action.payload);
      })
      .addCase(createTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Tax
      .addCase(updateTax.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.taxes.findIndex((tax) => tax._id === action.payload._id);
        if (index !== -1) {
          state.taxes[index] = action.payload;
        }
        if (state.currentTax?._id === action.payload._id) {
          state.currentTax = action.payload;
        }
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Tax
      .addCase(deleteTax.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.taxes = state.taxes.filter((tax) => tax._id !== action.payload);
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTaxState, clearCurrentTax } = taxSlice.actions;
export default taxSlice.reducer;
