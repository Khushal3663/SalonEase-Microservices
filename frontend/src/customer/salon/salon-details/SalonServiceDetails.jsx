import React, { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import ServiceCard from "./ServiceCard";
import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import { RemoveShoppingCart, ShoppingCart } from "@mui/icons-material";
import SelectedServiceList from "./SelectedServiceList";
import { useDispatch, useSelector } from "react-redux";
import { getServicesBySalon } from "../../../redux/serviceSlice";
import { useParams } from "react-router-dom";
import { getCategoriesBySalon } from "../../../redux/categorySlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";
import { createBooking, getBookedSlots } from "../../../redux/bookingSlice";
import { format, parse, setHours, setMinutes } from "date-fns";
import { getTimeFormat } from "../../../util/dateAndTimeFormat";
import { getSalonById } from "../../../redux/salonSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const SalonServiceDetails = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [bookingData, setBookingData] = useState({
    services: [],
    time: null,
  });

  const [open, setOpen] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.service);
  const { jwt } = useSelector((state) => state.auth);

  const { categories } = useSelector((state) => state.category);
  const { bookedSlots } = useSelector((state) => state.booking);
  const { salon } = useSelector((state) => state.salon);

  useEffect(() => {
    const serviceReqData = { salonId: id, categoryId: selectedCategoryId };
    dispatch(getServicesBySalon(serviceReqData));
  }, [jwt, dispatch, selectedCategoryId]);

  const handleCategoryClick = (categoryId) => {
    console.log("selected category, ", categoryId);
    setSelectedCategoryId(categoryId);
  };

  const handleSelectService = (service) => {
    setBookingData((prevState) => {
      // Check if the service already exists in the list
      const isAlreadySelected = prevState.services.find(
        (s) => s.id === service.id,
      );

      if (isAlreadySelected) return prevState; // Do nothing if it's a duplicate

      return {
        ...prevState,
        services: [...prevState.services, service],
      };
    });
  };
  const handleRemoveService = (serviceId) => {
    setBookingData((prevState) => ({
      ...prevState,
      services: prevState.services.filter(
        (service) => service.id !== serviceId,
      ),
    }));
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleDateChange = (newValue) => {
    setBookingData((prev) => ({ ...prev, time: newValue }));

    // Fetch slots whenever the date changes
    if (newValue && id) {
      const formattedDate = format(newValue, "yyyy-MM-dd");
      dispatch(getBookedSlots({ salonId: id, date: formattedDate }));
    }
  };

  const handleBooking = () => {
    const serviceIds = bookingData.services.map((service) => service.id);
    const reqData = {
      salonId: parseInt(id),
      paymentMethod: "RAZORPAY",
      bookingRequest: {
        serviceIds: serviceIds,
        startTime: format(bookingData.time, "yyyy-MM-dd'T'HH:mm:ss"),
      },
    };
    dispatch(createBooking(reqData));
  };

  const isSlotOccupied = () => {
    if (!bookingData.time || bookedSlots.length === 0) return false;

    const totalDuration = bookingData.services.reduce(
      (acc, s) => acc + s.duration,
      0,
    );
    const newStart = new Date(bookingData.time).getTime();
    const newEnd = newStart + totalDuration * 60000; // minutes to ms

    return bookedSlots.some((slot) => {
      const existingStart = new Date(slot.startTime).getTime();
      const existingEnd = new Date(slot.endTime).getTime();

      return newStart < existingEnd && newEnd > existingStart;
    });
  };
  const occupied = isSlotOccupied();

  useEffect(() => {
    if (!salon) {
      console.log("Fetching salon by id");
      dispatch(getSalonById(id));
    }
  }, [salon?.id]);
  console.log("salon", salon);

  const getDynamicTimeLimit = (timeString, baseDate) => {
    if (!timeString || !baseDate) return null;

    // 1. Parse the salon hour (e.g., "09:00:00")
    const parsedTime = parse(timeString, "HH:mm:ss", new Date());

    // 2. Apply that hour/minute to the currently selected date
    let limitDate = new Date(baseDate);
    limitDate = setHours(limitDate, parsedTime.getHours());
    limitDate = setMinutes(limitDate, parsedTime.getMinutes());

    return limitDate;
  };

  const referenceDate = bookingData.time || new Date();
  const minTime = getDynamicTimeLimit(salon?.openTime, referenceDate);
  const maxTime = getDynamicTimeLimit(salon?.closeTime, referenceDate);

  // Calculate buffer so service doesn't end after closing
  const totalDuration = bookingData.services.reduce(
    (acc, s) => acc + s.duration,
    0,
  );
  const lastAllowedStart = maxTime
    ? new Date(maxTime.getTime() - totalDuration * 60000)
    : null;

  // 1. Define Empty States as sub-components for cleanliness
  const EmptyCategoryState = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-xl border-2 border-dashed">
      <Typography variant="h6" className="text-gray-400">
        No Categories Found
      </Typography>
      <p className="text-sm text-gray-500">
        This salon hasn't added any service categories yet.
      </p>
    </div>
  );

  const EmptyServiceState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <RemoveShoppingCart sx={{ fontSize: 60, color: "#94a3b8" }} />
      </div>
      <Typography variant="h5" className="font-bold text-gray-700">
        No Services Available
      </Typography>
      <p className="text-gray-500 mt-2 max-w-md">
        There are currently no services listed for this category. Please try
        selecting a different category or check back later.
      </p>
    </div>
  );

  return (
    <div className="lg:flex gap-5 lg:h-[90vh] w-full mt-10 px-4 lg:px-0">
      <section className="space-y-5 lg:border-r lg:w-[25%] lg:pr-5 mb-10 lg:mb-0">
        <Typography variant="h6" className="lg:hidden font-bold mb-4">
          Categories
        </Typography>
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              handleCategoryClick={handleCategoryClick}
              category={category}
              selectedCategoryId={selectedCategoryId}
            />
          ))
        ) : (
          <EmptyCategoryState />
        )}
      </section>
      <section className="space-y-5 lg:w-[50%] lg:px-20 overflow-y-auto mb-10 lg:mb-0 py-5 lg:py-0">
        <Typography variant="h6" className="lg:hidden font-bold mb-4">
          Services
        </Typography>
        {services && services.length > 0 ? (
          services.map((service) => (
            <div key={service.id} className="space-y-4">
              <ServiceCard
                service={service}
                onSelect={handleSelectService}
                selectedServices={bookingData.services}
              />
              <Divider />
            </div>
          ))
        ) : (
          <EmptyServiceState />
        )}
      </section>
      {categories.length > 0 && (
        <section className="lg:w-[25%] pb-10 lg:pb-0">
          <div className="border rounded-md p-5">
            {bookingData?.services.length > 0 ? (
              <div>
                <div className="flex item-center gap-2">
                  <ShoppingCart sx={{ fontSize: "30px", color: "green" }} />
                  <h1 className="font-thin text-sm">Selected Services</h1>
                </div>
                <SelectedServiceList
                  selectedServices={bookingData.services}
                  onRemove={handleRemoveService}
                />
                <Button
                  onClick={handleModalOpen}
                  sx={{ py: "0.7rem" }}
                  fullWidth
                  variant="contained"
                >
                  Book Now
                </Button>
              </div>
            ) : (
              <div className="flex flex-column gap-3 items-center justify-center">
                <RemoveShoppingCart sx={{ fontSize: 40, color: "green" }} />
                <Typography variant="body2">
                  Select services to start booking
                </Typography>
              </div>
            )}
          </div>
        </section>
      )}

      <Modal open={open} onClose={handleModalClose}>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
       w-[90%] lg:w-[600px] bg-white shadow-xl p-6 rounded-xl"
        >
          <Typography variant="h6" className="mb-4 font-bold border-b pb-2">
            Finalize Your Appointment
          </Typography>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Typography variant="subtitle2" color="textSecondary">
                Selected Services
              </Typography>
              <SelectedServiceList
                onRemove={handleRemoveService}
                selectedServices={bookingData.services}
              />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  ₹{bookingData.services.reduce((acc, s) => acc + s.price, 0)}
                </span>
              </div>
            </div>

            <div className="space-y-6 py-4">
              {bookedSlots.length > 0 && (
                <div className="mb-4">
                  <Typography
                    variant="caption"
                    className="text-gray-500 uppercase font-bold"
                  >
                    Already Booked Today:
                  </Typography>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {bookedSlots.map((slot, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded border border-red-100"
                      >
                        {format(new Date(slot.startTime), "hh:mm a")} -{" "}
                        {format(new Date(slot.endTime), "hh:mm a")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Pick a Time Slot"
                  value={bookingData.time}
                  onChange={handleDateChange}
                  minTime={minTime}
                  maxTime={lastAllowedStart || maxTime}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: occupied,
                      helperText: occupied
                        ? "This time slot is already taken. Please choose another."
                        : "Slot available",
                    },
                  }}
                />
              </LocalizationProvider>

              <Button
                fullWidth
                variant="contained"
                disabled={
                  occupied ||
                  !bookingData.time ||
                  bookingData?.services.length == 0
                }
                onClick={handleBooking}
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                {occupied ? "Slot Occupied" : "Confirm Booking"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleModalClose}
                sx={{ py: 1.5, fontWeight: "bold", my: 1.5 }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalonServiceDetails;
