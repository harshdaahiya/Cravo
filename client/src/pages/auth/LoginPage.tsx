import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
    clearAuthError,
    loginUser,
} from '../../features/auth/store/auth-slice';
import { AppDispatch, RootState } from '../../store';
import Icon from '../../components/ui/Icon';

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { isAuthenticated, isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    // Redirect authenticated users
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/restaurants');
        }
    }, [isAuthenticated, navigate]);

    // Clear previous errors when the component mounts or when navigating away
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        dispatch(clearAuthError());
        if (!formData.email.trim() || !formData.password.trim()) {
            return;
        }

        const resultAction = await dispatch(loginUser(formData));

        if (loginUser.fulfilled.match(resultAction)) {
            if (rememberMe && resultAction.payload?.role) {
                localStorage.setItem('role', resultAction.payload.role);
            }
        }
    };

    const handleGoogleLogin = () => {
        window.open(
            'http://localhost:8000/api/v1/auth/google',
            'google-login',
            'width=500,height=600'
        );
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side — hero image & copy */}
            <div className="relative hidden lg:flex lg:w-1/2">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80')",
                    }}
                >
                    <div className="bg-opacity-40 absolute inset-0 bg-black" />
                    <div className="relative z-10 flex flex-col items-start justify-center p-12 text-white">
                        <h1 className="mb-4 text-4xl font-bold">Welcome Back to</h1>
                        <h2 className="mb-6 text-5xl font-bold text-yellow-400">
                            FoodieHub
                        </h2>
                        <p className="max-w-md text-xl leading-relaxed text-gray-200">
                            Discover amazing recipes, connect with fellow food lovers, and
                            embark on your culinary journey.
                        </p>
                        <div className="mt-8 flex items-center space-x-4">
                            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full">
                                <span className="text-2xl">🍳</span>
                            </div>
                            <div className="bg-mint-green flex h-12 w-12 items-center justify-center rounded-full">
                                <span className="text-2xl">🥗</span>
                            </div>
                            <div className="bg-coffee flex h-12 w-12 items-center justify-center rounded-full">
                                <span className="text-2xl">☕</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side — form */}
            <div className="to-cream flex w-full items-center justify-center bg-gradient-to-br from-yellow-50 px-4 sm:px-6 lg:w-1/2 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Heading */}
                    <div className="text-center">
                        <div className="bg-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <h2 className="text-charcoal text-3xl font-bold">Welcome Back</h2>
                        <p className="text-medium-gray mt-2">
                            Sign in to continue your culinary adventure
                        </p>
                    </div>

                    {/* Card */}
                    <div className="border-cream rounded-2xl border bg-white p-8 shadow-xl backdrop-blur-sm">
                        {error && (
                            <p className="mb-4 text-center text-sm font-medium text-red-500">
                                {error}
                            </p>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-coffee mb-2 block text-sm font-medium"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="text-medium-gray pointer-events-none absolute inset-y-0 top-1/2 left-0 h-5 w-5 -translate-y-1/2 pl-3 flex items-center justify-center">
                                        <Icon name="mail" size={18} />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border-cream text-charcoal placeholder-medium-gray block w-full rounded-lg border py-3 pr-3 pl-10 transition-all duration-200 focus:ring-yellow-400 focus:outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="text-coffee mb-2 block text-sm font-medium"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="text-medium-gray pointer-events-none absolute inset-y-0 top-1/2 left-0 h-5 w-5 -translate-y-1/2 pl-3 flex items-center justify-center">
                                        <Icon name="lock" size={18} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="border-cream text-charcoal placeholder-medium-gray block w-full rounded-lg border py-3 pr-10 pl-10 transition-all duration-200 focus:ring-yellow-400 focus:outline-none"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <Icon name="eye-off" className="text-medium-gray hover:text-charcoal h-5 w-5 transition-colors duration-200" />
                                        ) : (
                                            <Icon name="eye" className="text-medium-gray hover:text-charcoal h-5 w-5 transition-colors duration-200" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me & forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.target.checked)}
                                        className="border-cream h-4 w-4 rounded-2xl text-yellow-400"
                                    />
                                    <span className="text-medium-gray ml-2 text-sm">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-yellow-600 transition-colors duration-200 hover:text-yellow-700"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group bg-primary hover:bg-primary-hover relative flex w-full transform cursor-pointer justify-center rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:ring-yellow-400 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                                ) : (
                                    <>
                                        Sign In
                                        <div className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 flex items-center">
                                            <Icon name="arrow-right" size={16} />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="border-cream w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="text-medium-gray bg-white px-2 font-semibold">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <div className="mt-6 text-center">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="border-coffee text-coffee hover:bg-cream inline-flex transform items-center justify-center rounded-lg border bg-white px-4 py-3 text-sm font-medium shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:ring-offset-2 focus:outline-none"
                            >
                                <img
                                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                                    alt="Google"
                                    className="mr-3 h-5 w-5"
                                />
                                Sign in with Google
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <div className="relative flex justify-center text-sm">
                                <span className="text-medium-gray bg-white px-2">
                                    New to our community?
                                </span>
                            </div>
                            <Link
                                to="/signup"
                                className="border-border-focus inline-flex justify-center rounded-lg border bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-600 transition-all duration-200 hover:bg-yellow-100 focus:ring-offset-2 focus:outline-none"
                            >
                                Create New Account
                            </Link>
                        </div>
                    </div>

                    {/* Branding on small screens */}
                    <div className="text-center lg:hidden">
                        <h3 className="text-charcoal mb-2 text-xl font-bold">
                            🍽️ FoodieHub
                        </h3>
                        <p className="text-medium-gray text-sm">
                            Your culinary journey starts here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
