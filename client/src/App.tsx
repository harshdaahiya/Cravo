import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import DeliveryLoader from './components/ui/DeliveryLoader';
import NotFound from './components/shared/NotFound';
import PrivateRoute from './components/shared/PrivateRoute';
import ProfileLayout from './components/layout/ProfileLayout';
import UnauthorizedPage from './components/shared/UnauthorizedPage';

import { AuthSidebar, getUserProfileData } from './features/auth';
import { WishlistModal, fetchAllWishlists } from './features/wishlist';
import { fetchAllAddresses } from './features/address';
import { fetchUserCart } from './features/cart';
import { initializeApplication } from './features/landing';
import { AllUserOrdersThunk } from './features/orders';
import { RootState, AppDispatch } from './store';

// pages import
import RestaurantMenuPage from './pages/Restaurant-Details/RestaurantMenu';
import AdminPage from './pages/adminPage/AdminPage.tsx';
import CartPage from './pages/cartPage/CartPage';
import CategoryResultPage from './pages/categoryResultPage/CategoryResultPage';
import CorporatePage from './pages/corporatePage/CorporatePage';
import DineoutRestaurantPage from './pages/dineoutRestaurantsPage/DineOutRestaurantPage';
import CravoGetTheAPP from './pages/getTheApp/GetTheAppPage';
import LandingPage from './pages/landingPage/LandingPage';
import OffersPage from './pages/offersPage/OffersPage';
import AccountPage from './pages/profilePage/Account/AccountPage';
import AddressPage from './pages/profilePage/Address/Address';
import HelpSupport from './pages/profilePage/HelpSupport';
import Payments from './pages/profilePage/Payments';
import Settings from './pages/profilePage/Settings';
import FavoritesPage from './pages/profilePage/favorites/FavoritesPage';
import Orders from './pages/profilePage/orders/Orders';
import RestaurantsOverviewPage from './pages/restaurant-Overview-Page/RestaurantsOverviewPage';

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="restaurants" element={<RestaurantsOverviewPage />} />
      <Route path="restaurants/dine-out" element={<DineoutRestaurantPage />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="categories/:categorySlug" element={<CategoryResultPage />} />
      <Route
        path="menu/:restaurantName/:restaurantID"
        element={<RestaurantMenuPage />}
      />
      <Route path="offers" element={<OffersPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="corporate" element={<CorporatePage />} />
      <Route path="unauthorized" element={<UnauthorizedPage />} />
      <Route path="get-the-app" element={<CravoGetTheAPP />} />
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="payments" element={<Payments />} />
          <Route path="addresses" element={<AddressPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help-support" element={<HelpSupport />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasAppInitializedRef = useRef(false);
  const { appInitError, isAppInitializing } = useSelector((state: RootState) => state.landingPage);
  const { isAuthSidebarOpen } = useSelector((state: RootState) => state.ui.auth);
  const { isWishlistModalOpen } = useSelector((state: RootState) => state.ui.wishlist);
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!hasAppInitializedRef.current) {
      console.log('Cravo : Dispatching initializeApplication on initial mount.');
      dispatch(initializeApplication());
      hasAppInitializedRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      const fetches = [
        dispatch(fetchAllWishlists()),
        dispatch(fetchUserCart()),
        dispatch(fetchAllAddresses()),
        dispatch(AllUserOrdersThunk()),
        dispatch(getUserProfileData()),
      ];

      Promise.all(fetches)
        .then(() => {
          console.log('All initial data fetched successfully!');
        })
        .catch(error => {
          console.error('Failed to fetch some initial data:', error);
        });
    }
  }, [isAuthenticated, dispatch, isInitialized]);

  if (appInitError) {
    return (
      <div className="error-container p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{appInitError}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary px-6 py-2 rounded-lg font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <AppContent />
      {isAppInitializing && <DeliveryLoader />}
      {isAuthSidebarOpen && <AuthSidebar />}
      {isWishlistModalOpen && <WishlistModal />}
    </>
  );
}

export default App;
