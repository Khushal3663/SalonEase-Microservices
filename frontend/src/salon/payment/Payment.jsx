import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { getTotalEarning } from "../../util/totalEarnings";
import { useDispatch, useSelector } from "react-redux";
import { getSalonBookings } from "../../redux/bookingSlice";
import { getDateTimeFormat } from "../../util/dateAndTimeFormat";

const Payment = () => {
  const dispatch = useDispatch();
  const { bookings, loading: bookingLoading } = useSelector(
    (state) => state.booking,
  );
  const sortedBookings = useMemo(() => [...bookings].reverse(), [bookings]);

  useEffect(() => {
    if (bookings.length == 0 && !bookingLoading) {
      dispatch(getSalonBookings());
    }
  }, [dispatch, bookings.length]);

  const getStatusStyles = (status) => {
    const formattedStatus = status?.toUpperCase();

    switch (formattedStatus) {
      case "CONFIRMED":
      case "COMPLETED":
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "CANCELLED":
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (bookingLoading) {
    return (
      <Box className="flex flex-col items-center justify-center h-64 space-y-10">
        <CircularProgress />
        <Typography className="mt-4 text-gray-500">
          Loading your Payments...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="">
      <Box className="max-w-md">
        <Card className="rounded-md space-y-4 p-5" elevation={3}>
          <Typography color="textSecondary" variant="subtitle2">
            Total Earning
          </Typography>
          <Typography variant="h4" className="font-bold pb-1 text-green-700">
            ₹{getTotalEarning(bookings) || 0}
          </Typography>

          <Divider />

          <Box className="flex justify-between items-center">
            <Typography variant="body2">Last Payment:</Typography>
            <Typography variant="body1" className="font-bold">
              {sortedBookings.length > 0
                ? `₹${sortedBookings[0].totalPrice}`
                : "No payments yet"}
            </Typography>
          </Box>
        </Card>
      </Box>

      <Box className="mt-8">
        <Typography variant="h6" className="pb-4 font-bold">
          Recent Transactions
        </Typography>

        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Services</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBookings.length > 0 ? (
                sortedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {getDateTimeFormat(booking.startTime)}
                    </TableCell>
                    <TableCell>
                      {booking.customer?.fullName || "Guest User"}
                    </TableCell>
                    <TableCell>
                      {booking.services.map((s) => s.name).join(", ")}
                    </TableCell>
                    <TableCell align="right" className="font-bold">
                      ₹{booking.totalPrice}
                    </TableCell>
                    <TableCell align="center">
                      <span
                        className={`px-2 py-1 ${getStatusStyles(booking.status)} rounded-full text-xs`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" className="py-10">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Payment;
