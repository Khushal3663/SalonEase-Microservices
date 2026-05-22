package com.khushal.model;

import lombok.Data;

@Data
public class SalonReport {
    private Long salonId;
    private String name;
    private int totalEarnings;
    private int totalBookings;
    private int cancelledBookings;
    private int totalRefund; // count based on cancel bookings
}
