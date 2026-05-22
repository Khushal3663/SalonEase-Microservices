package com.khushal.controller;

import com.khushal.mapper.NotificationMapper;
import com.khushal.model.Notification;
import com.khushal.payload.dto.BookingDTO;
import com.khushal.payload.dto.NotificationDTO;
import com.khushal.service.NotificationService;
import com.khushal.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications/salon-owner")
public class SalonNotificationController {
    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification
    ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<NotificationDTO>> getAllNotificationsBySalonId(
            @PathVariable Long salonId
    ) {
        List<Notification> notifications = notificationService.getAllNotificationsBySalonId(salonId);
        List<NotificationDTO> notificationDTOS = notifications.stream().map(
                notification -> {
                    BookingDTO bookingDTO = null;
                    try {
                        bookingDTO = bookingFeignClient.getBookingById(notification.getBookingId()).getBody();
                        return NotificationMapper.toNotificationDTO(notification, bookingDTO);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }

                }).toList();

        return ResponseEntity.ok(notificationDTOS);
    }
}
