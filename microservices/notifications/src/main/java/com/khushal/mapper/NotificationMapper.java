package com.khushal.mapper;

import com.khushal.model.Notification;
import com.khushal.payload.dto.BookingDTO;
import com.khushal.payload.dto.NotificationDTO;

public class NotificationMapper {

    public static NotificationDTO toNotificationDTO(Notification notification, BookingDTO bookingDTO) throws Exception {
        return NotificationDTO.builder()
                .id(notification.getId())
                .type(notification.getType())
                .description(notification.getDescription())
                .isRead(notification.getIsRead())
                .userId(notification.getUserId())
                .salonId(notification.getSalonId())
                .createdAt(notification.getCreatedAt())
                .booking(bookingDTO)
                .build();
    }
}
