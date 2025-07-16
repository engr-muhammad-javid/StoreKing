// src/store/slices/supplierSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getWithToken,
  postWithToken,
  putWithToken,
  deleteWithToken
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.supplier);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.supplier);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.supplier}/${id}`);
      return resp.status ? resp.content : rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.supplier}/${id}`);
      return resp.status ? id : rejectWithValue(resp.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: null,
    success: false,
  },
  reducers: {
    resetSupplierState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createSupplier.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.suppliers.push(action.payload);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateSupplier.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.suppliers.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.suppliers[index] = action.payload;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(deleteSupplier.pending, (state) => {
        state.loading.delete = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.suppliers = state.suppliers.filter(s => s._id !== action.payload);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetSupplierState } = supplierSlice.actions;
export default supplierSlice.reducer;
