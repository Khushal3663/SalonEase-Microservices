import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const BASE_URL = "/api/categories";

// 1. GET: Categories by Salon ID
export const getCategoriesBySalon = createAsyncThunk(
  "category/getBySalon",
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/salon/${salonId}`);
      return response.data; // Returns Set<Category>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories",
      );
    }
  },
);

// 2. POST: Create Category (Owner Only)
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      // The API interceptor will automatically add the "Authorization" header
      const response = await api.post(`${BASE_URL}/salon-owner`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Category creation failed",
      );
    }
  },
);

// 3. DELETE: Delete Category (Owner Only)
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${BASE_URL}/salon-owner/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  },
);

// 4. GET: Category by ID and Salon ID
export const getCategoryBySalonAndId = createAsyncThunk(
  "category/getByIdAndSalon",
  async ({ salonId, id }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${BASE_URL}/salon-owner/salon/${salonId}/category/${id}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Category not found");
    }
  },
);

// 5. GET: Category By ID (Matches @GetMapping("/{id}"))
export const getCategoryById = createAsyncThunk(
  "category/getById",
  async (id, { rejectWithValue }) => {
    try {
      // No JWT required by your controller for this one
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Category not found");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET BY SALON
      .addCase(getCategoriesBySalon.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload,
        );
      })
      .addCase(getCategoryBySalonAndId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload; // Updates the single object state
      })

      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      // Loading & Error matchers
      .addMatcher(
        (action) =>
          action.type.startsWith("category/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("category/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
