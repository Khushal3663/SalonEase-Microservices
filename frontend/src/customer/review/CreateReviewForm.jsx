import {
  Box,
  Button,
  CircularProgress,
  InputLabel,
  Rating,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearReviewStatus, createReview } from "../../redux/reviewSlice";

const CreateReviewForm = ({ handleActiveTab }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.review);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      handleActiveTab({ name: "Reviews" });

      dispatch(clearReviewStatus());
      console.log("printing success ", success);
    }
  }, [success, handleActiveTab]);

  const formik = useFormik({
    initialValues: { reviewText: "", reviewRating: 0 },
    validate: (values) => {
      const errors = {};
      if (!values.reviewText) {
        errors.reviewText = "Review text is required";
      }
      // Check if rating is 0 (assuming 0 means unselected)
      if (values.reviewRating === 0) {
        errors.reviewRating = "Please provide a rating";
      }
      return errors;
    },
    onSubmit: (values) => {
      const reviewformData = {
        reviewText: values.reviewText,
        rating: values.reviewRating,
        salonId: parseInt(id),
        userId: user.id,
      };
      console.log("Submitting", reviewformData);
      dispatch(createReview({ salonId: id, reviewData: reviewformData }));
    },
  });
  return (
    <Box
      component={"form"}
      onSubmit={formik.handleSubmit}
      sx={{ mt: 3 }}
      className="space-y-5 w-full lg:w-1/2 flex justify-center flex-col items-center"
    >
      <TextField
        fullWidth
        id="reviewText"
        name="reviewText"
        label="Review"
        variant="outlined"
        // required
        multiline
        rows={4}
        value={formik.values.reviewText}
        onChange={formik.handleChange}
      />
      {formik.touched.reviewText && formik.errors.reviewText && (
        <p className="text-red-500 text-xs mt-1">{formik.errors.reviewText}</p>
      )}
      <div className="space-y-2 pt-2 flex flex-col items-center">
        <InputLabel
          error={
            formik.touched.reviewRating && Boolean(formik.errors.reviewRating)
          }
        >
          Rating
        </InputLabel>
        <Rating
          id="reviewRating"
          name="reviewRating"
          value={formik.values.reviewRating}
          onChange={(event, newValue) =>
            formik.setFieldValue("reviewRating", newValue)
          }
          precision={0.5}
          disabled={loading}
        />

        {formik.touched.reviewRating && formik.errors.reviewRating && (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.reviewRating}
          </p>
        )}
      </div>
      <div className="pb-2">
        <Button variant="contained" color="primary" type="submit">
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </Box>
  );
};

export default CreateReviewForm;
