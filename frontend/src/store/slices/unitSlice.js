// src/store/unitSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for unit operations
export const fetchUnits = createAsyncThunk(
  "unit/fetchUnits",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.unit);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch units");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleUnit = createAsyncThunk(
  "unit/fetchSingleUnit",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.unit}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Unit not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createUnit = createAsyncThunk(
  "unit/createUnit",
  async (unitData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(unitData, endPoint.unit);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create unit");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUnit = createAsyncThunk(
  "unit/updateUnit",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.unit}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update unit");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteUnit = createAsyncThunk(
  "unit/deleteUnit",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.unit}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete unit");
      }
      return id; // Return the deleted unit ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    units: [],
    currentUnit: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUnitState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentUnit: (state) => {
      state.currentUnit = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Units
      .addCase(fetchUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnits.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Unit
      .addCase(fetchSingleUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUnit = action.payload;
      })
      .addCase(fetchSingleUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Unit
      .addCase(createUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.units.push(action.payload);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Unit
      .addCase(updateUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.units.findIndex(
          (unt) => unt._id === action.payload._id
        );
        if (index !== -1) {
          state.units[index] = action.payload;
        }
        if (state.currentUnit?._id === action.payload._id) {
          state.currentUnit = action.payload;
        }
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Unit
      .addCase(deleteUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.units = state.units.filter(
          (unt) => unt._id !== action.payload
        );
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUnitState, clearCurrentUnit } = unitSlice.actions;
export default unitSlice.reducer;