import { Delete } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Rating,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getSalonReviews } from "../../redux/reviewSlice";
import { getDateTimeFormat } from "../../util/dateAndTimeFormat";

const ReviewCard = ({ review }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  useEffect(() => {
    // dispatch(getUser(id));
  }, [dispatch]);

  const handleConfirmDelete = () => {
    dispatch(deleteReview(review.id));
    console.log("Deleted review:", review.id);
    handleCloseConfirm();
  };

  return (
    <div className="relative flex p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-none">
      <div className="w-full">
        <Grid container spacing={2}>
          <Grid size={{ xs: 2, sm: 1.5 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#9155FD",
                fontSize: "1.1rem",
              }}
            >
              {review.user?.fullName ? review.user.fullName[0] : "?"}
            </Avatar>
          </Grid>

          <Grid size={{ xs: 10, sm: 10.5 }}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">
                    {review.user?.fullName}
                  </p>
                  {review.user?.id === user.id && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-60">
                  {getDateTimeFormat(review.createdAt)}
                </p>
              </div>

              {review.user?.id === user.id && (
                <IconButton
                  onClick={handleOpenConfirm}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                      backgroundColor: "rgba(211, 47, 47, 0.04)",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </div>

            <div className="pt-1">
              <Rating
                readOnly
                value={review.rating}
                precision={0.5}
                size="small"
              />
            </div>
            <p className="text-gray-700 mt-2 leading-relaxed">
              {review.reviewText}
            </p>
          </Grid>
        </Grid>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: { borderRadius: 12, padding: "8px" },
        }}
      >
        <DialogTitle id="alert-dialog-title" className="font-bold">
          {"Delete Review?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit" variant="text">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{ borderRadius: "8px", boxShadow: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReviewCard;
