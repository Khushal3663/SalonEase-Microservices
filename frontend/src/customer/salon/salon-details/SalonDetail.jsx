import React from "react";
import { useSelector } from "react-redux";
import { Box, Skeleton, Typography } from "@mui/material";
import { getTimeFormat } from "../../../util/dateAndTimeFormat";

const SalonDetail = () => {
  const { salon, loading } = useSelector((state) => state.salon);

  const images = salon?.images || [];
  const placeholder =
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop";

  if (loading) {
    return (
      <Box className="pt-5">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="20rem"
          className="rounded-xl"
        />
        <Skeleton variant="text" width="40%" height={50} className="mt-4" />
      </Box>
    );
  }
  return (
    <div className="space-y-5 mb-20">
      {/* <section className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934194/barber-1453064_1280_o1vfee.jpg"
            alt=""
          />
        </div>
        <div className="col-span-1">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934203/barber-5497152_1280_zgcao8.jpg"
            alt=""
          />
        </div>
        <div className="col-span-1">
          <img
            className="w-full rounded-md h-[15rem] object-cover"
            src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732934217/beauty-salon-4043096_1280_itrjdr.jpg"
            alt=""
          />
        </div>
      </section> */}

      <section className="flex flex-col gap-2 overflow-hidden rounded-xl">
        {/* ROW 1: The Main Image */}

        {images.length == 2 ? (
          <div className="grid grid-cols-2 gap-2 h-[8rem] md:h-[20rem]">
            {/* Image 2 */}
            <div className="h-full">
              <img
                src={images[0]}
                className="w-full h-full object-cover rounded-bl-xl"
                alt="salon-sub-1"
              />
            </div>
            <div className="h-full">
              <img
                src={images[1]}
                className="w-full h-full object-cover rounded-bl-xl"
                alt="salon-sub-1"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-[14rem] md:h-[20rem]">
            <img
              src={images.length > 0 ? images[0] : placeholder}
              className="w-full h-full object-cover rounded-t-xl"
              alt="salon-main"
            />
          </div>
        )}

        {/* ROW 2: Supporting Images (Only shows if there's more than 1 image) */}
        {images.length > 2 && (
          <div className="grid grid-cols-2 gap-2 h-[8rem] md:h-[20rem]">
            {/* Image 2 */}
            <div className="h-full">
              <img
                src={images[1]}
                className="w-full h-full object-cover rounded-bl-xl"
                alt="salon-sub-1"
              />
            </div>

            {/* Image 3 (or placeholder/more badge if 3+) */}
            <div className="h-full relative">
              <img
                src={images[2] || images[0]}
                className="w-full h-full object-cover rounded-br-xl"
                alt="salon-sub-2"
              />
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold rounded-br-xl">
                  +{images.length - 2} More
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {salon && (
        <section className="pb-2">
          <Typography variant="h4" className="font-bold text-gray-900">
            {salon.name}
          </Typography>
          <Typography variant="body1" className="text-gray-500 italic">
            {salon.address}
          </Typography>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase">
              Timing
            </span>
            <Typography variant="body2" className="text-gray-600">
              {getTimeFormat(salon.openTime)} - {getTimeFormat(salon.closeTime)}
            </Typography>
          </div>
        </section>
      )}
    </div>
  );
};

export default SalonDetail;
