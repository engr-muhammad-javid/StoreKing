// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postWithoutToken, postWithToken, putWithToken, deleteWithTokenandBody} from "../../api/fetch";
import { endPoint } from "../../utils/endpoint";


export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const resp = await postWithoutToken(credentials, endPoint.login);
      // Save token and user to localStorage
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("user", JSON.stringify(resp.content)); // user is in content

      return {
        accessToken: resp.accessToken,
        user: resp.content,
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

      // Save token and user to localStorage
      localStorage.setItem("accessToken", resp.accessToken);
      localStorage.setItem("user", JSON.stringify(resp.content));

      return {
        accessToken: resp.accessToken,
        user: resp.content,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  "auth/createAddress",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await postWithToken(userData, endPoint.address);

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(resp.content));

      return {
        user: resp.content,
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

     // If API returns status false, treat as error
      if (!resp.status) {
        return rejectWithValue(resp.message || "Update failed");
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(resp.content));

      return {
        user: resp.content,
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

      // If API returns status false, treat as error
      if (!resp.status) {
        return rejectWithValue(resp.message || "Delete failed");
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(resp.content));

      return {
        user: resp.content,
      };

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  return null;
});

// Async thunk to update user
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const custom_header = {
        "Content-Type": "multipart/form-data"
      }
      const resp = await putWithToken(userData, endPoint.updateProfile, custom_header);

      // If API returns status false, treat as error
      if (!resp.status) {
        return rejectWithValue(resp.message || "Update failed");
      }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(resp.content));

       return {
        user: resp.content,
      };

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Async thunk to update user
export const changePassword = createAsyncThunk(
  "auth/chnagePassword",
  async (userData, { rejectWithValue }) => {
    try {
      const resp = await putWithToken(userData, endPoint.changePassword);
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(resp.content));

       return {
        user: resp.content,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null,
    user: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : null,
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
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
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
      })
  },
});

export default authSlice.reducer;