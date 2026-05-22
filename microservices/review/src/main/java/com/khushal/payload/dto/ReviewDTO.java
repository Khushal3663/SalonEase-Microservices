package com.khushal.payload.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder(toBuilder = true)
public record ReviewDTO(
        Long id,
    String reviewText,
        double rating,
        Long salonId,
        UserDTO user,
        LocalDateTime createdAt
) {

}
