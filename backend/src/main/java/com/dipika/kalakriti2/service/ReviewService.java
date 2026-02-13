package com.dipika.kalakriti2.service;

import com.dipika.kalakriti2.dto.ReviewRequest;
import com.dipika.kalakriti2.dto.ReviewResponse;
import com.dipika.kalakriti2.entity.Order;
import com.dipika.kalakriti2.entity.OrderItem;
import com.dipika.kalakriti2.entity.Review;
import com.dipika.kalakriti2.entity.UserEntity;
import com.dipika.kalakriti2.repository.OrderRepository;
import com.dipika.kalakriti2.repository.ReviewRepository;
import com.dipika.kalakriti2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Create a new review
    public ReviewResponse createReview(Long userId, ReviewRequest request) {
        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Check if user has already reviewed this artwork
        Optional<Review> existingReview = reviewRepository.findByUserIdAndServiceId(userId, request.getServiceId());
        if (existingReview.isPresent()) {
            throw new IllegalArgumentException("You have already reviewed this artwork");
        }

        // Get user details
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if this is a verified purchase
        boolean isVerifiedPurchase = checkVerifiedPurchase(userId, request.getServiceId());

        // Create review
        Review review = new Review();
        review.setUserId(userId);
        review.setServiceId(request.getServiceId());
        review.setUserName(user.getName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewImage(request.getReviewImage());
        review.setVerifiedPurchase(isVerifiedPurchase);

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    // Get all reviews for an artwork
    public List<ReviewResponse> getReviewsByServiceId(Long serviceId) {
        List<Review> reviews = reviewRepository.findByServiceIdOrderByCreatedAtDesc(serviceId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get reviews by user
    public List<ReviewResponse> getReviewsByUserId(Long userId) {
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get review statistics for an artwork
    public Map<String, Object> getReviewStats(Long serviceId) {
        Map<String, Object> stats = new HashMap<>();
        
        Double avgRating = reviewRepository.getAverageRatingByServiceId(serviceId);
        Long totalReviews = reviewRepository.countByServiceId(serviceId);
        
        // Count reviews by rating
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            Long count = (long) reviewRepository.findByServiceIdAndRatingOrderByCreatedAtDesc(serviceId, i).size();
            ratingDistribution.put(i, count);
        }

        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        stats.put("totalReviews", totalReviews);
        stats.put("ratingDistribution", ratingDistribution);

        return stats;
    }

    // Mark review as helpful
    public ReviewResponse markHelpful(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        Review updatedReview = reviewRepository.save(review);
        
        return mapToResponse(updatedReview);
    }

    // Mark review as not helpful
    public ReviewResponse markNotHelpful(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        
        review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
        Review updatedReview = reviewRepository.save(review);
        
        return mapToResponse(updatedReview);
    }

    // Update a review
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Check if user owns this review
        if (!review.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only update your own reviews");
        }

        // Validate rating
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewImage(request.getReviewImage());

        Review updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }

    // Delete a review
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Check if user owns this review
        if (!review.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    // Check if user has purchased this artwork
    private boolean checkVerifiedPurchase(Long userId, Long serviceId) {
        List<Order> userOrders = orderRepository.findByUserId(userId);
        
        for (Order order : userOrders) {
            for (OrderItem item : order.getItems()) {
                if (item.getServiceId().equals(serviceId)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // Map Review entity to ReviewResponse DTO
    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getUserId(),
            review.getServiceId(),
            review.getUserName(),
            review.getRating(),
            review.getComment(),
            review.getReviewImage(),
            review.getVerifiedPurchase(),
            review.getHelpfulCount(),
            review.getNotHelpfulCount(),
            review.getCreatedAt()
        );
    }

    // Get all reviews (for admin)
    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
