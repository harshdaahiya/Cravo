import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchRestaurantMenu } from '../store/restaurant-menu-slice';
// @ts-ignore - Will migrate this later
import { useToastStack } from '../../ui/hooks/use-stack-toasts';

/**
 * A custom hook to manage fetching and accessing the data for a specific restaurant's menu
 * from the Redux store. It handles the initial fetch, loading/error states, and utilizes
 * the caching logic implemented in the Redux thunk.
 * @param {string} restaurantID - The ID of the restaurant to fetch.
 */
export const useRestaurantMenu = (restaurantID: string) => {
    const dispatch = useDispatch<AppDispatch>();
    const { showStackedToast } = useToastStack();

    const restaurantState = useSelector(
        (state: RootState) => state.restaurantMenu.menus[restaurantID] || {}
    );

    const {
        restaurant = null,
        products = [],
        loading = 'idle',
        error = null,
    } = restaurantState;

    // 2. Memoized function to handle the fetch operation
    const handleFetchRestaurantMenu = useCallback(
        (forceRefresh = false) => {
            // Skip if already pending AND not forcing a refresh
            if (loading === 'pending' && !forceRefresh) {
                return;
            }

            dispatch(fetchRestaurantMenu(restaurantID))
                .unwrap()
                .catch(e => {
                    // Error case (API failed OR cache hit)
                    if (e && !e.isCacheHit) {
                        // Only show toast if it was a genuine API failure
                        console.error(
                            `[Menu Fetch Error] Restaurant ID ${restaurantID}:`,
                            e
                        );
                    }
                });
        },
        [dispatch, restaurantID, loading]
    );

    // 3. Effect to automatically trigger the fetch when the component mounts or ID changes
    useEffect(() => {
        // Check if we already have successfully fetched data for this ID
        const hasCachedData = loading === 'succeeded' && products.length > 0;

        if (restaurantID && !hasCachedData) {
            // Only dispatch the action if we don't already have the data
            handleFetchRestaurantMenu();
        }
    }, [restaurantID, handleFetchRestaurantMenu, loading, products.length]);

    return {
        restaurant,
        menuItems: products,
        loading,
        error,
        // Expose the function for manual refresh
        refetchMenu: () => handleFetchRestaurantMenu(true),

        // isInitialLoading is true if we are waiting for the FIRST successful response.
        // Once successful, it should be false, even if loading becomes 'pending' for a refetch.
        isInitialLoading: loading === 'idle' || loading === 'pending',
        isError: loading === 'failed',
    };
};
