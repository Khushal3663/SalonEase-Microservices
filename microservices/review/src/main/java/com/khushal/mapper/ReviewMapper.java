package com.khushal.mapper;

import com.khushal.model.Review;
import com.khushal.payload.dto.ReviewDTO;
import com.khushal.payload.dto.UserDTO;

public class ReviewMapper {
    public static ReviewDTO mapToReviewDTO(Review review, UserDTO user) {
        return ReviewDTO.builder()
                .id(review.getId())
                .user(user)
                .salonId(review.getSalonId())
                .reviewText(review.getReviewText())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
