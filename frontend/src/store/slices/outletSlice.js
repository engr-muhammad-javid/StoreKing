// src/store/slices/outletSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks
export const fetchOutlets = createAsyncThunk(
  "outlet/fetchOutlets",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.outlet);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createOutlet = createAsyncThunk(
  "outlet/createOutlet",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.outlet);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOutlet = createAsyncThunk(
  "outlet/updateOutlet",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.outlet}/${id}`);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOutlet = createAsyncThunk(
  "outlet/deleteOutlet",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.outlet}/${id}`);
      return resp.status ? id : rejectWithValue(resp.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const outletSlice = createSlice({
  name: "outlet",
  initialState: {
    outlets: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false
    },
    error: null,
    success: false
  },
  reducers: {
    resetOutletState(state) {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOutlets.pending, state => { state.loading.fetch = true })
      .addCase(fetchOutlets.fulfilled, (state, action) => { state.loading.fetch = false; state.outlets = action.payload })
      .addCase(fetchOutlets.rejected, (state, { payload }) => { state.loading.fetch = false; state.error = payload })

      .addCase(createOutlet.pending, state => { state.loading.create = true })
      .addCase(createOutlet.fulfilled, (state, action) => { state.loading.create = false; state.success = true; state.outlets.push(action.payload) })
      .addCase(createOutlet.rejected, (state, { payload }) => { state.loading.create = false; state.error = payload })

      .addCase(updateOutlet.pending, state => { state.loading.update = true })
      .addCase(updateOutlet.fulfilled, (state, action) => {
        state.loading.update = false; state.success = true;
        const idx = state.outlets.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.outlets[idx] = action.payload;
      })
      .addCase(updateOutlet.rejected, (state, { payload }) => { state.loading.update = false; state.error = payload })

      .addCase(deleteOutlet.pending, state => { state.loading.delete = true })
      .addCase(deleteOutlet.fulfilled, (state, { payload }) => {
        state.loading.delete = false; state.success = true;
        state.outlets = state.outlets.filter(o => o._id !== payload);
      })
      .addCase(deleteOutlet.rejected, (state, { payload }) => { state.loading.delete = false; state.error = payload });
  }
});

export const { resetOutletState } = outletSlice.actions;
export default outletSlice.reducer;
