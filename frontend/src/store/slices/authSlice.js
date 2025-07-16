import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postWithoutToken,
  postWithToken,
  putWithToken,
  deleteWithTokenandBody
} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";

// ------------------------------ Auth Actions ------------------------------

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const resp = await postWithoutToken(credentials, endPoint.login);

      // Save to localStorage
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));
      localStorage.setItem("permissions", JSON.stringify(resp.content.permissions || []));

      return {
        accessToken: resp.accessToken,
        user: {
          ...resp.content,
          permissions: undefined,
        },
        permissions: resp.content.permissions || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await postWithoutToken(userData, endPoint.register);

      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));
      localStorage.setItem("permissions", JSON.stringify(resp.content.permissions || []));

      return {
        accessToken: resp.accessToken,
        user: {
          ...resp.content,
          permissions: undefined,
        },
        permissions: resp.content.permissions || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("permissions");
  return null;
});

// ------------------------------ Profile Updates ------------------------------

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const customHeader = { "Content-Type": "multipart/form-data" };
      const resp = await putWithToken(userData, endPoint.updateProfile, customHeader);

      if (!resp.status) {
        return rejectWithValue(resp.message || "Update failed");
      }

      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));
      localStorage.setItem("permissions", JSON.stringify(resp.content.permissions || []));

      return {
        user: {
          ...resp.content,
          permissions: undefined,
        },
        permissions: resp.content.permissions || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(userData, endPoint.changePassword);

      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));
      localStorage.setItem("permissions", JSON.stringify(resp.content.permissions || []));

      return {
        user: {
          ...resp.content,
          permissions: undefined,
        },
        permissions: resp.content.permissions || [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ------------------------------ Address Management ------------------------------

export const createAddress = createAsyncThunk(
  "auth/createAddress",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(userData, endPoint.address);
      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));

      return {
        user: {
          ...resp.content,
          permissions: undefined,
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "auth/updateAddress",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(userData, endPoint.address);
      if (!resp.status) return rejectWithValue(resp.message || "Update failed");

      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));

      return {
        user: {
          ...resp.content,
          permissions: undefined,
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "auth/deleteAddress",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await deleteWithTokenandBody(userData, endPoint.address);
      if (!resp.status) return rejectWithValue(resp.message || "Delete failed");

      localStorage.setItem("user", JSON.stringify({
        ...resp.content,
        permissions: undefined
      }));

      return {
        user: {
          ...resp.content,
          permissions: undefined,
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ------------------------------ Slice ------------------------------

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem("accessToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    permissions: JSON.parse(localStorage.getItem("permissions")) || [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.permissions = [];
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(changePassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.permissions = action.payload.permissions;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(createAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
