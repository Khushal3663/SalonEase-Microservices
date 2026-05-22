package com.khushal.service.impl;

import com.khushal.payload.dto.NotificationDTO;
import com.khushal.service.RealTimeCommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RealTimeCommunicationServiceImpl implements RealTimeCommunicationService {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void sendNotification(NotificationDTO notificationDTO) {
        simpMessagingTemplate.convertAndSend("/notifications/user/"+ notificationDTO.getUserId(), notificationDTO);
        simpMessagingTemplate.convertAndSend("/notifications/salon/"+ notificationDTO.getSalonId(), notificationDTO);
    }
}
