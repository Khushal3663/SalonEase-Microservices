package com.khushal.payload.dto;

import com.khushal.domain.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDTO {
    private Long id;

    private Long salonId;

    private Long customerId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Set<Long> serviceIds; // selected services by customer

    private BookingStatus status;

    private SalonDTO salon;

    private int totalPrice;
}
