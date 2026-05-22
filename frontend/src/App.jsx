import { ThemeProvider } from "@mui/material";
import greenTheme from "./theme/greenTheme";
import { Route, Routes } from "react-router-dom";
import SalonDashboard from "./salon/SalonDashboard";
import CustomerRoutes from "./routes/CustomerRoutes";
import LoginForm from "./auth/LoginForm";
import Auth from "./auth/Auth";
import BecomePartner from "./salon/becomePartner/BecomePartner";
import WebSocketManager from "./util/WebSocketManager";
import { useDispatch, useSelector } from "react-redux";
import {
  getSalonNotifications,
  getUserNotifications,
} from "./redux/notificationSlice";
import { useEffect } from "react";
import Footer from "./footer/Footer";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { salon } = useSelector((state) => state.salon);
  const { notifications } = useSelector((state) => state.notification);

  useEffect(() => {
    if (user?.id) {
      if (user.role === "CUSTOMER") {
        dispatch(getUserNotifications(user.id));
      } else if (user.role === "SALON_OWNER" && salon?.id) {
        dispatch(getSalonNotifications(salon.id));
      }
    }
  }, [dispatch, user, salon?.id, notifications.length]);

  return (
    <ThemeProvider theme={greenTheme}>
      <WebSocketManager />
      <Routes>
        {/* PROTECTED: Only SALON_OWNERs can step foot into the dashboard */}
        <Route
          path="/salon-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["SALON_OWNER", "ADMIN"]}>
              <SalonDashboard />
            </ProtectedRoute>
          }
        />
        {/* Public Guest Routes */}
        <Route path="/register" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/become-partner" element={<BecomePartner />} />

        {/* Handles all customer views */}
        <Route path="*" element={<CustomerRoutes />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
