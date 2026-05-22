import { Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateBookingStatus } from "../../redux/bookingSlice";
import { proceedPayment } from "../../redux/paymentSlice";

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.booking);

  const paymentId = searchParams.get("razorpay_payment_id");
  const paymentLinkId = searchParams.get("razorpay_payment_link_id");
  const status = searchParams.get("razorpay_payment_link_status");

  useEffect(() => {
    if (paymentId) {
      dispatch(
        proceedPayment({ paymentId: paymentId, paymentLinkId: paymentLinkId }),
      );
    }
  }, [paymentId, dispatch]);

  if (loading) return <CircularProgress />;

  return (
    <div className="min-h-[90vh] flex justify-center items-center">
      <div
        className="bg-primary text-secondary mp-8 w-[90%] lg:w-[25%] 
        border rounded-md h-[40vh] flex flex-col gap-7 items-center justify-center"
      >
        <h1 className="text-3xl font-semibold">Congratulations!</h1>
        <h1 className="text-2xl font-semibold"> Your Boooking Get Success!</h1>
        <div className="">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Go To Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
