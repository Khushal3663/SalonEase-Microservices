import React, { useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { Divider, CircularProgress, Skeleton, Typography } from "@mui/material";
import RatingCard from "./RatingCard";
import CreateReviewForm from "./CreateReviewForm";
import { useDispatch, useSelector } from "react-redux";
import { getSalonReviews } from "../../redux/reviewSlice";
import { useParams } from "react-router-dom";

const Review = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { reviews, loading } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getSalonReviews(id));
  }, [id, dispatch]);

  return (
    <div className="pt-10 flex flex-col lg:flex-row gap-20">
      {/* LEFT: RATINGS SECTION */}
      <section className="w-full md:w-1/2 lg:w-[40%] space-y-2">
        <h1 className="font-semibold text-lg pb-4">Review & Rating</h1>
        {loading ? (
          // Skeleton card mockup while ratings are computing
          <div className="border p-6 rounded-xl shadow-sm bg-white space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton
                variant="rectangular"
                width={60}
                height={40}
                className="rounded"
              />
              <div className="space-y-1 flex-1">
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="25%" height={15} />
              </div>
            </div>
            <div className="space-y-3 pt-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} variant="rounded" width="100%" height={8} />
              ))}
            </div>
          </div>
        ) : (
          <RatingCard reviews={reviews} />
        )}
      </section>

      {/* RIGHT: REVIEWS LIST SECTION */}
      <section className="w-full md:w-1/2 lg:w-[60%]">
        <div className="mt-10">
          <div className="space-y-5">
            {loading ? (
              // Display multiple placeholder items to resemble incoming reviews
              [...Array(3)].map((_, index) => (
                <div key={index} className="space-y-4 p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton variant="circular" width={44} height={44} />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="text" width="30%" height={20} />
                      <Skeleton variant="text" width="15%" height={15} />
                    </div>
                  </div>
                  <Skeleton variant="text" width="20%" height={15} />
                  <Skeleton variant="text" width="100%" height={40} />
                  <Divider />
                </div>
              ))
            ) : reviews && reviews.length > 0 ? (
              reviews.toReversed().map((review) => (
                <div key={review.id || review._id} className="space-y-4">
                  <ReviewCard review={review} />
                  <Divider />
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Typography className="text-gray-400 font-medium">
                  No reviews posted yet. Be the first to add one!
                </Typography>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Review;
