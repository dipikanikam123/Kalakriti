package com.dipika.kalakriti2.controller;

import com.dipika.kalakriti2.dto.ReviewRequest;
import com.dipika.kalakriti2.dto.ReviewResponse;
import com.dipika.kalakriti2.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Create a new review
    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestHeader("userId") Long userId,
            @RequestBody ReviewRequest request) {
        try {
            ReviewResponse review = reviewService.createReview(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create review: " + e.getMessage()));
        }
    }

    // Get all reviews for a specific artwork
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByServiceId(@PathVariable Long serviceId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByServiceId(serviceId);
        return ResponseEntity.ok(reviews);
    }

    // Get all reviews by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUserId(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    // Get review statistics for an artwork
    @GetMapping("/service/{serviceId}/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@PathVariable Long serviceId) {
        Map<String, Object> stats = reviewService.getReviewStats(serviceId);
        return ResponseEntity.ok(stats);
    }

    // Mark review as helpful
    @PostMapping("/{reviewId}/helpful")
    public ResponseEntity<?> markHelpful(@PathVariable Long reviewId) {
        try {
            ReviewResponse review = reviewService.markHelpful(reviewId);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Mark review as not helpful
    @PostMapping("/{reviewId}/not-helpful")
    public ResponseEntity<?> markNotHelpful(@PathVariable Long reviewId) {
        try {
            ReviewResponse review = reviewService.markNotHelpful(reviewId);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update a review
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @RequestHeader("userId") Long userId,
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest request) {
        try {
            ReviewResponse review = reviewService.updateReview(userId, reviewId, request);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @RequestHeader("userId") Long userId,
            @PathVariable Long reviewId) {
        try {
            reviewService.deleteReview(userId, reviewId);
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get all reviews (for admin)
    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
}
