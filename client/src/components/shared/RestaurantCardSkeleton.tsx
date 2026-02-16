import React from 'react';

const RestaurantCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-36 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="px-4 py-3 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>

                {/* Cuisines */}
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>

                {/* Rating and Reviews */}
                <div className="flex gap-4">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Footer */}
                <div className="flex justify-between pt-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>

                {/* Address */}
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
};

export default RestaurantCardSkeleton;
