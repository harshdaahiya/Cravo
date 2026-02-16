import { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance, { setAuthHeader } from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { fetchAllAddresses } from '../../address/store/address-slice';
import { AllUserOrdersThunk } from '../../orders';
import { loginUser, getUserProfileData } from '../store/auth-slice';
import { fetchUserCart } from '../../cart/store/cart-slice';
import {
  closeAuthRequiredModal,
  closeAuthSidebar,
  openAuthRequiredModal,
  setAuthMode,
} from '../../ui/store/ui-slice';
import { fetchAllWishlists } from '../../wishlist/store/wishlist-slice';
import { AppDispatch } from '../../../store';

export const useAuthForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setShowPassword(false);
  };

  const handleLogin = async (e: FormEvent) => {
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
    } catch (err: any) {
      console.error('Login failed:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, formData, {
        withCredentials: true,
      });

      if (res.data?.success) {
        dispatch(setAuthMode('otp'));
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch (err: any) {
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
    dispatch(openAuthRequiredModal({ actionType: 'auth_required' }));
  };

  const handleCloseAuthRequireModal = () => {
    dispatch(closeAuthRequiredModal());
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
