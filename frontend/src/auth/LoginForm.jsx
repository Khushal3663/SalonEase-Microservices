import {
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../snackbar/SnackbarContext";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const showMessage = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        // 1. Dispatch and wait for the result
        // We do NOT pass navigate to the thunk anymore
        const response = await dispatch(
          login({
            username: values.email,
            password: values.password,
          }),
        ).unwrap();

        console.log("Login Success:", response);

        // 2. Conditional Navigation logic lives HERE now
        showMessage("Login successfully!", "success");
        if (response.role === "ADMIN") {
          navigate("/admin");
        } else if (response.role === "SALON_OWNER") {
          navigate("/salon-dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });
  return (
    <Container component={"main"} maxWidth="xs">
      <div>
        <Typography className="text-center pb-5" variant="h5">
          Login
        </Typography>

        <form
          className="space-y-5"
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          onSubmit={formik.handleSubmit}
        >
          <TextField
            variant="outlined"
            fullWidth
            name="email"
            id="email"
            label="Email Address"
            onChange={formik.handleChange}
            value={formik.values.email}
            required
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
            required
          />

          <Button
            sx={{ py: ".8rem" }}
            fullWidth
            type="submit"
            variant="contained"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default LoginForm;
