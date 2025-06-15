// src/store/currencySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for currency operations
export const fetchCurrencies = createAsyncThunk(
  "currency/fetchCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      
      const resp = await getWithToken(endPoint.currency);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch currencies");
      }
      return resp.content;

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleCurrency = createAsyncThunk(
  "currency/fetchSingleCurrency",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Currency not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCurrency = createAsyncThunk(
  "currency/createCurrency",
  async (currencyData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(currencyData, endPoint.currency);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create currency");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCurrency = createAsyncThunk(
  "currency/updateCurrency",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update currency");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCurrency = createAsyncThunk(
  "currency/deleteCurrency",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete currency");
      }
      return id; // Return the deleted currency ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    currencies: [],
    currentCurrency: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCurrencyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentCurrency: (state) => {
      state.currentCurrency = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Currencies
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Currency
      .addCase(fetchSingleCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCurrency = action.payload;
      })
      .addCase(fetchSingleCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Currency
      .addCase(createCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currencies.push(action.payload);
      })
      .addCase(createCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Currency
      .addCase(updateCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.currencies.findIndex(
          (brd) => brd._id === action.payload._id
        );
        if (index !== -1) {
          state.currencies[index] = action.payload;
        }
        if (state.currentCurrency?._id === action.payload._id) {
          state.currentCurrency = action.payload;
        }
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Currency
      .addCase(deleteCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currencies = state.currencies.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCurrencyState, clearCurrentCurrency } = currencySlice.actions;
export default currencySlice.reducer;