import React from "react";
import BookingTable from "../salon/booking/BookingTable";
import ServiceTable from "../salon/service/ServiceTable";
import TransactionTable from "../salon/transcation/TransactionTable";
import Category from "../salon/category/Category";
import { Route, Routes } from "react-router-dom";
import CreateServiceForm from "../salon/service/CreateServiceForm";
import Home from "../salon/salon-dashboard/Home";
import Notifications from "../customer/notification/Notifications";
import Payment from "../salon/payment/Payment";
import Profile from "../salon/profile/Profile";

const SalonRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServiceTable />} />
        <Route path="/add-services" element={<CreateServiceForm />} />
        <Route path="/bookings" element={<BookingTable />} />
        <Route path="/category" element={<Category />} />
        <Route path="/transaction" element={<TransactionTable />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/account" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default SalonRoutes;
