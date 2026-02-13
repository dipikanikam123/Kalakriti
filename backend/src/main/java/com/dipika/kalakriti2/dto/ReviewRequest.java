package com.dipika.kalakriti2.dto;

public class ReviewRequest {
    private Long serviceId;
    private Integer rating;
    private String comment;
    private String reviewImage;

    public ReviewRequest() {}

    public ReviewRequest(Long serviceId, Integer rating, String comment, String reviewImage) {
        this.serviceId = serviceId;
        this.rating = rating;
        this.comment = comment;
        this.reviewImage = reviewImage;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getReviewImage() {
        return reviewImage;
    }

    public void setReviewImage(String reviewImage) {
        this.reviewImage = reviewImage;
    }
}
