package com.khushal.service.impl;

import com.khushal.mapper.NotificationMapper;
import com.khushal.model.Notification;
import com.khushal.payload.dto.BookingDTO;
import com.khushal.payload.dto.NotificationDTO;
import com.khushal.repository.NotificationRepository;
import com.khushal.service.NotificationService;
import com.khushal.service.RealTimeCommunicationService;
import com.khushal.service.client.BookingFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository  notificationRepository;
    private final BookingFeignClient bookingFeignClient;
    private final RealTimeCommunicationService  realTimeCommunicationService;

    @Override
    public NotificationDTO createNotification(Notification notification) throws Exception {
        Notification savedNotification = notificationRepository.save(notification);
        BookingDTO bookingDTO = bookingFeignClient.getBookingById(savedNotification.getBookingId()).getBody();
        NotificationDTO notificationDTO = NotificationMapper.toNotificationDTO(savedNotification,bookingDTO);

        realTimeCommunicationService.sendNotification(notificationDTO);

        return notificationDTO;
    }

    @Override
    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getAllNotificationsBySalonId(Long salonId) {
        return notificationRepository.findBySalonId(salonId);
    }

    @Override
    public Notification markNotificationAsRead(Long notificationId) throws Exception {
        return notificationRepository.findById(notificationId)
                .map(
                        notification -> {
                            notification.setIsRead(true);
                            return notificationRepository.save(notification);
                        }
                )
                .orElseThrow(()-> new Exception("Notification not found"));
    }
}
