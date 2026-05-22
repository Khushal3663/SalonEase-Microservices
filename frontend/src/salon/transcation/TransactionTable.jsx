import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSalonBookings } from "../../redux/bookingSlice";
import { getDateTimeFormat } from "../../util/dateAndTimeFormat";

export default function TransactionTable() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (bookings.length == 0 && !loading) {
      dispatch(getSalonBookings());
    }
  }, [dispatch, bookings.length]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Customer Details</TableCell>
            <TableCell align="right">Booking</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            // Show a skeleton or simple text while loading
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                Loading transactions...
              </TableCell>
            </TableRow>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow
                key={booking.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {getDateTimeFormat(booking.startTime)}
                </TableCell>
                <TableCell align="right">
                  <p>Full Name: {booking.customer?.fullName}</p>
                  <p>Email: {booking.customer?.email}</p>
                </TableCell>
                <TableCell align="right">{booking?.id}</TableCell>
                <TableCell align="right">₹{booking?.totalPrice}</TableCell>
              </TableRow>
            ))
          ) : (
            // THIS is your "No Transactions" state
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <div style={{ textAlign: "center", color: "#666" }}>
                  <p style={{ fontWeight: "bold" }}>No transactions found</p>
                  <p>When you complete a booking, it will appear here.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
