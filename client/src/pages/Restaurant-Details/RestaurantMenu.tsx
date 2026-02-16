import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Footer from '../../components/layout/Footer';
import Navbar from '../../components/layout/navbar/Navbar';
import AuthRequiredModal from '../../features/auth/components/AuthRequiredModal';
import { useAuthForm } from '../../features/auth';
import { useRestaurantMenu } from '../../features/restaurant-menu';
import CartStatusSection from './sections/CartStatusSection';
import DealsSection from './sections/DealsSections';
import MenuFilters from './sections/MenuFilters';
import ProductList from './sections/ProductList';
// Importing the sections of this page
import RestaurantHeader from './sections/RestaurantHeader';
import { RootState } from '../../store';

const RestaurantMenuPage: React.FC = () => {
    const { restaurantID } = useParams<{ restaurantID: string }>();

    const { isOpen: isAuthRequireModalOpen } = useSelector(
        (state: RootState) => state.ui.auth.authRequiredModal
    );

    const { handleCloseAuthRequireModal } = useAuthForm();

    const {
        restaurant,
        menuItems,
        isInitialLoading,
        isError,
        error,
        refetchMenu,
    } = useRestaurantMenu(restaurantID || '');

    // Local state for UI filter (should remain local)
    const [activeFilter, setActiveFilter] = useState('All');

    const topRestaurantsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (topRestaurantsRef.current) {
                const topRestaurantsElement = topRestaurantsRef.current;
                const rect = topRestaurantsElement.getBoundingClientRect();

                // Switch navbar when TopRestaurants section reaches the top of viewport
                // The value 100 is likely compensating for the Navbar height
                if (rect.top <= 100) {
                    // You could set a state here to show a sticky secondary navbar if needed
                } else {
                    // Reset state
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

        // Add scroll event listener
        window.addEventListener('scroll', throttledHandleScroll);

        // Check initial position
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, []);

    // 2. Modify Loading State Check
    if (isInitialLoading) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
                <p className="text-text-secondary text-xl font-semibold">
                    Loading restaurant menu...
                </p>
            </div>
        );
    }

    // 3. Modify Error State Check
    if (isError || !restaurant) {
        return (
            <div className="bg-bg-subtle flex min-h-screen flex-col items-center justify-center px-4">
                <p className="text-center text-xl font-semibold text-red-500">
                    {error || 'Restaurant not found.'}
                </p>
                <button
                    onClick={refetchMenu}
                    className="bg-primary text-text-main hover:bg-primary-hover mt-4 rounded-full px-4 py-2 font-semibold transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="bg-bg-subtle font-helvetica min-h-screen">
                <Navbar showSearch={true} currentPage="restaurant" cartCount={2} />
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                    <RestaurantHeader restaurant={restaurant} />
                    <DealsSection />
                    <MenuFilters
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                    />
                    <ProductList menuItems={menuItems} activeFilter={activeFilter} />
                </div>
                <CartStatusSection />
                <Footer />
            </div>

            <AuthRequiredModal
                isOpen={isAuthRequireModalOpen}
                onClose={() => handleCloseAuthRequireModal()}
                title="Login to Save Favorites"
                message="Please log in to add products to your wishlist. Create an account to save your favorite products and never lose them!"
                action="Once logged in, you can access your wishlist anytime and get personalized recommendations."
            />
        </>
    );
};

export default RestaurantMenuPage;
