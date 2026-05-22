import React, { useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { Divider } from "@mui/material";
import RatingCard from "./RatingCard";
import CreateReviewForm from "./CreateReviewForm";
import { useDispatch, useSelector } from "react-redux";
import { getSalonReviews } from "../../redux/reviewSlice";
import { useParams } from "react-router-dom";

const Review = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getSalonReviews(id));
  }, [id, dispatch]);
  return (
    <div className="pt-10 flex flex-col lg:flex-row gap-20">
      <section className="w-full md:w-1/2 lg:w-[40%] space-y-2">
        <h1 className="font-semibold text-lg pb-4">Review & Rating</h1>
        <RatingCard reviews={reviews} />
      </section>

      <section className="w-full md:w-1/2 lg:w-[60%]">
        <div className="mt-10">
          <div className="space-y-5">
            {reviews.toReversed().map((review) => (
              <div className="space-y-4">
                <ReviewCard review={review} />
                <Divider />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Review;
