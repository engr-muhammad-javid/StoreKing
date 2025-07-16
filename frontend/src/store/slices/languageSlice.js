// src/store/slices/languageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../api/fetch';
import { endPoint } from '../../utils/endpoint';

export const fetchLanguages = createAsyncThunk('language/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await getWithToken(endPoint.language);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createLanguage = createAsyncThunk('language/create', async (data, { rejectWithValue }) => {
  try {
    const res = await postWithToken(data, endPoint.language);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateLanguage = createAsyncThunk('language/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await putWithToken(data, `${endPoint.language}/${id}`);
    return res.status ? res.content : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteLanguage = createAsyncThunk('language/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await deleteWithToken(`${endPoint.language}/${id}`);
    return res.status ? id : rejectWithValue(res.message);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    languages: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: null,
    success: false,
  },
  reducers: {
    resetLanguageState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => { state.loading.fetch = true; })
      .addCase(fetchLanguages.fulfilled, (state, { payload }) => { state.loading.fetch = false; state.languages = payload; })
      .addCase(fetchLanguages.rejected, (state, { payload }) => { state.loading.fetch = false; state.error = payload; })

      .addCase(createLanguage.fulfilled, (state, { payload }) => { state.languages.push(payload); state.success = true; state.loading.create = false; })
      .addCase(createLanguage.pending, (state) => { state.loading.create = true; })
      .addCase(createLanguage.rejected, (state, { payload }) => { state.error = payload; state.loading.create = false; })

      .addCase(updateLanguage.fulfilled, (state, { payload }) => {
        const index = state.languages.findIndex(lang => lang._id === payload._id);
        if (index !== -1) state.languages[index] = payload;
        state.success = true;
        state.loading.update = false;
      })
      .addCase(updateLanguage.pending, (state) => { state.loading.update = true; })
      .addCase(updateLanguage.rejected, (state, { payload }) => { state.error = payload; state.loading.update = false; })

      .addCase(deleteLanguage.fulfilled, (state, { payload }) => {
        state.languages = state.languages.filter(lang => lang._id !== payload);
        state.success = true;
        state.loading.delete = false;
      })
      .addCase(deleteLanguage.pending, (state) => { state.loading.delete = true; })
      .addCase(deleteLanguage.rejected, (state, { payload }) => { state.error = payload; state.loading.delete = false; });
  },
});

export const { resetLanguageState } = languageSlice.actions;
export default languageSlice.reducer;
