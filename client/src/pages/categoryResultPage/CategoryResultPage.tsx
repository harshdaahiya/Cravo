import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/navbar/Navbar';
import {
    clearCategoryResults,
    fetchCategoryRestaurants,
} from '../../features/category-result';
import CategoryHeader from './sections/CategoryHeader';
import ExploreMore from './sections/ExploreMore';
import FilterAndSortBar from './sections/FilterAndSortBar';
import RestaurantList from './sections/RestaurantList';
import { RootState, AppDispatch } from '../../store';

const CategoryResultPage = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams] = useSearchParams();

    const locationData = useSelector((state: RootState) => state.location);
    const { city: cityName, lat: latitude, lon: longitude } = locationData;
    const {
        restaurants,
        isLoading: loading,
        error,
        currentPage,
        totalPages,
        totalResults,
        currentCategorySlug,
    } = useSelector((state: RootState) => state.categoryResult);

    const urlPage = parseInt(searchParams.get('page') || '1') || 1;

    const [selectedSortBy, setSelectedSortBy] = useState('relevance');
    const [selectedFilters, setSelectedFilters] = useState({
        rating: [],
        price: [],
        deliveryTime: [],
        offers: [],
    });
    const [quickFilters, setQuickFilters] = useState({
        tenMinDelivery: false,
        topRated: false,
        offers: false,
    });

    const navbarRef = useRef<HTMLDivElement>(null);
    const filterBarRef = useRef<HTMLDivElement>(null);
    const restaurantSectionRef = useRef<HTMLDivElement>(null);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isFilterBarSticky, setIsFilterBarSticky] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [navbarHeight, setNavbarHeight] = useState(0);

    // Hardcoded limit
    const limit = 50;

    // Logic to fetch restaurants when categorySlug or page changes
    useEffect(() => {
        const isNewCategory = currentCategorySlug !== categorySlug;

        if (!latitude || !longitude || !categorySlug) {
            return;
        }

        if (isNewCategory) {
            dispatch(clearCategoryResults());
        }

        // Fetching if: A) New category, OR B) 'Load More' (URL page > Redux page)
        // OR C) Initial load and no restaurants are present yet.
        const shouldFetch =
            isNewCategory || urlPage > currentPage || restaurants.length === 0;

        if (shouldFetch) {
            // Set the page to 1 for a new category, otherwise use the URL page (Load More)
            const pageToFetch = isNewCategory ? 1 : urlPage;

            dispatch(
                fetchCategoryRestaurants({
                    categorySlug,
                    cityName: cityName || undefined,
                    latitude,
                    longitude,
                    page: pageToFetch,
                    limit,
                })
            );
        }
    }, [
        categorySlug,
        urlPage,
        dispatch,
        currentCategorySlug,
        currentPage,
        latitude,
        longitude,
        cityName,
        restaurants.length
    ]);

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;

        if (nextPage <= totalPages && latitude && longitude && categorySlug) {
            dispatch(
                fetchCategoryRestaurants({
                    categorySlug,
                    cityName: cityName || undefined,
                    latitude,
                    longitude,
                    page: nextPage,
                    limit,
                })
            );
        }
    };

    useEffect(() => {
        // Get navbar height on mount
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            // Get restaurant section position
            const restaurantSection = restaurantSectionRef.current;
            const filterBar = filterBarRef.current;

            if (restaurantSection && filterBar) {
                const restaurantSectionTop = restaurantSection.offsetTop;
                const filterBarHeight = filterBar.offsetHeight;

                // Calculate when to hide navbar and make filter bar sticky
                const triggerPoint =
                    restaurantSectionTop - navbarHeight - filterBarHeight;

                // Hide navbar when scrolling down past trigger point
                if (currentScrollY > triggerPoint && scrollDirection === 'down') {
                    setIsNavbarVisible(false);
                    setIsFilterBarSticky(true);
                }
                // Show navbar when scrolling up or above trigger point
                else if (
                    currentScrollY <= triggerPoint ||
                    (scrollDirection === 'up' && currentScrollY < triggerPoint + 100)
                ) {
                    setIsNavbarVisible(true);
                    setIsFilterBarSticky(false);
                }
            }

            setLastScrollY(currentScrollY);
        };

        // Throttled scroll handler for better performance
        let ticking = false;
        const throttledScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScrollHandler, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', throttledScrollHandler);
        };
    }, [lastScrollY, navbarHeight]);

    // Initial loading state (show full screen loader only if no restaurants are loaded yet)
    if (loading && restaurants.length === 0) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
                <p className="text-text-secondary text-xl font-semibold">
                    Loading restaurants...
                </p>
            </div>
        );
    }

    // Initial error state (show full screen error only if no restaurants are loaded yet)
    if (error && restaurants.length === 0) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
                <p className="text-xl font-semibold text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans">
            <div
                ref={navbarRef}
                className={`fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${isNavbarVisible
                        ? 'translate-y-0 transform'
                        : '-translate-y-full transform'
                    }`}
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Navbar showSearch={true} currentPage="search" cartCount={2} />
            </div>

            <div className="pt-16">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                    <CategoryHeader
                        categoryName={categorySlug}
                        categoryDescription={`Showing restaurants for ${categorySlug}`}
                        restaurantCount={totalResults}
                        cityName={cityName}
                    />

                    <div
                        ref={filterBarRef}
                        className={`transition-all duration-100 ease-in ${isFilterBarSticky
                                ? 'fixed top-0 right-0 left-0 z-40 bg-white'
                                : 'relative bg-transparent'
                            }`}
                    >
                        <div
                            className={`${isFilterBarSticky ? 'mx-auto max-w-7xl px-4 sm:px-6' : ''}`}
                        >
                            <FilterAndSortBar
                                selectedSortBy={selectedSortBy}
                                setSelectedSortBy={setSelectedSortBy}
                                quickFilters={quickFilters}
                                setQuickFilters={setQuickFilters}
                                selectedFilters={selectedFilters as any}
                                setSelectedFilters={setSelectedFilters as any}
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-bold">Restaurant To Explore</h3>
                    <div
                        ref={restaurantSectionRef}
                        className={`transition-all duration-300 ease-in-out ${isFilterBarSticky ? 'pt-20' : 'pt-0'
                            }`}
                    >
                        {restaurants.length > 0 ? (
                            <RestaurantList restaurants={restaurants} isLoading={loading} />
                        ) : (
                            <p className="text-text-secondary mt-8 text-center text-lg">
                                No restaurants found for "{categorySlug}" in this area.
                            </p>
                        )}

                        {currentPage < totalPages && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="bg-primary hover:bg-primary-hover text-text-main rounded-xl px-6 py-3 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? 'Loading More...' : 'Load More'}
                                </button>
                            </div>
                        )}

                        {error && restaurants.length > 0 && (
                            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    <ExploreMore />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CategoryResultPage;
