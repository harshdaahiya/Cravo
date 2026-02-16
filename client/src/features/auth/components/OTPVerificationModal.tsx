import React, { useEffect, useState, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { setAuthState } from '../store/auth-slice';
import { closeAuthSidebar } from '../../ui/store/ui-slice';
import { AppDispatch } from '../../../store';
import { ApiResponse } from '../../../types/api-responses';
import { AuthResponse } from '../types/auth-types';

interface OTPVerificationModalProps {
    isOpen: boolean;
    email: string;
    onVerificationSuccess: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
    isOpen,
    email,
    onVerificationSuccess
}) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleVerifyOTP = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
                API_ENDPOINTS.AUTH.VERIFY_OTP,
                { email, otp }
            );
            if (res.data.success) {
                const { user, accessToken } = res.data.data;

                dispatch(
                    setAuthState({ user: user, token: accessToken, role: user.role })
                );
                onVerificationSuccess();
            } else {
                setError(
                    res.data.message || 'OTP verification failed. Please try again.'
                );
            }
        } catch (err: any) {
            console.error('OTP verification failed:', err);
            setError(
                err.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0 || isResending) return;
        setIsResending(true);
        setError(null);
        try {
            await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
            setResendCooldown(60);
        } catch (err: any) {
            console.error('Resend OTP failed:', err);
            setError(
                err.response?.data?.message || 'Failed to resend OTP. Please try again.'
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-opacity-50 fixed inset-0 z-[100] flex items-center justify-center bg-black"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: -50 }}
                        transition={{ duration: 0.3 }}
                        className="relative mx-4 w-full max-w-sm rounded-xl bg-white p-8 shadow-2xl"
                    >
                        <button
                            onClick={() => dispatch(closeAuthSidebar())}
                            className="hover:text-text-main absolute top-4 right-4 text-3xl text-gray-400 transition-colors cursor-pointer"
                        >
                            &times;
                        </button>
                        <h2 className="text-text-main mb-2 text-center text-2xl font-bold">
                            Verify Your Email
                        </h2>
                        <p className="text-text-muted mb-6 text-center">
                            A 6-digit code has been sent to <span className="font-bold">{email}</span>.
                        </p>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <input
                                type="text"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                                maxLength={6}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-xl tracking-widest placeholder-gray-400 transition-all focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            />

                            {error && (
                                <p className="text-center text-sm text-red-500">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary-hover w-full rounded-xl py-3 font-semibold text-white shadow-lg transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm">
                            <p className="text-text-muted">
                                Didn't receive the code?
                                <button
                                    onClick={handleResendOTP}
                                    disabled={resendCooldown > 0 || isResending}
                                    className="ml-1 font-semibold text-yellow-600 hover:underline disabled:text-gray-400 disabled:no-underline cursor-pointer"
                                >
                                    {isResending
                                        ? 'Sending...'
                                        : `Resend OTP${resendCooldown > 0 ? ` (${resendCooldown}s)` : ''}`}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OTPVerificationModal;
