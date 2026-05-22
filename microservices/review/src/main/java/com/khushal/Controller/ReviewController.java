package com.khushal.Controller;

import com.khushal.mapper.ReviewMapper;
import com.khushal.model.Review;
import com.khushal.payload.dto.*;
import com.khushal.service.ReviewService;
import com.khushal.service.client.SalonFeignClient;
import com.khushal.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserFeignClient userFeignClient;
    private final SalonFeignClient salonFeignClient;

    @PostMapping("/salon/{salonId}")
    public ResponseEntity<Review> createReview(
            @PathVariable Long salonId,
            @RequestBody ReviewRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        SalonDTO salon = salonFeignClient.getSalonById(salonId).getBody();

        Review review = reviewService.createReview(req, user, salon);

        return ResponseEntity.ok(review);
    }

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsBySalonId(
            @PathVariable Long salonId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {

        List<Review> reviews = reviewService.getAllReviewsBySalonId(salonId);

        List<ReviewDTO> reviewsDTOs = reviews.stream().map((review)-> {
            UserDTO user = null;
            try{
                user = userFeignClient.getUserById(review.getUserId()).getBody();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            return ReviewMapper.mapToReviewDTO(review, user);
        }).collect(Collectors.toList());
        return ResponseEntity.ok(reviewsDTOs);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest req,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        Review review = reviewService.updateReview(req, reviewId, user.getId());

        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        UserDTO user = userFeignClient.getUserProfile(jwt).getBody();
        reviewService.deleteReview(reviewId, user.getId());

        ApiResponse apiResonse = new ApiResponse();
        apiResonse.setMessage("Review deleted successfully");

        return ResponseEntity.ok(apiResonse);
    }
}
