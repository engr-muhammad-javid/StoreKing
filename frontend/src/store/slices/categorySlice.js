// src/store/categorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postWithToken, getWithToken, putWithToken, deleteWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// Async thunks for category operations
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.category);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch categories");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategoryTree = createAsyncThunk(
  "category/fetchCategoryTree",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.category}/tree`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to fetch category tree");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleCategory = createAsyncThunk(
  "category/fetchSingleCategory",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(`${endPoint.category}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Category not found");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(categoryData, endPoint.category);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to create category");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.category}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to update category");
      }
      return resp.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.category}/${id}`);
      if (!resp.status) {
        return rejectWithValue(resp.message || "Failed to delete category");
      }
      return id; // Return the deleted category ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    categoryTree: [],
    currentCategory: null,
    loading: {
      fetch: false,
      fetchSingle: false,
      fetchTree: false,
      create: false,
      update: false,
      delete: false,
    },
    error: null,
    success: false,
  },
  reducers: {
    resetCategoryState: (state) => {
      state.currentCategory = null;
      state.loading = {
        fetch: false,
        fetchSingle: false,
        create: false,
        update: false,
        delete: false,
      };
      state.error = null;
      state.success = false;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })
      
      // Fetch Category Tree
      .addCase(fetchCategoryTree.pending, (state) => {
        state.loading.fetchTree = true;
        state.error = null;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading.fetchTree = false;
        state.categoryTree = action.payload;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading.fetchTree = false;
        state.error = action.payload;
      })
      
      // Fetch Single Category
      .addCase(fetchSingleCategory.pending, (state) => {
        state.loading.fetchSingle = true;
        state.error = null;
      })
      .addCase(fetchSingleCategory.fulfilled, (state, action) => {
        state.loading.fetchSingle = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchSingleCategory.rejected, (state, action) => {
        state.loading.fetchSingle = false;
        state.error = action.payload;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.loading.create = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading.update = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?._id === action.payload._id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })
      
      // Delete Category
      .addCase(deleteCategory.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetCategoryState, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;