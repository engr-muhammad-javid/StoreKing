// src/store/slices/roleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

export const fetchRoles = createAsyncThunk("role/fetch", async (_, { rejectWithValue }) => {
  try {
    const resp = await getWithToken(endPoint.role);
    return resp.status ? resp.content : rejectWithValue(resp.message);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});
export const createRole = createAsyncThunk("role/create", async (data, { rejectWithValue }) => {
  try {
    const r = await postWithToken(data, endPoint.role);
    return r.status ? r.content : rejectWithValue(r.message);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});
export const updateRole = createAsyncThunk("role/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const r = await putWithToken(data, `${endPoint.role}/${id}`);
    return r.status ? r.content : rejectWithValue(r.message);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});
export const deleteRole = createAsyncThunk("role/delete", async (id, { rejectWithValue }) => {
  try {
    const r = await deleteWithToken(`${endPoint.role}/${id}`);
    return r.status ? id : rejectWithValue(r.message);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roles: [],
    loading: { fetch: false, create: false, update: false, delete: false },
    error: null,
    success: false,
  },
  reducers: {
    resetRoleState: (state) => {
      state.loading = { fetch: false, create: false, update: false, delete: false };
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => builder
    .addCase(fetchRoles.pending, state => { state.loading.fetch = true })
    .addCase(fetchRoles.fulfilled, (state, { payload }) => { state.loading.fetch = false; state.roles = payload })
    .addCase(fetchRoles.rejected, (state, { payload }) => { state.loading.fetch = false; state.error = payload })
    .addCase(createRole.pending, state => { state.loading.create = true })
    .addCase(createRole.fulfilled, (state, { payload }) => { state.loading.create = false; state.success = true; state.roles.push(payload) })
    .addCase(createRole.rejected, (state, { payload }) => { state.loading.create = false; state.error = payload })
    .addCase(updateRole.pending, state => { state.loading.update = true })
    .addCase(updateRole.fulfilled, (state, { payload }) => {
      state.loading.update = false; state.success = true;
      const i = state.roles.findIndex(r => r._id === payload._id);
      if (i !== -1) state.roles[i] = payload;
    })
    .addCase(updateRole.rejected, (state, { payload }) => { state.loading.update = false; state.error = payload })
    .addCase(deleteRole.pending, state => { state.loading.delete = true })
    .addCase(deleteRole.fulfilled, (state, { payload }) => {
      state.loading.delete = false; state.success = true;
      state.roles = state.roles.filter(r => r._id !== payload);
    })
    .addCase(deleteRole.rejected, (state, { payload }) => { state.loading.delete = false; state.error = payload })
});

export const { resetRoleState } = roleSlice.actions;
export default roleSlice.reducer;
