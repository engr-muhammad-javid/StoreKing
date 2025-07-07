// src/store/slices/currencySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  postWithToken,
  getWithToken,
  putWithToken,
  deleteWithToken
} from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

// Fetch all currencies
export const fetchCurrencies = createAsyncThunk(
  'currency/fetchCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.currency);
      if (!resp.status) {
        return rejectWithValue(resp.message || 'Failed to fetch currencies');
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch single currency
export const fetchSingleCurrency = createAsyncThunk(
  'currency/fetchSingleCurrency',
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || 'Currency not found');
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create currency
export const createCurrency = createAsyncThunk(
  'currency/createCurrency',
  async (currencyData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(currencyData, endPoint.currency);
      if (!resp.status) {
        return rejectWithValue(resp.message || 'Failed to create currency');
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update currency
export const updateCurrency = createAsyncThunk(
  'currency/updateCurrency',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || 'Failed to update currency');
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete currency
export const deleteCurrency = createAsyncThunk(
  'currency/deleteCurrency',
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.currency}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || 'Failed to delete currency');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice definition
const currencySlice = createSlice({
  name: 'currency',
  initialState: {
    currencies: [],
    currentCurrency: null,
    loading: {
      fetch: false,
      fetchSingle: false,
      create: false,
      update: false,
      delete: false
    },
    error: null,
    success: false
  },
  reducers: {
    resetCurrencyState: (state) => {
      state.loading = {
        fetch: false,
        fetchSingle: false,
        create: false,
        update: false,
        delete: false
      };
      state.error = null;
      state.success = false;
    },
    clearCurrentCurrency: (state) => {
      state.currentCurrency = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Currencies
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Fetch Single Currency
      .addCase(fetchSingleCurrency.pending, (state) => {
        state.loading.fetchSingle = true;
        state.error = null;
      })
      .addCase(fetchSingleCurrency.fulfilled, (state, action) => {
        state.loading.fetchSingle = false;
        state.currentCurrency = action.payload;
      })
      .addCase(fetchSingleCurrency.rejected, (state, action) => {
        state.loading.fetchSingle = false;
        state.error = action.payload;
      })

      // Create Currency
      .addCase(createCurrency.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCurrency.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.currencies.push(action.payload);
      })
      .addCase(createCurrency.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update Currency
      .addCase(updateCurrency.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.currencies.findIndex(
          (cur) => cur._id === action.payload._id
        );
        if (index !== -1) {
          state.currencies[index] = action.payload;
        }
        if (state.currentCurrency?._id === action.payload._id) {
          state.currentCurrency = action.payload;
        }
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete Currency
      .addCase(deleteCurrency.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.currencies = state.currencies.filter(
          (cur) => cur._id !== action.payload
        );
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  }
});

export const { resetCurrencyState, clearCurrentCurrency } = currencySlice.actions;
export default currencySlice.reducer;
