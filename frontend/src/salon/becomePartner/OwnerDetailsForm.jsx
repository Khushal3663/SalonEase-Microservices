import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const OwnerDetailsForm = ({ formik }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <Typography className="text-center pb-5" variant="h5">
        Owner Details
      </Typography>

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
          required
        />

        <TextField
          variant="outlined"
          fullWidth
          type="email"
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
      </form>
    </div>
  );
};

export default OwnerDetailsForm;
