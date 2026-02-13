import React, { useState } from 'react';
import StarRating from './StarRating';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ReviewList = ({ reviews, onReviewUpdate }) => {
    const [votingStates, setVotingStates] = useState({});

    const handleHelpful = async (reviewId) => {
        if (votingStates[reviewId]) return; // Prevent double voting

        try {
            setVotingStates(prev => ({ ...prev, [reviewId]: true }));
            const response = await api.post(`/reviews/${reviewId}/helpful`);

            if (onReviewUpdate) {
                onReviewUpdate(response.data);
            }

            toast.success('Thank you for your feedback!');
        } catch (error) {
            console.error('Error marking review as helpful:', error);
            toast.error('Failed to submit feedback');
            setVotingStates(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    const handleNotHelpful = async (reviewId) => {
        if (votingStates[reviewId]) return; // Prevent double voting

        try {
            setVotingStates(prev => ({ ...prev, [reviewId]: true }));
            const response = await api.post(`/reviews/${reviewId}/not-helpful`);

            if (onReviewUpdate) {
                onReviewUpdate(response.data);
            }

            toast.success('Thank you for your feedback!');
        } catch (error) {
            console.error('Error marking review as not helpful:', error);
            toast.error('Failed to submit feedback');
            setVotingStates(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this artwork!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {/* User Avatar */}
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {review.userName?.charAt(0).toUpperCase() || 'U'}
                            </div>

                            {/* User Info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-gray-900">{review.userName}</h4>
                                    {review.verifiedPurchase && (
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified Purchase
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                            </div>
                        </div>

                        {/* Rating */}
                        <StarRating rating={review.rating} readonly size="sm" />
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                    {/* Review Image */}
                    {review.reviewImage && (
                        <div className="mb-4">
                            <img
                                src={review.reviewImage}
                                alt="Review"
                                className="rounded-xl max-h-64 object-cover border border-gray-200"
                                onError={(e) => e.target.style.display = 'none'}
                            />
                        </div>
                    )}

                    {/* Helpful Buttons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-600 font-medium">Was this helpful?</span>
                        <button
                            onClick={() => handleHelpful(review.id)}
                            disabled={votingStates[review.id]}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${votingStates[review.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-600'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            <span className="text-sm font-medium">Yes ({review.helpfulCount || 0})</span>
                        </button>
                        <button
                            onClick={() => handleNotHelpful(review.id)}
                            disabled={votingStates[review.id]}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${votingStates[review.id]
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            <span className="text-sm font-medium">No ({review.notHelpfulCount || 0})</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
