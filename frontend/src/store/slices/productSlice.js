// src/store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  postWithToken, 
  getWithToken, 
  putWithToken, 
  deleteWithToken 
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for product operations
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.product);

      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch products");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.product}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Product not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(productData, endPoint.product);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create Product");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.product}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update Product");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.product}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete Product");
      }
      return id; // Return the deleted product ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    
      // Fetch Single Product
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.products.findIndex(
          (prod) => prod._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(
          (prod) => prod._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;