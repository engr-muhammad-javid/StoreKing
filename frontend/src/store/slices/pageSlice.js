// src/store/slices/pageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

export const fetchPages = createAsyncThunk('page/fetchPages', async (_, { rejectWithValue }) => {
  try {
    const resp = await getWithToken(endPoint.page);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createPage = createAsyncThunk('page/createPage', async (data, { rejectWithValue }) => {
  try {
    const resp = await postWithToken(data, endPoint.page);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updatePage = createAsyncThunk('page/updatePage', async ({ id, data }, { rejectWithValue }) => {
  try {
    const resp = await putWithToken(data, `${endPoint.page}/${id}`);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deletePage = createAsyncThunk('page/deletePage', async (id, { rejectWithValue }) => {
  try {
    const resp = await deleteWithToken(`${endPoint.page}/${id}`);
    return resp.status ? id : rejectWithValue(resp.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const pageSlice = createSlice({
  name: 'page',
  initialState: {
    pages: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: null,
    success: false,
  },
  reducers: {
    resetPageState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => { state.loading.fetch = true; })
      .addCase(fetchPages.fulfilled, (state, action) => { state.loading.fetch = false; state.pages = action.payload; })
      .addCase(fetchPages.rejected, (state, { payload }) => { state.loading.fetch = false; state.error = payload; })

      .addCase(createPage.pending, (state) => { state.loading.create = true; })
      .addCase(createPage.fulfilled, (state, action) => { state.loading.create = false; state.success = true; state.pages.push(action.payload); })
      .addCase(createPage.rejected, (state, { payload }) => { state.loading.create = false; state.error = payload; })

      .addCase(updatePage.pending, (state) => { state.loading.update = true; })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.loading.update = false;
        state.success = true;
        const index = state.pages.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.pages[index] = action.payload;
      })
      .addCase(updatePage.rejected, (state, { payload }) => { state.loading.update = false; state.error = payload; })

      .addCase(deletePage.pending, (state) => { state.loading.delete = true; })
      .addCase(deletePage.fulfilled, (state, { payload }) => {
        state.loading.delete = false;
        state.success = true;
        state.pages = state.pages.filter(p => p._id !== payload);
      })
      .addCase(deletePage.rejected, (state, { payload }) => { state.loading.delete = false; state.error = payload; });
  },
});

export const { resetPageState } = pageSlice.actions;
export default pageSlice.reducer;
