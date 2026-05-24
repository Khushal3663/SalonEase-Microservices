import React, { useEffect } from "react";
import BookingCard from "./BookingCard";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerBookings } from "../../redux/bookingSlice";
import { CalendarToday } from "@mui/icons-material";
import { Typography } from "@mui/material";

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getCustomerBookings());
  }, [dispatch]);

  return (
    <div className="bg-slate-50/50 min-h-screen w-full px-4 sm:px-8 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-left sm:text-center">
          <Typography
            variant="h4"
            className="font-black text-slate-800 tracking-tight"
          >
            My Appointments
          </Typography>
          <p className="text-slate-500 text-sm mt-1">
            Track and manage your upcoming or past salon reservations
          </p>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-slate-200 border-dashed rounded-2xl p-8 shadow-sm">
            <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4 border border-slate-100">
              <CalendarToday sx={{ fontSize: 40 }} />
            </div>
            <Typography variant="h6" className="font-bold text-slate-700">
              No bookings yet
            </Typography>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              Your scheduled appts will show up here. Explore salons nearby to
              schedule your next refreshing styling session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
