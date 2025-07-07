// src/store/slices/deliveryZoneSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postWithToken, getWithToken, putWithToken, deleteWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Thunks
export const fetchDeliveryZones = createAsyncThunk("deliveryZone/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const resp = await getWithToken(endPoint.deliveryZone);
    if (!resp.status) return rejectWithValue(resp.message);
    return resp.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createDeliveryZone = createAsyncThunk("deliveryZone/create", async (data, { rejectWithValue }) => {
  try {
    const resp = await postWithToken(data, endPoint.deliveryZone);
    if (!resp.status) return rejectWithValue(resp.message);
    return resp.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateDeliveryZone = createAsyncThunk("deliveryZone/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const resp = await putWithToken(data, `${endPoint.deliveryZone}/${id}`);
    if (!resp.status) return rejectWithValue(resp.message);
    return resp.content;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteDeliveryZone = createAsyncThunk("deliveryZone/delete", async (id, { rejectWithValue }) => {
  try {
    const resp = await deleteWithToken(`${endPoint.deliveryZone}/${id}`);
    if (!resp.status) return rejectWithValue(resp.message);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Slice
const deliveryZoneSlice = createSlice({
  name: "deliveryZone",
  initialState: {
    deliveryZones: [],
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
    resetDeliveryZoneState: (state) => {
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
      .addCase(fetchDeliveryZones.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchDeliveryZones.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.deliveryZones = action.payload;
      })
      .addCase(fetchDeliveryZones.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createDeliveryZone.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDeliveryZone.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.deliveryZones.push(action.payload);
      })
      .addCase(createDeliveryZone.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateDeliveryZone.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDeliveryZone.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const idx = state.deliveryZones.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) state.deliveryZones[idx] = action.payload;
      })
      .addCase(updateDeliveryZone.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDeliveryZone.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteDeliveryZone.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.deliveryZones = state.deliveryZones.filter((z) => z._id !== action.payload);
      })
      .addCase(deleteDeliveryZone.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeliveryZoneState } = deliveryZoneSlice.actions;
export default deliveryZoneSlice.reducer;
