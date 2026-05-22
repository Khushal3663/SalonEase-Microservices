import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useState } from "react";
import OwnerDetailsForm from "./OwnerDetailsForm";
import { useFormik } from "formik";
import SalonDetailsForm from "./SalonDetailsForm";
import SalonAddressForm from "./SalonAddressForm";
import { format } from "date-fns";
import { createSalon } from "../../redux/salonSlice";
import { useDispatch } from "react-redux";
import { useSnackbar } from "../../snackbar/SnackbarContext";
import { signup } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const steps = ["Owner Details", "Salon Details", "Salon Address"];

const SalonAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const handleActiveStep = (value) => () => {
    setActiveStep((prev) => prev + value);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "SALON_OWNER",
      salonDetails: {
        name: "",
        openTime: null,
        closeTime: null,
        images: [],
      },
      salonAddress: {
        phoneNumber: "",
        pincode: "",
        city: "",
        state: "",
        email: "",
        address: "",
      },
    },
    onSubmit: async (values) => {
      console.log("Submitting partner form", values);
      const salonData = {
        ...values,
        username: values.email,
      };
      console.log("Submitting salonData", salonData);

      try {
        // 1. SIGNUP
        const signupPayload = {
          userData: {
            fullName: values.fullName,
            email: values.email,
            username: values.email,
            password: values.password,
            role: "SALON_OWNER",
          },
        };

        const authResponse = await dispatch(signup(signupPayload)).unwrap();
        // authResponse has { jwt, role, ... } but NO user ID.

        const salonDTO = {
          name: values.salonDetails.name,
          images: values.salonDetails.images.filter((img) => img !== ""),
          openTime: values.salonDetails.openTime
            ? format(new Date(values.salonDetails.openTime), "HH:mm:ss")
            : null,
          closeTime: values.salonDetails.closeTime
            ? format(new Date(values.salonDetails.closeTime), "HH:mm:ss")
            : null,
          // Mapping Address details to the SalonDTO fields
          address: values.salonAddress.address,
          city: values.salonAddress.city,
          phoneNumber: values.salonAddress.phoneNumber,
          email: values.salonAddress.email,
        };

        await dispatch(createSalon({ salonDTO })).unwrap();

        // FINALLY: Navigate after everything is done
        showSnackbar("Account and Salon created successfully!", "success");
        navigate("/salon-dashboard");
      } catch (error) {
        console.error("Workflow failed:", error);
        showSnackbar(
          error || "Registration failed. Please try again.",
          "error",
        );
      }
      console.log("submitting" + serviceData);
    },
  });

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* <form onSubmit={formik.handleSubmit}> */}
      <div className="mt-20 space-y-10">
        <div>
          {activeStep === 0 ? (
            <OwnerDetailsForm formik={formik} />
          ) : activeStep === 1 ? (
            <SalonDetailsForm formik={formik} />
          ) : (
            <SalonAddressForm formik={formik} />
          )}
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={handleActiveStep(-1)}
            variant="contained"
            disabled={activeStep <= 0}
          >
            Back
          </Button>
          <Button
            onClick={
              activeStep === steps.length - 1
                ? formik.handleSubmit
                : handleActiveStep(1)
            }
            variant="contained"
            disabled={formik.isSubmitting} // Disable while loading
            sx={{ position: "relative" }} // Useful for centering absolute loader if needed
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep >= steps.length - 1 ? (
              "Create Account"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
      {/* </form> */}
    </div>
  );
};

export default SalonAccountForm;
