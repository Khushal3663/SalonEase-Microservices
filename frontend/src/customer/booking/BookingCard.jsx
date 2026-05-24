import React from "react";
import {
  CalendarMonth,
  AccessTime,
  ContentCut,
  CancelScheduleSend,
} from "@mui/icons-material";
import { Button, Chip, Divider, Typography } from "@mui/material";
import { getDateFormat, getTimeFormat } from "../../util/dateAndTimeFormat";

const BookingCard = ({ booking }) => {
  const datePart = booking.startTime?.split("T")[0];
  const startTimePart = booking.startTime?.split("T")[1];
  const endTimePart = booking.endTime?.split("T")[1];

  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { label: "Pending", color: "warning" };
      case "CONFIRMED":
        return { label: "Confirmed", color: "success" };
      case "CANCELLED":
      case "CANCELED":
        return { label: "Cancelled", color: "error" };
      default:
        return { label: status, color: "default" };
    }
  };

  const statusConfig = getStatusConfig(booking.status);

  // Can only cancel if the booking isn't already completed or cancelled
  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
      {/* Left Core Section: Details & Metadata */}
      <div className="space-y-4 flex-1 w-full">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <Typography
            variant="h5"
            className="font-extrabold text-slate-800 tracking-tight"
          >
            {booking.salon?.name}
          </Typography>
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            className="font-semibold text-xs rounded-md px-1"
          />
        </div>

        {/* Displaying Rendered Services Array from Payload */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <ContentCut className="text-slate-400" sx={{ fontSize: 16 }} />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Services:
          </span>
          {booking.services?.map((service) => (
            <span
              key={service.id}
              className="text-sm font-medium bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100"
            >
              {service.name}
            </span>
          ))}
        </div>

        <Divider className="opacity-60" />

        {/* Date and Time Section using your custom util formatters */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <CalendarMonth className="text-indigo-500" sx={{ fontSize: 18 }} />
            <span>{getDateFormat(datePart)}</span>
          </div>
          <div className="flex items-center gap-2">
            <AccessTime className="text-indigo-500" sx={{ fontSize: 18 }} />
            <span>
              {getTimeFormat(startTimePart)} - {getTimeFormat(endTimePart)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Section: Image thumbnail, Pricing, and Action Button */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-dashed border-slate-200">
        <div className="flex items-center sm:flex-col gap-3 sm:gap-1.5 text-left sm:text-center">
          {booking.services?.[0]?.image && (
            <img
              className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl shadow-inner border border-slate-100"
              src={booking.services[0].image}
              alt={booking.services[0].name}
            />
          )}
          <div>
            <p className="text-xs text-slate-400 font-medium sm:mt-1">
              Grand Total
            </p>
            <p className="text-xl font-black text-slate-900">
              ₹{booking.totalPrice}
            </p>
          </div>
        </div>

        {canCancel && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CancelScheduleSend />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
            fullWidth
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
