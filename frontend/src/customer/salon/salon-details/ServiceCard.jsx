import { FiberManualRecord } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const ServiceCard = ({ service, onSelect, selectedServices }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleIsAdded = (value) => {
    setIsAdded();
  };
  useEffect(() => {
    const alreadyAdded = selectedServices.some(
      (item) => item.id === service.id,
    );

    if (alreadyAdded) {
      setIsAdded(true);
    } else {
      setIsAdded(false);
    }
  }, [selectedServices, service.id]);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-5">
        <div className="space-y-1 w-[60%]">
          <h1 className="text-2xl font-semibold">{service.name}</h1>
          <p className="text-gray-500 text-sm">{service.description}</p>
          <div className="flex items-center gap-3">
            <p>₹{service.price}</p>
            <FiberManualRecord sx={{ fontSize: "10px", color: "grey" }} />
            <p>{service.duration} mins</p>
          </div>
        </div>
        <div className="space-y-3">
          <img
            className="w-32 h-32 object-cover rounded-md"
            // src="https://res.cloudinary.com/dxoqwusir/image/upload/v1732883653/barber-3173419_1280_juevxz.jpg"
            src={service.image}
            alt=""
          />
          {isAdded ? (
            <Button
              fullWidth
              variant="contained"
              disabled // Make it unclickable
              color="success"
            >
              Selected
            </Button>
          ) : (
            <Button
              onClick={() => onSelect(service)}
              fullWidth
              variant="outlined"
            >
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
