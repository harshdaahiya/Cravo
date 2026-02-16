import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { setAuthState } from '../store/auth-slice';
import { closeAuthSidebar, setAuthMode } from '../../ui/store/ui-slice';
import { useAuthForm } from '../hooks/use-auth-form';
import { useOTPVerification } from '../hooks/use-otp-verification';
import Icon from '../../../components/ui/Icon';
import LoginForm from './LoginForm';
import OTPVerificationForm from './OTPVerificationForm';
import SignupForm from './SignupForm';
import { RootState, AppDispatch } from '../../../store';

const AuthSidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { isAuthSidebarOpen: isOpen, mode } = useSelector(
        (state: RootState) => state.ui.auth
    );
    const { error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!isOpen) return;

        const handleOAuthMessage = (event: MessageEvent) => {
            const getServerOrigin = (apiUrl: string | undefined) => {
                if (!apiUrl) return '';
                try {
                    const url = new URL(apiUrl);
                    return url.origin;
                } catch {
                    return apiUrl.replace(/\/api.*$/, '').replace(/\/$/, '');
                }
            };

            const allowedOrigins = [
                import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173',
                import.meta.env.VITE_SERVER_ORIGIN ||
                getServerOrigin(import.meta.env.VITE_API_URL) ||
                'http://localhost:8000',
            ];

            if (!allowedOrigins.includes(event.origin)) {
                console.warn('🚨 Unauthorized OAuth message origin:', event.origin);
                return;
            }

            if (event.data?.type !== 'authComplete' || !event.data?.success) {
                return;
            }

            const { user, accessToken } = event.data.data || {};
            if (!user || !accessToken) {
                console.error('❌ Invalid OAuth data received');
                return;
            }

            dispatch(
                setAuthState({
                    user,
                    token: accessToken,
                    role: user.role,
                })
            );

            dispatch(closeAuthSidebar());
            navigate('/restaurants');
        };

        window.addEventListener('message', handleOAuthMessage);

        return () => {
            window.removeEventListener('message', handleOAuthMessage);
        };
    }, [isOpen, dispatch, navigate]);

    const authForm = useAuthForm();
    const otpVerification = useOTPVerification(authForm.formData.email);

    const handleClose = () => {
        dispatch(closeAuthSidebar());
        authForm.resetForm();
        otpVerification.resetOTP();
    };

    const handleGoogleLogin = () => {
        const currentOrigin = window.location.origin;
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
            `${import.meta.env.VITE_API_URL}/auth/google?origin=${encodeURIComponent(currentOrigin)}`,
            'google-login',
            `width=${width},height=${height},left=${left},top=${top}`
        );
    };

    const renderFormContent = () => {
        switch (mode) {
            case 'otp':
                return (
                    <OTPVerificationForm
                        email={authForm.formData.email}
                        otpVerification={otpVerification}
                        onSuccess={() => dispatch(closeAuthSidebar())}
                    />
                );

            case 'signup':
                return (
                    <SignupForm
                        formData={authForm.formData}
                        onChange={authForm.handleInputChange}
                        onSubmit={authForm.handleSignup}
                        isLoading={authForm.isLoading}
                        error={error}
                        onGoogleLogin={handleGoogleLogin}
                        onSwitchMode={() => dispatch(setAuthMode('login'))}
                    />
                );

            case 'login':
            default:
                return (
                    <LoginForm
                        formData={authForm.formData}
                        onChange={authForm.handleInputChange}
                        onSubmit={authForm.handleLogin}
                        isLoading={authForm.isLoading}
                        error={error}
                        onGoogleLogin={handleGoogleLogin}
                        onSwitchMode={() => dispatch(setAuthMode('signup'))}
                    />
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-start p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-gray-200 opacity-20"
                        onClick={handleClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="relative flex h-full w-full max-w-sm flex-col rounded-3xl bg-white p-8 shadow-2xl md:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="hover:text-text-main absolute top-4 right-4 cursor-pointer text-gray-400 transition-colors duration-200"
                            aria-label="Close authentication modal"
                        >
                            <Icon name="x-circle" className="h-6 w-6" />
                        </button>

                        {/* Form Content */}
                        {renderFormContent()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthSidebar;
