import React, { useState } from 'react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ReviewForm = ({ serviceId, onReviewSubmitted, existingReview }) => {
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [reviewImage, setReviewImage] = useState(existingReview?.reviewImage || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setIsSubmitting(true);

        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                toast.error('Please login to submit a review');
                return;
            }

            const reviewData = {
                serviceId: parseInt(serviceId),
                rating,
                comment: comment.trim(),
                reviewImage: reviewImage.trim() || null
            };

            const response = await api.post('/reviews', reviewData, {
                headers: {
                    userId: userId
                }
            });

            toast.success('Review submitted successfully! ⭐');

            // Reset form
            setRating(0);
            setComment('');
            setReviewImage('');

            // Notify parent component
            if (onReviewSubmitted) {
                onReviewSubmitted(response.data);
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            const errorMessage = error.response?.data?.error || 'Failed to submit review';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Rating *
                    </label>
                    <StarRating rating={rating} onRatingChange={setRating} size="lg" />
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this artwork..."
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {comment.length}/1000 characters
                    </p>
                </div>

                {/* Optional Image URL */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Image URL (Optional)
                    </label>
                    <input
                        type="url"
                        value={reviewImage}
                        onChange={(e) => setReviewImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Add a photo to show how the artwork looks in your space
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1 active:scale-95'
                        } text-white`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
