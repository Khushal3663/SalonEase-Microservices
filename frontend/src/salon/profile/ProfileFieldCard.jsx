import { Divider } from "@mui/material";
import React from "react";

const ProfileFieldCard = ({ keys, value }) => {
  return (
    <div className="py-4 flex items-center bg-transparent transition-colors hover:bg-slate-50/50 px-2 rounded-lg">
      <p className="w-24 lg:w-32 text-gray-500 font-medium text-sm lg:text-base shrink-0">
        {keys}
      </p>

      <Divider flexItem orientation="vertical" className="mx-2" />

      <p className="pl-4 lg:pl-6 font-semibold text-gray-800 text-sm lg:text-base break-words min-w-0">
        {value || "Not Provided"}
      </p>
    </div>
  );
};

export default ProfileFieldCard;
