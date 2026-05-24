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
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import uploadImageToCloudinary from "../../util/uploadImageToCloudinary";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../snackbar/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { createService } from "../../redux/serviceSlice";
import { getCategoriesBySalon } from "../../redux/categorySlice";
import { getSalonByOwner } from "../../redux/salonSlice";

const CreateServiceForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [uploadImage, setUploadImage] = useState(false);
  const { salon } = useSelector((state) => state.salon);
  const { categories } = useSelector((state) => state.category);

  const showSnackbar = useSnackbar();
  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      description: "",
      price: "",
      duration: "",
      categoryId: "",
    },
    onSubmit: () => {
      const serviceData = {
        salonId: salon.id,
        name: formik.values.name,
        image: formik.values.image,
        description: formik.values.description,
        price: formik.values.price,
        duration: formik.values.duration,
        categoryId: formik.values.categoryId,
      };
      dispatch(createService(serviceData));
      console.log("submitting" + serviceData);
      showSnackbar("Service Created Successfully!", "success");
      navigate("/salon-dashboard/services");
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file.size > 10 * 1024 * 1024) {
      // Reuse for the file size error you just had!
      showSnackbar("File size too large! Max 10MB.", "error");
      return;
    }
    setUploadImage(true);
    const image = await uploadImageToCloudinary(file);
    formik.setFieldValue("image", image);
    setUploadImage(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      // 1. If salon isn't in state (due to refresh), get it first
      if (!salon) {
        dispatch(getSalonByOwner());
      }
    };
    fetchInitialData();
  }, [dispatch, salon]);

  useEffect(() => {
    // 2. Once salon is available, fetch the categories for that specific salon
    if (salon?.id && categories.length === 0) {
      dispatch(getCategoriesBySalon(salon.id));
    }
  }, [dispatch, salon?.id]);

  if (!salon || !categories) {
    return (
      <div className="h-[60vh] flex justify-center items-center">
        <CircularProgress size={60} />
        <p className="ml-4">Loading Salon Workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="space-y-4 w-full lg:w-1/2"
      >
        <Grid container spacing={2}>
          <Grid className="w-24 h-24" size={{ xs: 12 }}>
            {formik.values.image ? (
              <div className="relative border">
                <img
                  className="w-24 h-24 object-cover"
                  // src="https://cdn.pixabay.com/photo/2015/07/07/11/36/haircut-834280_1280.jpg"
                  src={formik.values.image}
                  alt=""
                />

                <IconButton
                  className=""
                  size="small"
                  color="error"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={(event) => formik.setFieldValue("image", "")}
                >
                  <Close sx={{ fontSize: "1.5rem" }} />
                </IconButton>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="fileInput">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                    {uploadImage ? (
                      <div className="left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                        <CircularProgress />
                      </div>
                    ) : (
                      <AddPhotoAlternate className="text-grey-700" />
                    )}
                  </span>
                </label>
              </>
            )}
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="price"
              name="price"
              label="Price"
              value={formik.values.price}
              onChange={formik.handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="Duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            {/* <TextField
              fullWidth
              id="duration"
              name="duration"
              label="Duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              required
            /> */}

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formik.values.categoryId}
                label="Age"
                name="categoryId"
                onChange={formik.handleChange}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    {salon
                      ? "No categories found. Please create one first."
                      : "Loading categories..."}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ py: ".8rem" }}
            >
              {" "}
              Create Service
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateServiceForm;
