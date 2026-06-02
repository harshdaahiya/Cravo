import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { RootState } from '../../../store';
import { IRestaurant } from '../../../types/domain-models';

interface RestaurantCardSkeletonProps {
    width: string;
}

const RestaurantCardSkeleton: React.FC<RestaurantCardSkeletonProps> = ({ width }) => (
    <div
        className="flex animate-pulse flex-col overflow-hidden rounded-xl bg-background p-4 shadow-sm"
        style={{ width }}
    >
        {/* Image Placeholder */}
        <div className="relative h-34 rounded-lg bg-muted sm:h-36"></div>

        {/* Details Placeholder */}
        <div className="mt-4 flex flex-col">
            {/* Title */}
            <div className="mb-2 h-6 w-3/4 rounded-md bg-muted"></div>
            {/* Cuisine */}
            <div className="h-4 w-2/3 rounded-md bg-muted"></div>

            <div className="border-border mt-4 border-t pt-3">
                <div className="mb-1 flex items-center justify-between text-xs">
                    <div className="h-3 w-1/3 rounded-md bg-muted"></div>
                    <div className="h-3 w-1/4 rounded-md bg-muted"></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <div className="h-3 w-1/2 rounded-md bg-muted"></div>
                    <div className="h-3 w-1/4 rounded-md bg-muted"></div>
                </div>
            </div>
        </div>
    </div>
);

interface RestaurantCardProps {
    restaurant: IRestaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const imageUrl =
        restaurant.images?.[0] ||
        'https://placehold.co/400x240/f0f0f0/808080?text=Restaurant';
    return (
        <div className="mb-1 flex transform cursor-pointer flex-col overflow-hidden rounded-xl bg-background shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            {/* Restaurant Image */}
            <div className="sm:36 relative h-34 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x240/f0f0f0/808080?text=Restaurant';
                    }}
                />
                {restaurant.is_active && (
                    <div className="absolute top-2 left-2 rounded-full bg-success-foreground px-2 py-1 text-xs font-semibold text-white shadow-md">
                        Open
                    </div>
                )}
                <div 
                    className="bg-opacity-70 absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white"
                    aria-label={`Rating: ${restaurant.rating} stars`}
                >
                    <Icon name={'star'} size={12} fill="#FACC15" aria-hidden="true" />
                    <span>{restaurant.rating}</span>
                </div>
            </div>

            {/* Restaurant Details with Fixed Height */}
            <div className="flex flex-col px-3 py-1" style={{ minHeight: '160px' }}>
                <div>
                    <h3 className="text-foreground mb-1 truncate text-lg font-bold">
                        {restaurant.name}
                    </h3>

                    {/* Fixed-height container for cuisine type */}
                    <div className="text-text-secondary mb-2 h-9 overflow-hidden text-xs">
                        <p className="line-clamp-2">
                            {restaurant.cuisine_type.join(', ')}
                        </p>
                    </div>
                </div>

                <div className="border-border border-t pt-3">
                    <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1" aria-label={`Location: ${restaurant?.address?.cityDetails?.name || 'N/A'}`}>
                            <Icon name={'map-pin'} size={12} aria-hidden="true" />
                            <span className="truncate">
                                {restaurant?.address?.cityDetails?.name || 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1" aria-label={`Delivery time: ${restaurant.delivery_time_mins} minutes`}>
                            <Icon name={'clock'} size={12} aria-hidden="true" />
                            <span>{restaurant.delivery_time_mins} min</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary font-medium">
                            Min Order: ₹{restaurant.min_order_value}
                        </span>
                        <span className="text-muted-foreground">
                            ({restaurant.numberOfReviews} reviews)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RestaurantsSection: React.FC = () => {
    const itemsPerView = { mobile: 1, tablet: 2, desktop: 4 };
    const { data, isAppInitializing: isLoading, appInitError: error } = useSelector((state: RootState) => state.landingPage);
    const restaurantsData = data?.restaurants || [];

    // SSR-safe "items per view"
    const getItemsPerView = () => {
        if (typeof window === 'undefined') return itemsPerView.mobile;
        if (window.innerWidth >= 1024) return itemsPerView.desktop;
        if (window.innerWidth >= 640) return itemsPerView.tablet;
        return itemsPerView.mobile;
    };

    const [itemsToShow, setItemsToShow] = useState(getItemsPerView());
    const [index, setIndex] = useState(0);

    // Update on resize
    useEffect(() => {
        const update = () => setItemsToShow(getItemsPerView());
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    // Use useMemo to prevent re-computation on every render
    const maxIndex = useMemo(
        () => Math.max(0, restaurantsData.length - itemsToShow),
        [restaurantsData.length, itemsToShow]
    );

    // Keep index in range when viewport shrinks
    useEffect(() => {
        setIndex(i => Math.min(i, maxIndex));
    }, [itemsToShow, maxIndex]);

    const cardWidthPct = 100 / itemsToShow;
    const translatePct = -index * cardWidthPct;

    const renderContent = () => {
        if (isLoading) {
            // Render skeletons
            return [...Array(itemsToShow)].map((_, i) => (
                <div
                    key={`skeleton-${i}`}
                    className="flex-shrink-0 px-2 sm:px-3"
                    style={{ width: `${cardWidthPct}%` }}
                >
                    <RestaurantCardSkeleton width="100%" />
                </div>
            ));
        }

        if (error) {
            return (
                <p className="w-full text-center text-destructive">
                    Failed to load restaurants.
                </p>
            );
        }

        if (restaurantsData.length === 0) {
            return (
                <p className="text-muted-foreground w-full text-center">
                    No popular restaurants found.
                </p>
            );
        }

        return restaurantsData.map(restaurant => {
            const restaurant_slug = restaurant.name
                .toLowerCase()
                .replace(/\s+/g, '-');
            return (
                <Link
                    key={restaurant._id}
                    to={`/menu/${restaurant_slug}/${restaurant._id}`}
                    className="flex-shrink-0 px-2 sm:px-3"
                    style={{ width: `${cardWidthPct}%` }}
                >
                    <RestaurantCard restaurant={restaurant} />
                </Link>
            );
        });
    };

    return (
        <section className="py-5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                {/* header + arrows */}
                <div className="mt-15 mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-foreground text-xl font-bold">
                            Popular Restaurants
                        </h2>
                        <p className="text-text-secondary mt-1 text-sm">
                            Discover top-rated restaurants near you
                        </p>
                    </div>
                    {restaurantsData.length > itemsToShow && !isLoading && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIndex(i => Math.max(0, i - 1))}
                                disabled={index === 0}
                                aria-label="Scroll left popular restaurants"
                                className={`rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${index === 0
                                    ? 'border-border cursor-not-allowed text-muted-foreground'
                                    : 'text-text-secondary hover:border-border-focus border-border hover:text-primary-hover'
                                    }`}
                            >
                                <Icon name={'chevron-left'} size={18} aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => setIndex(i => Math.min(maxIndex, i + 1))}
                                disabled={index === maxIndex}
                                aria-label="Scroll right popular restaurants"
                                className={`rounded-full border p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${index === maxIndex
                                    ? 'border-border cursor-not-allowed text-muted-foreground'
                                    : 'text-text-secondary hover:border-border-focus border-border hover:text-primary-hover'
                                    }`}
                            >
                                <Icon name={'chevron-right'} size={18} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>

                {/* slider track */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(${translatePct}%)` }}
                    >
                        {renderContent()}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RestaurantsSection;
