import React from "react";
import { Route, Routes } from "react-router-dom";
import SalonDashboard from "../salon/SalonDashboard";
import Home from "../customer/home/Home";
import Notifications from "../customer/notification/Notifications";
import Bookings from "../customer/booking/Bookings";
import SalonDetails from "../customer/salon/salon-details/SalonDetails";
import Navbar from "../customer/navbar/Navbar";
import NotFound from "../notFound/NotFound";
import PaymentSuccess from "../customer/payment/PaymentSuccess";
import ProtectedRoute from "./ProtectedRoute";

const CustomerRoutes = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* PUBLIC CUSTOMER VIEWS (Anyone can visit) */}
        <Route path="/" element={<Home />} />
        <Route path="/salon/:id" element={<SalonDetails />} />
        <Route path="*" element={<NotFound />} />

        {/* PROTECTED CUSTOMER VIEWS (Must be logged in to view) */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER", "SALON_OWNER"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment-success/:id"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default CustomerRoutes;
