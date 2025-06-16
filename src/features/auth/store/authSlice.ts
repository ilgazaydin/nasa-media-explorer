/**
 * @file authSlice.ts
 * @description Redux slice for handling authentication state using Redux Toolkit.
 *
 * Manages user authentication including login, registration, and fetching the current user's profile.
 * Stores and removes the access token in `localStorage` for persistence.
 *
 * State Shape (`AuthState`):
 * - `token`: JWT token string or null
 * - `user`: Authenticated user object or null
 * - `loading`: Indicates whether the user data is still being loaded
 *
 * Async Thunks:
 * - `login`: Authenticates a user and stores the access token
 * - `register`: Registers a new user and stores the access token
 * - `fetchMe`: Retrieves the current authenticated user's
 * - `verifyEmail`: Verifies a user's email address using a token
 *
 * Reducers:
 * - `logout`: Clears token and user state, and removes token from localStorage
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  login as loginApi,
  register as registerApi,
  me as getMe,
  verifyEmail as verifyEmailApi,
} from "../api/authApi";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  user: null,
  loading: true,
};

// 🔐 Thunks

export const login = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await loginApi({ email, password });
    localStorage.setItem("access_token", res.accessToken);
    localStorage.setItem("refresh_token", res.refreshToken);
    return res;
  } catch (err: any) {
    const message =
      err.response?.data?.message ||
      "Login failed. Please check your credentials.";
    return rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  { email: string; password: string; firstName: string; lastName: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const res = await registerApi({ email, password, firstName, lastName });
      localStorage.setItem("access_token", res.accessToken);
      localStorage.setItem("refresh_token", res.refreshToken);
      return res;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const verifyEmail = createAsyncThunk<
  string, // success response
  string, // token
  { rejectValue: string }
>("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const res = await verifyEmailApi(token);
    return res.message;
  } catch (err: any) {
    const message =
      err.response?.data?.message || "Verification failed. Please try again.";
    return rejectWithValue(message);
  }
});

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async () => await getMe()
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Removes the stored access token and clears the user state.
     * @remarks
     * This action is the counterpart to the login and register actions.
     * It is useful when the user explicitly logs out of the application.
     */
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        debugger;
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
