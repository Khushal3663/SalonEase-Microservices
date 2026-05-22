import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const BASE_URL = "/api/notifications";

// 1. GET: User Notifications (Customer)
export const getUserNotifications = createAsyncThunk(
  "notification/getUserNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications",
      );
    }
  },
);

// 2. GET: Salon Notifications (Owner)
export const getSalonNotifications = createAsyncThunk(
  "notification/getSalonNotifications",
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${BASE_URL}/salon-owner/salon/${salonId}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch salon notifications",
      );
    }
  },
);

// 3. PUT: Mark as Read
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update notification",
      );
    }
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      // Add the new notification to the beginning of the array
      state.notifications.unshift(action.payload);

      // Increment unread count if the new notification is unread
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(getSalonNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific notification in the list
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id,
        );
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("notification/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("notification/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearNotifications, addNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
