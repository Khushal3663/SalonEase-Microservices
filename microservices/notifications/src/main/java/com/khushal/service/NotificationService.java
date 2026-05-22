package com.khushal.service;

import com.khushal.model.Notification;
import com.khushal.payload.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(Notification notification) throws Exception;

    List<Notification> getAllNotificationsByUserId(Long userId);

    List<Notification> getAllNotificationsBySalonId(Long salonId);

    Notification markNotificationAsRead(Long notificationId) throws Exception;
}
