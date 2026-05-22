import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const SelectedServiceList = ({ selectedServices, onRemove }) => {
  return (
    <div className="my-5 space-y-2">
      {selectedServices.map((service) => (
        <div className="py-2 px-4 rounded-md bg-slate-100 flex justify-between items-center">
          <h1 className="font-thin">{service.name}</h1>
          <p>Rs {service.price}</p>
          <IconButton onClick={() => onRemove(service.id)}>
            <Close />
          </IconButton>
        </div>
      ))}
    </div>
  );
};

export default SelectedServiceList;
