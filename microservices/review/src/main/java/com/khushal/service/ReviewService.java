package com.khushal.service;

import com.khushal.model.Review;
import com.khushal.payload.dto.ReviewRequest;
import com.khushal.payload.dto.SalonDTO;
import com.khushal.payload.dto.UserDTO;

import java.util.List;

public interface ReviewService {

    Review createReview(ReviewRequest req, UserDTO userDTO, SalonDTO salonDTO);

    List<Review> getAllReviewsBySalonId(Long salonId);

    Review updateReview(ReviewRequest req, Long reviewId, Long userId) throws Exception;

    void deleteReview(Long reviewId, Long userId) throws Exception;

}
