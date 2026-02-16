import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/navbar/Navbar';
import AuthRequiredModal from '../../features/auth/components/AuthRequiredModal';
import { useAuthForm } from '../../features/auth';
import RestaurantCategoriesSlider from './sections/Category-Slider';
// Restaurant-Overview-Page sections import
import FiltersAndSerachBar from './sections/FiltersAndSerachBar';
import NearbyCuisineGrid from './sections/Near-restaurants-card';
import RestaurantGrid from './sections/RestRestaurant';
import TopRestaurants from './sections/TopRestaurants';
import { RootState } from '../../store';

const RestaurantsOverviewPage: React.FC = () => {
    const [showRestaurantNavbar, setShowRestaurantNavbar] = useState(false);
    const topRestaurantsRef = useRef<HTMLDivElement>(null);

    // auth require modal state extraction
    const { isOpen: isAuthRequireModalOpen } = useSelector(
        (state: RootState) => state.ui.auth.authRequiredModal
    );

    const { handleCloseAuthRequireModal } = useAuthForm();

    useEffect(() => {
        const handleScroll = () => {
            if (topRestaurantsRef.current) {
                const topRestaurantsElement = topRestaurantsRef.current;
                const rect = topRestaurantsElement.getBoundingClientRect();

                // Switch to RestaurantNavbar when TopRestaurants section reaches top
                if (rect.top <= -50) {
                    setShowRestaurantNavbar(true);
                } else {
                    setShowRestaurantNavbar(false);
                }
            }
        };

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledHandleScroll);

        // Checking initial position on mount
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, []);

    return (
        <>
            {/* Fixed navbar container with smooth transition */}
            <div className="fixed top-0 right-0 left-0 z-50">
                {/* Main Navbar with fade transition */}
                <div
                    className={`transition-opacity duration-300 ${showRestaurantNavbar
                            ? 'pointer-events-none absolute opacity-0'
                            : 'opacity-100'
                        }`}
                >
                    <Navbar />
                </div>

                {/* Filters And Serach Bar with fade transition */}
                <div
                    className={`transition-opacity duration-200 ${showRestaurantNavbar
                            ? 'opacity-100'
                            : 'pointer-events-none absolute opacity-0'
                        }`}
                >
                    <FiltersAndSerachBar />
                </div>
            </div>

            {/* Main content with top padding to account for fixed navbar */}
            <div className="pt-20">
                <RestaurantCategoriesSlider />

                <div>
                    <TopRestaurants />
                </div>

                {/* Tracking this section's position to trigger navbar switch */}
                <div className="" ref={topRestaurantsRef}>
                    <RestaurantGrid />
                </div>

                <NearbyCuisineGrid />
                <Footer />
            </div>

            {/* showing the auth mess to the user if he is trying to use wishlist feature without log in  */}
            <AuthRequiredModal
                isOpen={isAuthRequireModalOpen}
                onClose={() => handleCloseAuthRequireModal()}
                title="Login to Save Favorites"
                message="Please log in to add restaurants to your wishlist. Create an account to save your favorite restaurants and never lose them!"
                action="Once logged in, you can access your wishlist anytime and get personalized recommendations."
            />
        </>
    );
};

export default RestaurantsOverviewPage;
