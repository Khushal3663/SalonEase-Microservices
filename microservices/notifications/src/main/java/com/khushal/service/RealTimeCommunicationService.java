package com.khushal.service;

import com.khushal.payload.dto.NotificationDTO;

public interface RealTimeCommunicationService {
    void sendNotification(NotificationDTO notificationDTO);
}
