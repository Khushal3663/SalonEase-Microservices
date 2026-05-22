package com.khushal.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable=false)
    private String reviewText;

    @Column(nullable=false)
    private double rating;

    @Column(nullable=false)
    private Long salonId;

    @Column(nullable=false)
    private Long userId;

    @CreatedDate
    private LocalDateTime createdAt;
}
