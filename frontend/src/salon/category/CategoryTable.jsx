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
import { getCategoriesBySalon } from "../../redux/categorySlice";
import { IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 20,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
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

export default function CategoryTable() {
  const dispatch = useDispatch();
  const { salon } = useSelector((state) => state.salon);
  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    if (salon) {
      dispatch(getCategoriesBySalon(salon.id));
    }
  }, [salon, dispatch]);
  return (
    <>
      <h1 className="pb-5 font-bold text-xl">Categories</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && categories.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <div className="flex flex-col items-center gap-2">
                    <p className="animate-pulse">Loading catgories...</p>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ) : categories.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No Categories are created yet.
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              categories.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    <div className="flex gap-1 flex-wrap">
                      <img
                        className="w-20 rounded-md"
                        // src="https://cdn.pixabay.com/photo/2018/04/03/23/04/woman-3288365_1280.jpg"
                        src={row.image}
                        alt=""
                      />
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.name}</StyledTableCell>
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
