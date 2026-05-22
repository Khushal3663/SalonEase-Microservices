import { combineReducers, configureStore } from "@reduxjs/toolkit";
import salonReducer from "./salonSlice";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import categoryReducer from "./categorySlice";
import serviceReducer from "./serviceSlice";
import bookingReducer from "./bookingSlice";
import paymentReducer from "./paymentSlice";
import notificationReducer from "./notificationSlice";
import reviewReducer from "./reviewSlice";

const rootReducers = combineReducers({
  salon: salonReducer,
  auth: authReducer,
  user: userReducer,
  category: categoryReducer,
  service: serviceReducer,
  booking: bookingReducer,
  payment: paymentReducer,
  notification: notificationReducer,
  review: reviewReducer,
});

export const store = configureStore({
  reducer: rootReducers,
  // Thunk and DevTools are already included here automatically!
});
