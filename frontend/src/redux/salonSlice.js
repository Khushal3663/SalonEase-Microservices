import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

// Using a professional axios instance or constant
const API_BASE_URL = "api/salons";

// 1. POST: Create Salon
export const createSalon = createAsyncThunk(
  "salon/create",
  async ({ salonDTO }, { rejectWithValue }) => {
    try {
      const response = await api.post(API_BASE_URL, salonDTO, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating salon");
    }
  },
);

// 2. PATCH: Update Salon (Matches your @PatchMapping)
export const updateSalon = createAsyncThunk(
  "salon/update",
  async ({ salonId, salonDTO, jwt }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/${salonId}`, salonDTO, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  },
);

// 3. GET: Get All Salons
export const getAllSalons = createAsyncThunk(
  "salon/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_BASE_URL);
      console.log("Salons data: " + response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Could not fetch salons");
    }
  },
);

export const getSalonById = createAsyncThunk(
  "salon/getById",
  async (salonId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${salonId}`);
      return response.data; // This is your SalonDTO
    } catch (error) {
      return rejectWithValue(error.response?.data || "Salon not found");
    }
  },
);

// 4. GET: Search by City (Matches @RequestParam("city"))
export const searchSalonsByCity = createAsyncThunk(
  "salon/search",
  async (city, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/search`, {
        params: { city },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Search failed");
    }
  },
);

// 5. GET: Get Owner's Salon (Matches /api/salons/owner)
export const getSalonByOwner = createAsyncThunk(
  "salon/getByOwner",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/owner`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Owner salon not found");
    }
  },
);

const salonSlice = createSlice({
  name: "salon",
  initialState: {
    salons: [], // List for Home Page
    salon: null, // Single salon for Dashboard/Details
    loading: false,
    error: null,
    searchResult: [],
  },
  reducers: {
    clearSalonErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Success Handlers
      .addCase(createSalon.fulfilled, (state, action) => {
        state.loading = false;
        state.salon = action.payload;
        state.salons.push(action.payload);
      })
      .addCase(getAllSalons.fulfilled, (state, action) => {
        state.loading = false;
        state.salons = action.payload;
      })
      .addCase(getSalonById.fulfilled, (state, action) => {
        state.loading = false;
        state.salon = action.payload; // Stores the specific salon details
      })
      .addCase(getSalonByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.salon = action.payload;
      })
      .addCase(updateSalon.fulfilled, (state, action) => {
        state.loading = false;
        state.salon = action.payload;
        // Update the item in the list too
        const index = state.salons.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.salons[index] = action.payload;
      })
      .addCase(searchSalonsByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResult = action.payload;
      })
      // Handle Loading for all Pending states
      .addMatcher(
        (action) =>
          action.type.startsWith("salon/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      // Error Handlers
      .addMatcher(
        (action) =>
          action.type.startsWith("salon/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearSalonErrors } = salonSlice.actions;
export default salonSlice.reducer;
