import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import axiosInstance from '../../../lib/axios-instance';
import RestaurantCard from '../../../components/shared/RestaurantCard';
import RestaurantSkeletonCard from '../../../components/shared/RestaurantCardSkeleton';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { RootState } from '../../../store';
import { IRestaurant } from '../../../types/domain-models';

const RestaurantGrid: React.FC = () => {
    // --- Redux Location State (Single Source of Truth) ---
    const { city, lat: latitude, lon: longitude } = useSelector((state: RootState) => state.location);

    // --- Local State (Grid Data) ---
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Pagination State ---
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 6;

    // --- Intersection Observer Setup ---
    const observer = useRef<IntersectionObserver | null>(null);
    const lastRestaurantElementRef = useCallback(
        (node: HTMLElement | null) => {
            // Only observe if we are NOT loading AND there is potentially more data
            if (isLoading || !hasMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting && hasMore) {
                        setPage(prevPage => prevPage + 1);
                    }
                },
                {
                    rootMargin: '200px',
                }
            );

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );

    // --- Data Fetching Logic ---
    const fetchRestaurants = useCallback(
        async (pageNum: number) => {
            setError(null);
            // ⚠️ CRITICAL: Only set the loading state to true here ⚠️
            // This is because the initial load (page 1) needs loading, and subsequent loads need it.
            setIsLoading(true);

            const queryParams = new URLSearchParams();
            let locationValid = false;
            if (city) {
                queryParams.append('cityName', city);
                locationValid = true;
            } else if (latitude && longitude) {
                queryParams.append('latitude', String(latitude));
                queryParams.append('longitude', String(longitude));
                locationValid = true;
            }

            if (!locationValid) {
                console.log('No valid location data found to fetch restaurants.');
                // If no valid location, ensure state is clean and stop loading
                if (pageNum === 1) setRestaurants([]);
                setIsLoading(false);
                return;
            }

            queryParams.append('limit', String(limit));
            queryParams.append('page', String(pageNum));

            try {
                const apiUrl = `${API_ENDPOINTS.RESTAURANTS.RESTAURANTS_LIST}?${queryParams.toString()}`;
                const response = await axiosInstance.get(apiUrl);

                const newRestaurants = response.data.data.restaurants || [];
                const totalPages = parseInt(response.data.data.totalPages, 10);

                // Update state with new data
                setRestaurants(prevRestaurants => {
                    if (pageNum === 1) {
                        return newRestaurants; // Start fresh on page 1
                    }
                    return [...prevRestaurants, ...newRestaurants]; // Append on subsequent pages
                });

                // Update hasMore flag
                setHasMore(pageNum < totalPages);
            } catch (err: any) {
                console.error('Error fetching restaurants:', err);
                setError(err.message || 'An unknown error occurred.');
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        },
        [city, latitude, longitude]
    );

    // --- Main Effect: Triggered by Location Change or Page Increment ---
    useEffect(() => {
        if (city || (latitude && longitude)) {
            // When location changes, force a reset to page 1
            if (page === 1) {
                fetchRestaurants(1);
            } else {
                // Intersection Observer triggered page change
                fetchRestaurants(page);
            }
        } else {
            setIsLoading(false);
            setRestaurants([]);
        }
    }, [city, latitude, longitude, page, fetchRestaurants]);

    // --- Error/Empty States ---
    if (error && restaurants.length === 0) {
        return (
            <section className="py-6 text-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </section>
        );
    }
    if (restaurants.length === 0 && !isLoading) {
        return (
            <section className="py-6 text-center">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <p className="text-text-muted">
                        No restaurants found in {city || 'your area'}.
                    </p>
                </div>
            </section>
        );
    }
    // --- Initial Loading State (Before any data is loaded) ---
    // If no restaurants are loaded yet AND we are loading (page 1 fetch)
    if (isLoading && restaurants.length === 0) {
        return (
            <section className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <h2 className="text-text-main mb-8 text-xl font-bold">
                        Loading Restaurants...
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Show 8 skeletons for a good first-load experience */}
                        {Array.from({ length: 8 }).map((_, index) => (
                            <RestaurantSkeletonCard key={`initial-skel-${index}`} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // --- Main Render ---
    return (
        <section className="">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <h2 className="text-text-main mb-8 text-xl font-bold">
                    Restaurants with online delivery in {city}
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Render all fetched restaurants */}
                    {restaurants.map((r, index) => {
                        const restaurant_slug = r.name.toLowerCase().replace(/\s+/g, '-');

                        // Attach ref to the last element if we still expect more data
                        const isLastElement = restaurants.length === index + 1;

                        return (
                            <Link
                                key={r._id || index}
                                ref={isLastElement ? (lastRestaurantElementRef as any) : null}
                                to={`/menu/${restaurant_slug}/${r._id}`}
                                className="flex-shrink-0 px-2 sm:px-3"
                            >
                                <RestaurantCard data={r} />
                            </Link>
                        );
                    })}

                    {/* ⚡️ INFINITE SCROLL SKELETONS ⚡️ */}
                    {isLoading && restaurants.length > 0 && (
                        // Show skeletons while loading the next page
                        <>
                            {Array.from({ length: limit }).map((_, index) => (
                                <RestaurantSkeletonCard key={`scroll-skel-${index}`} />
                            ))}
                        </>
                    )}
                </div>

                {/* End of List Message */}
                {!hasMore && restaurants.length > 0 && (
                    <div className="py-8 text-center">
                        <p className="text-text-muted">
                            You've reached the end of the list. ✨
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default RestaurantGrid;
