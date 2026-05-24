import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop";

const SalonCard = ({ salon }) => {
  const navigate = useNavigate();

  const displayImage =
    salon.images && salon.images.length > 0
      ? salon.images[0]
      : PLACEHOLDER_IMAGE;
  return (
    <div
      onClick={() => navigate(`/salon/${salon.id}`)}
      className=" cursor-pointer"
    >
      <div className="width-56 md:w-80 rounded-md bg-slate-100">
        <img
          className="w-full h-[15rem] object-cover rounded-t-md"
          // src="https://images.pexels.com/photos/4625615/pexels-photo-4625615.jpeg?auto=compress&cs=tinysrgb&w=600"
          src={displayImage}
          alt={salon.name}
        />
        <div className="p-5 space-y-2">
          <h1>{salon.name}</h1>
          <div className="text-white tex-sm p-1 bg-green-700 rounded-full w-14 flex items-center justify-center gap-1">
            4.5 <StarIcon sx={{ fontSize: "16px" }} />
          </div>
          {/* <p>Professional salon and haircut...</p> */}
          <p>{salon.address}</p>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
