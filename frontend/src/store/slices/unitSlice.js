// src/store/slices/unitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWithToken,
  postWithToken,
  putWithToken,
  deleteWithToken,
} from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

// Thunks
export const fetchUnits = createAsyncThunk('unit/fetchUnits', async (_, { rejectWithValue }) => {
  try {
    const res = await getWithToken(endPoint.unit);
    if (!res.status) return rejectWithValue(res.message || 'Failed to fetch units');
    return res.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createUnit = createAsyncThunk('unit/createUnit', async (data, { rejectWithValue }) => {
  try {
    const res = await postWithToken(data, endPoint.unit);
    if (!res.status) return rejectWithValue(res.message || 'Failed to create unit');
    return res.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateUnit = createAsyncThunk('unit/updateUnit', async ({ data, id }, { rejectWithValue }) => {
  try {
    const res = await putWithToken(data, `${endPoint.unit}/${id}`);
    if (!res.status) return rejectWithValue(res.message || 'Failed to update unit');
    return res.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteUnit = createAsyncThunk('unit/deleteUnit', async (id, { rejectWithValue }) => {
  try {
    const res = await deleteWithToken(`${endPoint.unit}/${id}`);
    if (!res.status) return rejectWithValue(res.message || 'Failed to delete unit');
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const unitSlice = createSlice({
  name: 'unit',
  initialState: {
    units: [],
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
    resetUnitState: (state) => {
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
      .addCase(fetchUnits.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      .addCase(createUnit.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.units.push(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      .addCase(updateUnit.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.units.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.units[index] = action.payload;
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      .addCase(deleteUnit.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.units = state.units.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetUnitState } = unitSlice.actions;
export default unitSlice.reducer;
