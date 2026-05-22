import { ArrowRight, ArrowRightAlt } from "@mui/icons-material";
import { Button, ListItem } from "@mui/material";
import React from "react";

const BookingCard = ({ booking }) => {
  return (
    <div className="p-5 rounded-md bg-slate-100 md:flex items-center justify-between">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{booking.salon.name}</h1>
        <div className="pl-10">
          {booking.services.map((service) => (
            <li>{service.name}</li>
          ))}
        </div>
        <div>
          <p>
            Time & Date <ArrowRightAlt /> {booking.startTime.split("T")[0]}
          </p>
          <p>
            {booking.startTime.split("T")[1]} To {booking.endTime.split("T")[1]}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <img
          className="h-28 w-28"
          // src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934724/barber-2165745_1280_qfqyus.jpg"
          src={booking.services[0].image}
          alt=""
        />
        <p className="">Rs{booking.totalPrice}</p>
        <Button variant="outlined" color="error">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BookingCard;
