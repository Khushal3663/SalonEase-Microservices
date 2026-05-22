import React, { useEffect } from "react";
import SalonDrawerList from "./components/SalonDrawerList";
import Navbar from "../adminSalon/NavBar";
import SalonRoutes from "../routes/SalonRoutes";
import { useDispatch, useSelector } from "react-redux";
import { getSalonByOwner } from "../redux/salonSlice";
import { getUserProfile } from "../redux/authSlice";
import { getSalonNotifications } from "../redux/notificationSlice";
import { Box, CircularProgress } from "@mui/material";

const SalonDashboard = () => {
  const dispatch = useDispatch();
  const { salon } = useSelector((state) => state.salon);
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSalonByOwner());
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (salon?.id) {
      dispatch(getSalonNotifications(salon.id));
    }
  }, [salon?.id]);

  if (loading || !user) {
    return (
      <Box className="h-screen w-screen flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar DrawerList={SalonDrawerList} />
      <section className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block">
          <SalonDrawerList />
        </div>
        <div className="p-10 w-full  lg-w-[80%] overflow-y-auto">
          <SalonRoutes />
        </div>
      </section>
    </div>
  );
};

export default SalonDashboard;
