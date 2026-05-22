package com.khushal.messaging;

import com.khushal.model.Notification;
import com.khushal.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventConsumer {
    private final NotificationService notificationService;

    @RabbitListener(queues = "notification-queue")
    public void sendNotificationEvent(Notification notification) throws Exception {
        notificationService.createNotification(notification);
    }
}
