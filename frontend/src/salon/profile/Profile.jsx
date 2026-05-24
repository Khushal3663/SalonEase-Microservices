import React, { useEffect } from "react";
import ProfileFieldCard from "./ProfileFieldCard";
import {
  CircularProgress,
  Divider,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { parse, format } from "date-fns";
import { getSalonByOwner } from "../../redux/salonSlice";

// Icons for a cleaner UI look
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";

const Profile = () => {
  const dispatch = useDispatch();
  const { salon, loading } = useSelector((state) => state.salon);
  const { user } = useSelector((state) => state.auth);

  const images = salon?.images || [];
  const placeholder =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop";

  const getTimeFormat = (time) => {
    if (!time) return "--:--";
    return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
  };

  useEffect(() => {
    if (!salon && !loading) {
      dispatch(getSalonByOwner());
    }
  }, [dispatch, salon, loading]);

  if (loading || !salon) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center space-y-4">
        <CircularProgress size={80} thickness={4} color="success" />
        <Typography className="text-gray-500 font-medium">
          Loading profile details...
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* HEADER & DYNAMIC IMAGE GRID */}
      <div className="space-y-6">
        <Typography
          variant="h3"
          className="font-extrabold text-gray-900 tracking-tight"
        >
          {salon?.name}
        </Typography>

        <section className="flex flex-col gap-2 overflow-hidden rounded-xl shadow-md bg-white p-2">
          {/* ROW 1: Main Viewport */}
          {images.length === 2 ? (
            <div className="grid grid-cols-2 gap-2 h-[14rem] md:h-[22rem]">
              <div className="h-full">
                <img
                  src={images[0]}
                  className="w-full h-full object-cover rounded-l-lg"
                  alt="salon-gallery-1"
                />
              </div>
              <div className="h-full">
                <img
                  src={images[1]}
                  className="w-full h-full object-cover rounded-r-lg"
                  alt="salon-gallery-2"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-[16rem] md:h-[24rem]">
              <img
                src={images.length > 0 ? images[0] : placeholder}
                className="w-full h-full object-cover rounded-lg"
                alt="salon-main"
              />
            </div>
          )}

          {/* ROW 2: Supporting Sub-galleries */}
          {images.length > 2 && (
            <div className="grid grid-cols-2 gap-2 h-[8rem] md:h-[14rem]">
              <div className="h-full">
                <img
                  src={images[1]}
                  className="w-full h-full object-cover rounded-bl-lg"
                  alt="salon-sub-1"
                />
              </div>

              <div className="h-full relative">
                <img
                  src={images[2] || images[0]}
                  className="w-full h-full object-cover rounded-br-lg"
                  alt="salon-sub-2"
                />
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold rounded-br-lg transition-all hover:bg-black/70">
                    +{images.length - 2} More Photos
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* INFORMATION CARDS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Salon Details Card */}
        <Paper elevation={2} className="p-6 rounded-xl space-y-4">
          <Box className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <StorefrontIcon className="text-green-700" />
            <Typography variant="h5" className="font-bold text-gray-800">
              Salon Details
            </Typography>
          </Box>

          <div className="divide-y divide-gray-100">
            <ProfileFieldCard keys={"Name"} value={salon?.name} />
            <ProfileFieldCard keys={"Address"} value={salon?.address} />
            <ProfileFieldCard
              keys={"Open Time"}
              value={getTimeFormat(salon?.openTime)}
            />
            <ProfileFieldCard
              keys={"Close Time"}
              value={getTimeFormat(salon?.closeTime)}
            />
          </div>
        </Paper>

        {/* Owner Details Card */}
        <Paper elevation={2} className="p-6 rounded-xl space-y-4">
          <Box className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <PersonIcon className="text-green-700" />
            <Typography variant="h5" className="font-bold text-gray-800">
              Owner Details
            </Typography>
          </Box>

          <div className="divide-y divide-gray-100">
            <ProfileFieldCard keys={"Full Name"} value={user?.fullName} />
            <ProfileFieldCard keys={"Email"} value={user?.email} />
            <ProfileFieldCard keys={"Role"} value={"Salon Owner"} />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Profile;
