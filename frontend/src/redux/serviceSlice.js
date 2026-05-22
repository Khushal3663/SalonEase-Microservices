import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const BASE_URL = "/api/service-offering";

// 1. POST: Create Service (Owner Only)
export const createService = createAsyncThunk(
  "service/create",
  async (serviceDTO, { rejectWithValue }) => {
    try {
      // Logic: Java backend uses JWT to find Salon and Category
      const response = await api.post(`${BASE_URL}/salon-owner`, serviceDTO);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create service",
      );
    }
  },
);

// 2. PUT: Update Service (Owner Only)
export const updateService = createAsyncThunk(
  "service/update",
  async ({ id, serviceOffering }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `${BASE_URL}/salon-owner/${id}`,
        serviceOffering,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  },
);

// 3. GET: Services by Salon (Supports optional category filter)
export const getServicesBySalon = createAsyncThunk(
  "service/getBySalon",
  async ({ salonId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/salon/${salonId}`, {
        params: categoryId ? { categoryId } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch services",
      );
    }
  },
);

// 4. GET: Service By ID
export const getServiceById = createAsyncThunk(
  "service/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Service not found");
    }
  },
);

// 5. GET: List of Services by IDs (Matches @PathVariable Set<Long> ids)
export const getServicesByIds = createAsyncThunk(
  "service/getByIds",
  async (ids, { rejectWithValue }) => {
    try {
      // In JS, Set<Long> is passed as a comma-separated string in the URL
      const idsString = Array.from(ids).join(",");
      const response = await api.get(`${BASE_URL}/list/${idsString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch service list",
      );
    }
  },
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [], // List of offerings for the salon
    currentService: null, // For detail/edit view
    loading: false,
    error: null,
  },
  reducers: {
    clearServiceState: (state) => {
      state.error = null;
      state.currentService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServicesBySalon.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
        const index = state.services.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) state.services[index] = action.payload;
      })
      // Global Loading/Error matchers
      .addMatcher(
        (action) =>
          action.type.startsWith("service/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("service/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearServiceState } = serviceSlice.actions;
export default serviceSlice.reducer;
