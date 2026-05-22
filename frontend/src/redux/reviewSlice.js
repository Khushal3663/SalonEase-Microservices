import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const BASE_URL = "/api/reviews";

// 1. POST: Create Review (Matches /salon/{salonId})
export const createReview = createAsyncThunk(
  "review/create",
  async ({ salonId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${BASE_URL}/salon/${salonId}`,
        reviewData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit review");
    }
  },
);

// 2. GET: Get Reviews by Salon (Matches /salon/{salonId})
export const getSalonReviews = createAsyncThunk(
  "review/getSalonReviews",
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/salon/${salonId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  },
);

// 3. PUT: Update Review (Matches /{reviewId})
export const updateReview = createAsyncThunk(
  "review/update",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update review");
    }
  },
);

// 4. DELETE: Delete Review (Matches /{reviewId})
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${BASE_URL}/${reviewId}`);
      return { reviewId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    success: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearReviewStatus: (state) => {
      state.error = null;
      state.successMessage = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSalonReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload); // Add new review to the top
        state.success = true; // Trigger for navigation
        state.successMessage = "Review posted successfully!";
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (r) => r.id !== action.payload.reviewId,
        );
        state.successMessage = action.payload.message;
      })
      // Global Loading/Error matchers
      .addMatcher(
        (action) =>
          action.type.startsWith("review/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("review/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;
