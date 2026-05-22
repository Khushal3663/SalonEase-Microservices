import {
  Button,
  CircularProgress,
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../snackbar/SnackbarContext";
import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Name should be at least 3 characters long")
    .max(50, "Name is too long")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain alphabets")
    .required("Full Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    // .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@$!%*?&)",
    )
    .required("Password is required"),
});

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const showMessage = useSnackbar();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Submitting", values);
      const signupData = {
        ...values,
        username: values.email,
      };
      try {
        // 1. Dispatch and wait for the result
        const response = await dispatch(
          signup({ userData: signupData }),
        ).unwrap();

        showMessage("Welcome to SalonEase!", "success");
        navigate("/");
      } catch (error) {
        console.error("Signup failed:", error);

        // showMessage(targetMessage, "error");
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Container component={"main"} maxWidth="xs">
      <div>
        <Typography
          className="text-center font-bold text-green-700"
          variant="h4"
          sx={{ mb: 1 }}
        >
          SalonEase
        </Typography>
        <Typography
          className="text-center pb-5"
          variant="body2"
          color="textSecondary"
        >
          Join us to find the best grooming services near you.
        </Typography>
        {/* <Typography className="text-center pb-5" variant="h5">
          Sign up
        </Typography> */}

        <form
          className="space-y-5"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            variant="outlined"
            fullWidth
            name="fullName"
            id="fullName"
            label="Full Name"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)} // UI Red border
            helperText={formik.touched.fullName && formik.errors.fullName} // Text error display
          />

          <TextField
            variant="outlined"
            // type="email"
            fullWidth
            name="email"
            id="email"
            label="Email Address"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            variant="outlined"
            fullWidth
            name="phone"
            label="Phone Number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            variant="outlined"
            fullWidth
            name="password"
            id="password"
            label="Password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <Button
            sx={{ py: ".8rem" }}
            fullWidth
            type="submit"
            variant="contained"
            // disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default SignupForm;
