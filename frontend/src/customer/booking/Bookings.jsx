import React, { useEffect } from "react";
import BookingCard from "./BookingCard";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerBookings } from "../../redux/bookingSlice";

const Bookings = () => {
  const dispatch = useDispatch();

  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getCustomerBookings());
  }, [dispatch]);
  return (
    <div className="px-5 md:flex flex-col items-center mt-10 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold py-5">My Bookings</h1>
      </div>
      <div className="space-y-4 md:w-[35rem]">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default Bookings;
