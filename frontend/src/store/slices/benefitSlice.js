// src/store/slices/benefitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

// Async actions
export const fetchBenefits = createAsyncThunk('benefit/fetchBenefits', async (_, { rejectWithValue }) => {
  try {
    const resp = await getWithToken(endPoint.benefit);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createBenefit = createAsyncThunk('benefit/createBenefit', async (data, { rejectWithValue }) => {
  try {
    const resp = await postWithToken(data, endPoint.benefit);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateBenefit = createAsyncThunk('benefit/updateBenefit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const resp = await putWithToken(data, `${endPoint.benefit}/${id}`);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteBenefit = createAsyncThunk('benefit/deleteBenefit', async (id, { rejectWithValue }) => {
  try {
    const resp = await deleteWithToken(`${endPoint.benefit}/${id}`);
    return resp.status ? id : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const benefitSlice = createSlice({
  name: 'benefit',
  initialState: {
    benefits: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: null,
    success: false,
  },
  reducers: {
    resetBenefitState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBenefits.pending, (state) => { state.loading.fetch = true; })
      .addCase(fetchBenefits.fulfilled, (state, action) => { state.loading.fetch = false; state.benefits = action.payload; })
      .addCase(fetchBenefits.rejected, (state, { payload }) => { state.loading.fetch = false; state.error = payload; })

      .addCase(createBenefit.pending, (state) => { state.loading.create = true; })
      .addCase(createBenefit.fulfilled, (state, action) => { state.loading.create = false; state.success = true; state.benefits.push(action.payload); })
      .addCase(createBenefit.rejected, (state, { payload }) => { state.loading.create = false; state.error = payload; })

      .addCase(updateBenefit.pending, (state) => { state.loading.update = true; })
      .addCase(updateBenefit.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const idx = state.benefits.findIndex(b => b._id === action.payload._id);
        if (idx !== -1) state.benefits[idx] = action.payload;
      })
      .addCase(updateBenefit.rejected, (state, { payload }) => { state.loading.update = false; state.error = payload; })

      .addCase(deleteBenefit.pending, (state) => { state.loading.delete = true; })
      .addCase(deleteBenefit.fulfilled, (state, { payload }) => {
        state.loading.delete = false;
        state.success = true;
        state.benefits = state.benefits.filter(b => b._id !== payload);
      })
      .addCase(deleteBenefit.rejected, (state, { payload }) => { state.loading.delete = false; state.error = payload; });
  },
});

export const { resetBenefitState } = benefitSlice.actions;
export default benefitSlice.reducer;
