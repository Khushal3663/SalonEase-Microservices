package com.khushal.Controller;

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
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final BookingFeignClient bookingFeignClient;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestBody Notification notification
            ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getAllNotificationsByUserId(
            @PathVariable Long userId
            ) {
        List<Notification> notifications = notificationService.getAllNotificationsByUserId(userId);
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

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId
    ) throws Exception {
        Notification notification = notificationService.markNotificationAsRead(notificationId);
        BookingDTO bookingDTO = bookingFeignClient.getBookingById(notification.getBookingId()).getBody();
        return ResponseEntity.ok(NotificationMapper.toNotificationDTO(notification, bookingDTO));
    }

    @GetMapping
    public ResponseEntity<?> dummyController(
            @RequestBody Notification notification
    ) throws Exception {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }
}
