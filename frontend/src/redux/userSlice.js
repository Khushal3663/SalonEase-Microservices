import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../config/api";

const API_BASE_URL = "/api/users";

// 1. GET: Fetch Profile (Matches @GetMapping("/api/users/profile"))
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile fetch failed");
    }
  },
);

// 2. GET: Get All Users (Matches @GetMapping("/api/users"))
export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("thunk calleed");
      const response = await api.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.log("error camed");
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  },
);

// 3. POST: Create User (Matches @PostMapping("/api/users"))
export const createUser = createAsyncThunk(
  "user/create",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_BASE_URL, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Creation failed");
    }
  },
);

// 4. PUT: Update User (Matches @PutMapping("/api/users/{id}"))
export const updateUser = createAsyncThunk(
  "user/update",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  },
);

// 5. DELETE: Delete User (Matches @DeleteMapping("/api/users/{id}"))
export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return id; // Return the ID so we can remove it from the state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // Logged in user profile
    users: [], // List of all users for Admin
    loading: false,
    error: null,
    updateSuccess: false,
  },
  reducers: {
    resetUserState: (state) => {
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Success Handlers
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update current user if they edited their own profile
        state.updateSuccess = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // Unified Loading state for all user actions
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      // Error Handler
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
