import { useState } from 'react';
import { useDispatch } from 'react-redux';

import axiosInstance, { setAuthHeader } from '../api/axiosInstance';
import { API } from '../config/api';
import { fetchAllAddresses } from '../features/address/addressSlice';
import { loginUser } from '../features/auth/authSlice';
import { getUserProfileData } from '../features/auth/authSlice';
import { fetchUserCart } from '../features/cart/cartSlice';
import { AllUserOrdersThunk } from '../features/orders/ordersSlice';
import {
  closeAuthRequireModal,
  closeAuthSidebar,
  openAuthRequireModal,
  setAuthMode,
} from '../features/ui/uiSlice';
import { fetchAllWishlists } from '../features/wishList/wishListSlice';

export const useAuthForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setShowPassword(false);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginResult = await dispatch(loginUser(formData)).unwrap();

      if (loginResult?.accessToken) {
        const token = loginResult.accessToken;
        setAuthHeader(token);
      }

      await Promise.all([
        dispatch(fetchAllWishlists()),
        dispatch(fetchUserCart()),
        dispatch(fetchAllAddresses()),
        dispatch(AllUserOrdersThunk()),
        dispatch(getUserProfileData()),
      ]);

      dispatch(closeAuthSidebar());

      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(API.AUTH.SIGNUP, formData, {
        withCredentials: true,
      });

      if (res.data?.success) {
        dispatch(setAuthMode('otp'));
        // dispatch(closeAuthSidebar());
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err) {
      console.error('Signup failed:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Signup failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAuthRequireModal = () => {
    dispatch(openAuthRequireModal());
  };

  const handleCloseAuthRequireModal = () => {
    dispatch(closeAuthRequireModal());
  };

  return {
    formData,
    showPassword,
    isLoading,
    handleInputChange,
    setShowPassword,
    resetForm,
    handleLogin,
    handleSignup,
    handleOpenAuthRequireModal,
    handleCloseAuthRequireModal,
  };
};
