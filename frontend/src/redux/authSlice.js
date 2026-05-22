import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const API_BASE_URL = "/auth"; // Update with your Auth service port

// 1. LOGIN THUNK
export const login = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/login`, {
        username: loginData.username,
        password: loginData.password,
      });

      const user = response.data;
      if (user?.jwt) {
        localStorage.setItem("jwt", user.jwt);
        if (user?.refreshToken)
          localStorage.setItem("refreshToken", user.refreshToken);
      }
      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password",
      );
    }
  },
);

// 2. SIGNUP THUNK
export const signup = createAsyncThunk(
  "auth/signup",
  async (signupData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${API_BASE_URL}/signup`,
        signupData.userData,
      );
      const user = response.data;
      if (user?.jwt) {
        localStorage.setItem("jwt", user.jwt);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  },
);

// 3. REFRESH TOKEN THUNK
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_BASE_URL}/access-token/refresh-token/${refreshToken}`,
      );
      if (response.data.jwt) {
        localStorage.setItem("jwt", response.data.jwt);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue("Session expired. Please login again.");
    }
  },
);

// 4. GET: Fetch Profile
export const getUserProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile fetch failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    jwt: localStorage.getItem("jwt") || null,
    user: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.jwt = null;
      state.user = null;
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Get User Profile Handlers
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Profile fetch failed";
      })

      // 2. Login Handlers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.jwt) state.jwt = action.payload.jwt;
        if (action.payload?.role) state.role = action.payload.role;
        if (action.payload?.user) state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // 3. Signup Handlers
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.jwt) state.jwt = action.payload.jwt;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
