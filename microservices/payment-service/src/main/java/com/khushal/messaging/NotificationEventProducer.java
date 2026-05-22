package com.khushal.messaging;

import com.khushal.payload.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventProducer {
    private final RabbitTemplate rabbitTemplate;

    public void sendNotificationEvent(Long bookingId, Long userid, Long salonId){
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setBookingId(bookingId);
        notificationDTO.setUserId(userid);
        notificationDTO.setSalonId(salonId);
        notificationDTO.setDescription("New booking got confirmed");
        notificationDTO.setType("Booking");

        rabbitTemplate.convertAndSend("notification-queue", notificationDTO);
    }
}
