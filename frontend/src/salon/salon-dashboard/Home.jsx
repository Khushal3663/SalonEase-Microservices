import React, { useEffect, useMemo } from "react";
import EarningCharts from "./chart/EarningCharts";
import ReportCard from "./ReportCard";
import StatusBreakdown from "./chart/StatusBreakdown";
import {
  AccountBalance,
  AssignmentTurnedIn,
  Cancel,
  EventNote,
} from "@mui/icons-material";
import BookingCharts from "./chart/BookingCharts";
import { useDispatch, useSelector } from "react-redux";
import { getSalonBookings } from "../../redux/bookingSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getSalonBookings());
  }, [dispatch]);

  // useMemo to prevent recalculating on every re-render
  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
    const pending = bookings.filter((b) => b.status === "PENDING");
    const cancelled = bookings.filter((b) => b.status === "CANCELLED");

    const totalEarnings = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);

    // Data formatted for Recharts PieChart
    const statusData = [
      { name: "Confirmed", value: confirmed.length, color: "#10B981" }, // Green
      { name: "Pending", value: pending.length, color: "#F59E0B" }, // Amber
      { name: "Cancelled", value: cancelled.length, color: "#EF4444" }, // Red
    ];

    const confirmedCount = confirmed.length;
    const cancelledCount = cancelled.length;
    const pendingCount = pending.length;

    return {
      totalEarnings,
      totalBookings: bookings.length,
      statusData,
      confirmedCount,
      cancelledCount,
      pendingCount,
    };
  }, [bookings]);
  return (
    <div className="space-y-6 p-4">
      {/* 4-Column Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ReportCard
          icon={<AccountBalance className="text-green-600" />}
          value={"₹" + stats.totalEarnings}
          title={"Total Revenue"}
        />
        <ReportCard
          icon={<EventNote className="text-blue-600" />}
          value={stats.totalBookings}
          title={"Total Bookings"}
        />
        <ReportCard
          icon={<AssignmentTurnedIn className="text-purple-600" />}
          value={stats.confirmedCount}
          title={"Confirmed Bookings"}
        />
        <ReportCard
          icon={<Cancel className="text-red-600" />}
          value={stats.cancelledCount}
          title={"Cancelled Bookings"}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="border rounded-xl p-5 bg-white shadow-sm w-full lg:w-[70%]">
          <h1 className="text-lg font-bold pb-5 text-gray-700">
            Revenue Overview
          </h1>
          <EarningCharts />
        </div>

        <div className="w-full lg:w-[30%]">
          <StatusBreakdown data={stats.statusData} />
        </div>
      </div>

      <div className="border rounded-xl p-5 bg-white shadow-sm w-full">
        <h1 className="text-lg font-bold pb-5 text-gray-700">
          Booking Frequency
        </h1>
        <BookingCharts />
      </div>
    </div>
  );
  // return (
  //   <div className="space-y-5">
  //     <div className="lg:flex gap-5">
  //       <div className="space-y-10 rounded-md w-full lg:w-[70%]">
  //         <div className="border rounded-lg p-5 w-full">
  //           <h1 className="text-lg font-bold pb-5 text-primary">
  //             Total Revenue
  //           </h1>

  //           <EarningCharts />
  //         </div>
  //       </div>

  //       <section className="space-y-5 w-full lg:w-[30%]">
  //         <ReportCard
  //           icon={<AccountBalance />}
  //           value={"₹" + 499}
  //           title={"Total Earnings"}
  //         />

  //         <ReportCard
  //           icon={<AccountBalance />}
  //           value={"₹" + 499}
  //           title={"Total Bookings"}
  //         />

  //         <ReportCard
  //           icon={<AccountBalance />}
  //           value={"₹" + 499}
  //           title={"Total Refunds"}
  //         />
  //         <ReportCard
  //           icon={<AccountBalance />}
  //           value={"₹" + 499}
  //           title={"Cancel Bookings"}
  //         />
  //       </section>
  //     </div>

  //     <div className="space-y-10 rounded-md w-full">
  //       <div className="border rounded-lg p-5 w-full">
  //         <h1 className="text-lg font-bold pb-5 text-primary">Total Booking</h1>
  //         <BookingCharts />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Home;
