import React from 'react';
import StarRating from './StarRating';

const ReviewStats = ({ stats }) => {
    if (!stats) return null;

    const { averageRating, totalReviews, ratingDistribution } = stats;

    const getPercentage = (count) => {
        if (!totalReviews || totalReviews === 0) return 0;
        return Math.round((count / totalReviews) * 100);
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>

            {/* Overall Rating */}
            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-gray-200">
                <div className="text-center">
                    <div className="text-6xl font-black text-purple-600 mb-2">
                        {averageRating ? averageRating.toFixed(1) : '0.0'}
                    </div>
                    <StarRating rating={Math.round(averageRating || 0)} readonly size="md" />
                    <p className="text-gray-600 mt-2 font-medium">
                        Based on {totalReviews || 0} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingDistribution?.[star] || 0;
                        const percentage = getPercentage(count);

                        return (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-12">
                                    {star} star
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-600 w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rating Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="text-3xl font-bold text-purple-600">
                        {ratingDistribution?.[5] || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">5 Star</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="text-3xl font-bold text-purple-600">
                        {ratingDistribution?.[4] || 0}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">4 Star</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <div className="text-3xl font-bold text-purple-600">
                        {((ratingDistribution?.[3] || 0) + (ratingDistribution?.[2] || 0) + (ratingDistribution?.[1] || 0))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">3 Star & Below</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewStats;
