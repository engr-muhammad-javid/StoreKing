// src/store/slices/sliderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

export const fetchSliders = createAsyncThunk('slider/fetchSliders', async (_, { rejectWithValue }) => {
  try {
    const res = await getWithToken(endPoint.slider);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createSlider = createAsyncThunk('slider/createSlider', async (data, { rejectWithValue }) => {
  try {
    const res = await postWithToken(data, endPoint.slider);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateSlider = createAsyncThunk('slider/updateSlider', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await putWithToken(data, `${endPoint.slider}/${id}`);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteSlider = createAsyncThunk('slider/deleteSlider', async (id, { rejectWithValue }) => {
  try {
    const res = await deleteWithToken(`${endPoint.slider}/${id}`);
    return res.status ? id : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const sliderSlice = createSlice({
  name: 'slider',
  initialState: {
    sliders: [],
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
    resetSliderState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliders.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.sliders = action.payload;
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      .addCase(createSlider.pending, (state) => {
        state.loading.create = true;
        state.success = false;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.sliders.push(action.payload);
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      .addCase(updateSlider.pending, (state) => {
        state.loading.update = true;
        state.success = false;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.sliders.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.sliders[index] = action.payload;
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      .addCase(deleteSlider.pending, (state) => {
        state.loading.delete = true;
        state.success = false;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.sliders = state.sliders.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetSliderState } = sliderSlice.actions;
export default sliderSlice.reducer;
