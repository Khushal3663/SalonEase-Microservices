import React, { useEffect } from "react";
import ProfileFieldCard from "./ProfileFieldCard";
import { CircularProgress, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { parse, format } from "date-fns";
import { getSalonByOwner } from "../../redux/salonSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { salon, loading } = useSelector((state) => state.salon);
  const { user } = useSelector((state) => state.auth);

  const getTimeFormat = (time) => {
    return format(parse(time, "HH:mm:ss", new Date()), "h:mm a");
  };

  useEffect(() => {
    if (!salon) {
      dispatch(getSalonByOwner());
    }
  }, [dispatch]);
  if (!salon) {
    return (
      <div className="min-h-[90vh] flex justify-center items-center">
        {/* Set size to 80px or 100px for a "Big" look */}
        <CircularProgress size={100} thickness={4} color="primary" />
      </div>
    );
  }

  // if (loading)
  //   return (
  //     <div className="min-h-[90vh] flex justify-center items-center">
  //       {/* Set size to 80px or 100px for a "Big" look */}
  //       <CircularProgress size={100} thickness={4} color="primary" />
  //     </div>
  //   );
  return (
    <div className="lg:px-20 lg:bottom-20 space-y-20">
      <div className="w-full lg:w-[70%]">
        <h1 className="text-5xl font-bold pb-5">{salon?.name}</h1>
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              // src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934194/barber-1453064_1280_o1vfee.jpg"
              src={salon?.images[0]}
              alt=""
            />
          </div>
          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              // src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934203/barber-5497152_1280_zgcao8.jpg"
              src={salon?.images[1]}
              alt=""
            />
          </div>
          <div className="col-span-1">
            <img
              className="w-full rounded-md h-[15rem] object-cover"
              // src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934217/beauty-salon-4043096_1280_itrjdr.jpg"
              src={salon?.images[2]}
              alt=""
            />
          </div>
        </section>
      </div>
      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Salon Details</h1>
        </div>

        <div>
          <ProfileFieldCard keys={"Salon Name"} value={salon?.name} />
          <Divider />
          <ProfileFieldCard keys={"Salon Address"} value={salon?.address} />
          <Divider />
          <ProfileFieldCard
            keys={"Open Time"}
            value={getTimeFormat(salon?.openTime)}
          />
          <Divider />
          <ProfileFieldCard
            keys={"Close Time"}
            value={getTimeFormat(salon?.closeTime)}
          />
        </div>
      </div>

      {/* Owner Details */}
      <div className="mt-10 lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="text-2xl font-bold text-gray-600">Owner Details</h1>
        </div>

        <div>
          <ProfileFieldCard keys={"Owner Name"} value={user?.fullName} />
          <Divider />
          <ProfileFieldCard keys={"Email"} value={user?.email} />
          <Divider />
          <ProfileFieldCard keys={"Role"} value={"Salon Owner"} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
