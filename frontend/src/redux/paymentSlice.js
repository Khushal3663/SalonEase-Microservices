import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "..//config/api";

const BASE_URL = "/api/payments";

// 1. POST: Create Payment Link (Matches /create)
export const createPaymentLink = createAsyncThunk(
  "payment/createLink",
  async ({ bookingDTO, paymentMethod }, { rejectWithValue }) => {
    try {
      // paymentMethod is passed as a @RequestParam
      const response = await api.post(`${BASE_URL}/create`, bookingDTO, {
        params: { paymentMethod },
      });
      return response.data; // PaymentLinkResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create payment link",
      );
    }
  },
);

// 2. GET: Get Payment Order (Matches /{paymentOrderId})
export const getPaymentOrder = createAsyncThunk(
  "payment/getOrder",
  async (paymentOrderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${paymentOrderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment order not found");
    }
  },
);

// 3. PATCH: Proceed/Verify Payment (Matches /proceed)
export const proceedPayment = createAsyncThunk(
  "payment/proceed",
  async ({ paymentId, paymentLinkId }, { rejectWithValue }) => {
    try {
      // Both are @RequestParam
      const response = await api.patch(`${BASE_URL}/proceed`, null, {
        params: { paymentId, paymentLinkId },
      });
      return response.data; // Returns Boolean (Success/Failure)
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Payment processing failed",
      );
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentOrder: null,
    paymentLinkResponse: null,
    paymentSuccess: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.paymentSuccess = false;
      state.paymentLinkResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentLink.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLinkResponse = action.payload;
      })
      .addCase(getPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(proceedPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = action.payload; // This is your Boolean response
      })
      // Unified Matchers for Payment
      .addMatcher(
        (action) =>
          action.type.startsWith("payment/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("payment/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
