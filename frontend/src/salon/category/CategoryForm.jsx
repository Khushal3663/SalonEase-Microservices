import { AddPhotoAlternate, Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../redux/categorySlice";
import uploadImageToCloudinary from "../../util/uploadImageToCloudinary";
import { useSnackbar } from "../../snackbar/SnackbarContext";

const CategoryForm = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(false);
  const { salon } = useSelector((state) => state.salon);

  const showSnackbar = useSnackbar();

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    onSubmit: () => {
      const categoryData = {
        salonId: salon.id,
        name: formik.values.name,
        image: formik.values.image,
      };
      dispatch(createCategory(categoryData));
      console.log("submitting" + formik.values);
      showSnackbar("Category Created Successfully!", "success");
      setActiveTab(1);
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
                      <div className=" w-24 h-24 flex justify-center items-center">
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
            <Button
              type="submit"
              variant="outlined"
              fullWidth
              sx={{ py: ".8rem" }}
            >
              {" "}
              Create Category
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CategoryForm;
