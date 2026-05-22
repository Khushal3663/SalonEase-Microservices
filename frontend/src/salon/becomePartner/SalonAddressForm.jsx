import { AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const SalonAddressForm = ({ formik }) => {
  return (
    <div>
      <Typography className="text-center pb-5" variant="h5">
        Salon Address
      </Typography>

      <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              fullWidth
              id="address"
              name="salonAddress.address"
              label="Address"
              value={formik.values.salonAddress.address}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              id="email"
              name="salonAddress.email"
              label="Email"
              value={formik.values.salonAddress.email}
              onChange={formik.handleChange}
              type="email"
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="city"
              name="salonAddress.city"
              label="City"
              value={formik.values.salonAddress.city}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="phoneNumber"
              name="salonAddress.phoneNumber"
              label="Phone Number"
              value={formik.values.salonAddress.phoneNumber}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="pincode"
              name="salonAddress.pincode"
              label="Pincode"
              value={formik.values.salonAddress.pincode}
              onChange={formik.handleChange}
              required
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default SalonAddressForm;
