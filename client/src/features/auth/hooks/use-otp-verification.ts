import { useEffect, useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { setAuthState } from '../store/auth-slice';
import { AppDispatch } from '../../../store';
import { ApiResponse } from '../../../types/api-responses';
import { AuthResponse } from '../types/auth-types';

export const useOTPVerification = (email: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const resetOTP = () => {
    setOtp('');
    setError(null);
    setResendCooldown(60);
  };

  const verifyOTP = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        {
          email,
          otp,
        }
      );

      if (res.data.success) {
        const { user, accessToken } = res.data.data;
        dispatch(
          setAuthState({
            user,
            token: accessToken,
            role: user.role,
          })
        );
        return { success: true };
      } else {
        const msg = res.data.message || 'OTP verification failed';
        setError(msg);
        return { success: false, error: msg };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
      setResendCooldown(60);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsResending(false);
    }
  };

  return {
    otp,
    setOtp,
    isLoading,
    error,
    resendCooldown,
    isResending,
    verifyOTP,
    resendOTP,
    resetOTP,
  };
};
