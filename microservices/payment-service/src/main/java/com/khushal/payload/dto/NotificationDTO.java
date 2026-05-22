package com.khushal.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;

    private String type;

    private String description;

    private Boolean isRead = false;

    private Long userId;

    private Long salonId;

    private LocalDateTime createdAt;

    private Long bookingId;

    private BookingDTO booking;
}
