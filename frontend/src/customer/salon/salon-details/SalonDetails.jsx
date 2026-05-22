import React, { useEffect, useState } from "react";
import SalonDetail from "./SalonDetail";
import { Button, Divider, Typography } from "@mui/material";
import SalonServiceDetails from "./SalonServiceDetails";
import Review from "../../review/Review";
import CreateReviewForm from "../../review/CreateReviewForm";
import { useDispatch, useSelector } from "react-redux";
import { getSalonById } from "../../../redux/salonSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoriesBySalon } from "../../../redux/categorySlice";

const tabs = [
  {
    name: "All services",
  },
  {
    name: "Reviews",
  },
  {
    name: "Create Review",
  },
];
const SalonDetails = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { salon, loading } = useSelector((state) => state.salon);

  useEffect(() => {
    if (id) {
      // 1. Fetch Salon Details if not already loaded for this ID
      if (!salon || salon.id !== parseInt(id)) {
        dispatch(getSalonById(id));
      }

      // 2. Fetch Categories for this salon
      dispatch(getCategoriesBySalon(id));
    }
  }, [id, dispatch, salon?.id]); // Check salon.id to prevent loops

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  // Inside SalonDetails.js
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h5">Loading Salon Details...</Typography>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Typography variant="h4" color="error" className="font-bold">
          404
        </Typography>
        <Typography variant="h6">Salon Not Found</Typography>
        <Button
          variant="contained"
          className="mt-4"
          onClick={() => navigate("/")}
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="px-5 lg-px-20">
      <SalonDetail />
      <div className="space-y-5">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <Button
              onClick={() => handleActiveTab(tab)}
              variant={tab.name == activeTab.name ? "contained" : "outlined"}
            >
              {tab.name}
            </Button>
          ))}
        </div>
        <Divider />
      </div>

      <div>
        {activeTab.name === "Create Review" ? (
          <div className="flex justify-center">
            <CreateReviewForm handleActiveTab={handleActiveTab} />
          </div>
        ) : activeTab.name === "Reviews" ? (
          <div>
            <Review />
          </div>
        ) : (
          <div>
            <SalonServiceDetails />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonDetails;
