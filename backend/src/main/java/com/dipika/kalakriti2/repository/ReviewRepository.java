package com.dipika.kalakriti2.repository;

import com.dipika.kalakriti2.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find all reviews for a specific artwork
    List<Review> findByServiceIdOrderByCreatedAtDesc(Long serviceId);

    // Find all reviews by a specific user
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Check if user has already reviewed this artwork
    Optional<Review> findByUserIdAndServiceId(Long userId, Long serviceId);

    // Get average rating for an artwork
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.serviceId = :serviceId")
    Double getAverageRatingByServiceId(Long serviceId);

    // Get review count for an artwork
    Long countByServiceId(Long serviceId);

    // Get reviews by rating for an artwork
    List<Review> findByServiceIdAndRatingOrderByCreatedAtDesc(Long serviceId, Integer rating);
}
