// src/store/deliveryZoneSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for deliveryZone operations
export const fetchdeliveryZones = createAsyncThunk(
  "deliveryZone/fetchdeliveryZones",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.deliveryZone);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch deliveryZones");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingledeliveryZone = createAsyncThunk(
  "deliveryZone/fetchSingledeliveryZone",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.deliveryZone}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "deliveryZone not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createdeliveryZone = createAsyncThunk(
  "deliveryZone/createdeliveryZone",
  async (deliveryZoneData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(deliveryZoneData, endPoint.deliveryZone);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create deliveryZone");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatedeliveryZone = createAsyncThunk(
  "deliveryZone/updatedeliveryZone",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.deliveryZone}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update deliveryZone");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deletedeliveryZone = createAsyncThunk(
  "deliveryZone/deletedeliveryZone",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.deliveryZone}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete deliveryZone");
      }
      return id; // Return the deleted deliveryZone ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const deliveryZoneSlice = createSlice({
  name: "deliveryZone",
  initialState: {
    deliveryZones: [],
    currentdeliveryZone: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetdeliveryZoneState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentdeliveryZone: (state) => {
      state.currentdeliveryZone = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch deliveryZones
      .addCase(fetchdeliveryZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchdeliveryZones.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.deliveryZones = action.payload;
      })
      .addCase(fetchdeliveryZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single deliveryZone
      .addCase(fetchSingledeliveryZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingledeliveryZone.fulfilled, (state, action) => {
        state.loading = false;
        state.currentdeliveryZone = action.payload;
      })
      .addCase(fetchSingledeliveryZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create deliveryZone
      .addCase(createdeliveryZone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createdeliveryZone.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deliveryZones.push(action.payload);
      })
      .addCase(createdeliveryZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update deliveryZone
      .addCase(updatedeliveryZone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatedeliveryZone.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.deliveryZones.findIndex(
          (brd) => brd._id === action.payload._id
        );
        if (index !== -1) {
          state.deliveryZones[index] = action.payload;
        }
        if (state.currentdeliveryZone?._id === action.payload._id) {
          state.currentdeliveryZone = action.payload;
        }
      })
      .addCase(updatedeliveryZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete deliveryZone
      .addCase(deletedeliveryZone.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletedeliveryZone.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deliveryZones = state.deliveryZones.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deletedeliveryZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetdeliveryZoneState, clearCurrentdeliveryZone } = deliveryZoneSlice.actions;
export default deliveryZoneSlice.reducer;