import { Box, LinearProgress, Rating } from "@mui/material";
import React from "react";

const RatingCard = ({ reviews = [] }) => {
  const totalReviews = reviews.length;

  const getCountByRating = (min, max) =>
    reviews.filter((r) => r.rating >= min && r.rating <= max).length;

  const stats = [
    { label: "Excellent", value: getCountByRating(4.5, 5), color: "#2e7d32" },
    { label: "Very Good", value: getCountByRating(3.5, 4.4), color: "#4caf50" },
    { label: "Good", value: getCountByRating(2.5, 3.4), color: "#ff9800" },
    { label: "Average", value: getCountByRating(1.5, 2.4), color: "#ed6c02" },
    { label: "Poor", value: getCountByRating(0, 1.4), color: "#d32f2f" },
  ].map((stat) => ({
    ...stat,
    percentage: totalReviews ? (stat.value / totalReviews) * 100 : 0,
  }));

  const averageRating = totalReviews
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="border p-6 rounded-xl shadow-sm bg-white">
      {/* Header Section */}
      <div className="flex items-baseline space-x-2 pb-6 border-b mb-6">
        <span className="text-4xl font-bold text-gray-800">
          {averageRating}
        </span>
        <div className="flex flex-col">
          <Rating
            readOnly
            value={Number(averageRating)}
            precision={0.1}
            size="small"
          />
          <p className="text-xs text-gray-500 ml-1">
            {totalReviews} verified reviews
          </p>
        </div>
      </div>

      {/* Progress Bars Section */}
      <Box className="space-y-4">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center w-full gap-4">
            <div className="w-20">
              <p className="text-xs font-semibold text-gray-600">
                {item.label}
              </p>
            </div>

            <div className="flex-1">
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#F0F0F0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: item.color,
                    borderRadius: 3,
                  },
                }}
              />
            </div>

            <div className="w-8 text-right">
              <p className="text-xs font-medium text-gray-400">{item.value}</p>
            </div>
          </div>
        ))}
      </Box>
    </div>
  );
};

export default RatingCard;
