import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

// CRUD Thunks
export const fetchAttributes = createAsyncThunk(
  'attribute/fetchAttributes',
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getWithToken(endPoint.attribute);
      if (!resp.status) return rejectWithValue(resp.message);
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createAttribute = createAsyncThunk(
  'attribute/createAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(data, endPoint.attribute);
      if (!resp.status) return rejectWithValue(resp.message);
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAttribute = createAsyncThunk(
  'attribute/updateAttribute',
  async ({ data, id }, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(data, `${endPoint.attribute}/${id}`);
      if (!resp.status) return rejectWithValue(resp.message);
      return resp.content;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAttribute = createAsyncThunk(
  'attribute/deleteAttribute',
  async (id, { rejectWithValue }) => {
    try {
      const resp = await deleteWithToken(`${endPoint.attribute}/${id}`);
      if (!resp.status) return rejectWithValue(resp.message);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const attributeSlice = createSlice({
  name: 'attribute',
  initialState: {
    attributes: [],
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
    resetAttributeState: (state) => {
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
      .addCase(fetchAttributes.pending, (state) => {
        state.loading.fetch = true;
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.attributes = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      .addCase(createAttribute.pending, (state) => {
        state.loading.create = true;
      })
      .addCase(createAttribute.fulfilled, (state, action) => {
        state.loading.create = false;
        state.success = true;
        state.attributes.push(action.payload);
      })
      .addCase(createAttribute.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(updateAttribute.pending, (state) => {
        state.loading.update = true;
      })
      .addCase(updateAttribute.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.attributes.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.attributes[index] = action.payload;
        }
      })
      .addCase(updateAttribute.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(deleteAttribute.pending, (state) => {
        state.loading.delete = true;
      })
      .addCase(deleteAttribute.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.success = true;
        state.attributes = state.attributes.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteAttribute.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export const { resetAttributeState } = attributeSlice.actions;
export default attributeSlice.reducer;
