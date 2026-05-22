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
import { getServicesBySalon } from "../../redux/serviceSlice";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { getSalonByOwner } from "../../redux/salonSlice";

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

export default function ServiceTable() {
  const dispatch = useDispatch();
  const { salon, loading: salonLoading } = useSelector((state) => state.salon);
  const { services, loading: serviceLoading } = useSelector(
    (state) => state.service,
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!salon && !salonLoading) {
        dispatch(getSalonByOwner());
      }
    };
    fetchInitialData();
  }, [dispatch, salon, salonLoading]);

  useEffect(() => {
    if (salon?.id && services.length === 0) {
      const reqData = { salonId: salon.id };
      dispatch(getServicesBySalon(reqData));
    }
  }, [dispatch, salon?.id]);

  if (!salon || (serviceLoading && services.length === 0)) {
    return (
      <Box className="flex flex-col items-center justify-center h-64">
        <CircularProgress />
        <Typography className="mt-4 text-gray-500">
          Loading your services...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Services</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Description</StyledTableCell>
              <StyledTableCell align="right">Price</StyledTableCell>
              <StyledTableCell align="right">Duration</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No services added yet. Click "Add Service" to get started!
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              services.map((service) => (
                <StyledTableRow key={service.id}>
                  <StyledTableCell component="th" scope="row">
                    <div className="flex gap-1 flex-wrap">
                      <img
                        className="w-20 rounded-md h-12 object-cover"
                        // src="https://cdn.pixabay.com/photo/2018/04/03/23/04/woman-3288365_1280.jpg"
                        src={service.image}
                        alt=""
                      />
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {service.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {service.description}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ₹{service.price}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {service.duration} mins
                  </StyledTableCell>
                  {/* <StyledTableCell align="right">{service.name}</StyledTableCell> */}
                  <StyledTableCell align="right">
                    <IconButton>
                      <Edit />
                    </IconButton>
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
