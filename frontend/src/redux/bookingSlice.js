import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../config/api";

const BASE_URL = "/api/bookings";
const CHART_URL = "/api/bookings/chart";

// 1. POST: Create Booking (Initiates Payment Link)
export const createBooking = createAsyncThunk(
  "booking/create",
  async ({ salonId, paymentMethod, bookingRequest }, { rejectWithValue }) => {
    try {
      // Matches @RequestParam salonId, paymentMethod and @RequestBody bookingRequest
      const response = await api.post(BASE_URL, bookingRequest, {
        params: { salonId, paymentMethod },
      });

      console.log("Full Backend Response:", response.data); // DEBUG THIS

      const paymentUrl =
        response.data.payment_link_url || response.data.paymentLinkUrl;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // If no payment link, maybe redirect to a success page
        console.error("Payment link missing in response");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Booking failed");
    }
  },
);

// 2. GET: Customer Bookings
export const getCustomerBookings = createAsyncThunk(
  "booking/getCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/customer`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch your bookings",
      );
    }
  },
);

// 3. GET: Salon Owner Bookings
export const getSalonBookings = createAsyncThunk(
  "booking/getSalon",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/salon`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch salon bookings",
      );
    }
  },
);

// 4. PUT: Update Booking Status (Matches @RequestParam status)
export const updateBookingStatus = createAsyncThunk(
  "booking/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/${bookingId}/status`, null, {
        params: { status },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Status update failed");
    }
  },
);

// 5. GET: Booked Slots (For the Calendar/Time Picker)
export const getBookedSlots = createAsyncThunk(
  "booking/getSlots",
  async ({ salonId, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${BASE_URL}/slots/salon/${salonId}/date/${date}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch slots");
    }
  },
);

// 6. GET: Salon Report (Admin Analytics)
export const getSalonReport = createAsyncThunk(
  "booking/getReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/report`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch report");
    }
  },
);

// 7. GET: Booking By ID (Matches @GetMapping("/{bookingId}"))
export const getBookingById = createAsyncThunk(
  "booking/getById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${bookingId}`);
      return response.data; // This is your BookingDTO
    } catch (error) {
      return rejectWithValue(error.response?.data || "Booking not found");
    }
  },
);

// 8. GET: Earnings Chart Data
export const getEarningsChartData = createAsyncThunk(
  "booking/getEarningsChart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${CHART_URL}/earnings`);
      return response.data; // List<Map<String, Object>>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch earnings data",
      );
    }
  },
);

// 9. GET: Booking Count Chart Data
export const getBookingsChartData = createAsyncThunk(
  "booking/getBookingsChart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${CHART_URL}/bookings`);
      return response.data; // List<Map<String, Object>>
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch bookings chart data",
      );
    }
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    currentBooking: null,
    bookedSlots: [],
    report: null,
    paymentLink: null,
    earningsChart: [],
    bookingsChart: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    resetBookingState: (state) => {
      state.paymentLink = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLink = action.payload.payment_link_url; // Adjust key based on your DTO
      })
      .addCase(getCustomerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getSalonBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getBookedSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.bookedSlots = action.payload;
      })
      .addCase(getSalonReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;

        // 1. Update the booking in the list (for Salon/Customer views)
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }

        // 2. If the user is currently viewing this specific booking details, update that too
        if (
          state.currentBooking &&
          state.currentBooking.id === action.payload.id
        ) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(getEarningsChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.earningsChart = action.payload;
      })
      .addCase(getBookingsChartData.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingsChart = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("booking/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("booking/") &&
          action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("booking/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearCurrentBooking, resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
