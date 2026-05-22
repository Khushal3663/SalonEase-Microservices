import { AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import uploadImageToCloudinary from "../../util/uploadImageToCloudinary";
import { useSnackbar } from "../../snackbar/SnackbarContext";

const SalonDetailsForm = ({ formik }) => {
  const [uploadImage, setUploadImage] = useState(false);
  const showSnackbar = useSnackbar();
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      // Reuse for the file size error you just had!
      showSnackbar("File size too large! Max 10MB.", "error");
      return;
    }
    setUploadImage(true);
    const image = await uploadImageToCloudinary(file);
    formik.setFieldValue("salonDetails.images", [
      ...formik.values.salonDetails.images,
      image,
    ]);
    setUploadImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.salonDetails.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("salonDetails.images", [...updatedImages]);
  };
  return (
    <div>
      <Typography className="text-center pb-5" variant="h5">
        Salon Details
      </Typography>

      <form
        className="space-y-5"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        onSubmit={formik.handleSubmit}
      >
        <Box className="flex flex-wrap gap-3 mb-5">
          {formik.values.salonDetails.images.map((image, index) => (
            <div className="relative border">
              <img
                className="w-24 h-24 object-cover"
                // src="https://cdn.pixabay.com/photo/2015/07/07/11/36/haircut-834280_1280.jpg"
                src={image}
                alt=""
              />

              <IconButton
                className=""
                size="small"
                color="error"
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => handleRemoveImage(index)}
              >
                <Close sx={{ fontSize: "1.5rem" }} />
              </IconButton>
            </div>
          ))}
          <label htmlFor="fileInput">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
              {uploadImage ? (
                <div>
                  <CircularProgress size={24} />
                </div>
              ) : (
                <AddPhotoAlternate className="text-grey-700" />
              )}
            </span>
          </label>
        </Box>
        <TextField
          variant="outlined"
          fullWidth
          name="salonDetails.name"
          id="salonDetails.name"
          label="Salon Name"
          onChange={formik.handleChange}
          value={formik.values.salonDetails.name}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Select Open Time"
            value={formik.values.salonDetails.openTime}
            onChange={(newValue) => {
              formik.setFieldValue("salonDetails.openTime", newValue);
            }}
            fullWidth
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
                error:
                  formik.touched.salonDetails?.openTime &&
                  Boolean(formik.errors.salonDetails?.openTime),
                helperText:
                  formik.touched.salonDetails?.openTime &&
                  formik.errors.salonDetails?.openTime,
              },
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            label="Select Close Time"
            value={formik.values.salonDetails.closeTime}
            onChange={(newValue) => {
              formik.setFieldValue("salonDetails.closeTime", newValue);
            }}
            fullWidth
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </form>
    </div>
  );
};

export default SalonDetailsForm;
