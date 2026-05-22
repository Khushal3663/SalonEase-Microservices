package com.khushal.service;

import com.khushal.model.Booking;

import java.util.List;
import java.util.Map;

public interface BookingChartService {
    public List<Map<String, Object>> generateEarningsChartData(List<Booking> bookings);

    public List<Map<String, Object>> generateBookingCountChartData(List<Booking> bookings);
}
