// src/store/brandSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for brand operations
export const fetchBrands = createAsyncThunk(
  "brand/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.brand);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch brands");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleBrand = createAsyncThunk(
  "brand/fetchSingleBrand",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.brand}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Brand not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (brandData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(brandData, endPoint.brand);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create brand");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.brand}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update brand");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.brand}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete brand");
      }
      return id; // Return the deleted brand ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productBrandSlice = createSlice({
  name: "brand",
  initialState: {
    brands: [],
    currentBrand: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetBrandState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Brand
      .addCase(fetchSingleBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchSingleBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Brand
      .addCase(createBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Brand
      .addCase(updateBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.brands.findIndex(
          (brd) => brd._id === action.payload._id
        );
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.currentBrand?._id === action.payload._id) {
          state.currentBrand = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Brand
      .addCase(deleteBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.brands = state.brands.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBrandState, clearCurrentBrand } = productBrandSlice.actions;
export default productBrandSlice.reducer;