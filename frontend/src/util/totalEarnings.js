const getTotalEarning = (bookings) => {
  return bookings.reduce((sum, booking) => booking.totalPrice + sum, 0);
};

export { getTotalEarning };
