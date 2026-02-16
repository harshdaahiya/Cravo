import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { cartReducer } from '../features/cart';
import { ordersReducer } from '../features/orders';
import { addressReducer } from '../features/address';
import { locationReducer } from '../features/location';
import { wishlistReducer } from '../features/wishlist';
import { landingReducer } from '../features/landing';
import { restaurantMenuReducer } from '../features/restaurant-menu';
import { categoryResultReducer } from '../features/category-result';
import { searchContextReducer } from '../features/search-context';
import { uiReducer } from '../features/ui';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    landingPage: landingReducer,
    location: locationReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    address: addressReducer,
    categoryResult: categoryResultReducer,
    restaurantMenu: restaurantMenuReducer,
    searchContext: searchContextReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/openAuthRequiredModal'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.onSuccess'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.auth.authRequiredModal.onSuccess'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
