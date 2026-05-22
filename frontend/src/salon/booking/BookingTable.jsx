import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSalonBookings } from "../../redux/bookingSlice";
import { Button } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { getDateTimeFormat } from "../../util/dateAndTimeFormat";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function BookingTable() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (!loading && bookings.length == 0) {
      dispatch(getSalonBookings());
    }
  }, [dispatch]);
  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Bookings</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Services</StyledTableCell>
              <StyledTableCell align="right">Time & Date</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Customer</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Cancel</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && bookings.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <div className="flex flex-col items-center gap-2">
                    <p className="animate-pulse">Loading bookings...</p>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ) : bookings.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No Bookings are created yet.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              bookings.map((booking) => (
                <StyledTableRow key={booking.id}>
                  <StyledTableCell component="th" scope="row">
                    <div className="pl-4">
                      {booking.services.map((service) => (
                        <li className="pl-3">{service.name}</li>
                      ))}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {getDateTimeFormat(booking.startTime)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ₹{booking.totalPrice}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <p>Full Name: {booking.customer?.fullName}</p>
                    <p>Email: {booking.customer?.email}</p>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {booking.status}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Button color="error" variant="contained">
                      Cancel
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
