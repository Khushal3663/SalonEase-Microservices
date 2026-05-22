package com.khushal.repository;

import com.khushal.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>
{
    List<Notification> findByUserId(Long userId);
    List<Notification> findBySalonId(Long salonId);
}
