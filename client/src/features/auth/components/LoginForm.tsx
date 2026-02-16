import React, { useState, ChangeEvent, FormEvent } from 'react';
import Icon from '../../../components/ui/Icon';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import SocialLoginButton from './SocialLoginButton';
import { AuthFormData } from '../types/auth-types';

interface LoginFormProps {
    formData: AuthFormData;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
    error: string | null;
    onGoogleLogin: () => void;
    onSwitchMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    onChange,
    onSubmit,
    isLoading,
    error,
    onGoogleLogin,
    onSwitchMode,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-1 flex-col justify-between">
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-text-main text-3xl font-bold">Welcome Back</h2>
                    <p className="text-text-muted mt-2 text-sm">
                        Sign in to continue your journey.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-500">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        required
                        value={formData.email}
                        onChange={onChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={onChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-text-muted hover:text-text-secondary absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer transition-colors"
                        >
                            <Icon
                                name={showPassword ? 'eye-off' : 'eye'}
                                className="h-5 w-5"
                            />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? <LoadingSpinner /> : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 text-center">
                <div className="my-6 flex items-center">
                    <hr className="border-border flex-grow" />
                    <span className="mx-4 text-sm text-gray-400">or</span>
                    <hr className="border-border flex-grow" />
                </div>

                <SocialLoginButton onClick={onGoogleLogin} />

                <p className="text-text-muted mt-4 text-sm">
                    Don't have an account?
                    <button
                        onClick={onSwitchMode}
                        className="ml-1 font-semibold text-yellow-600 hover:underline cursor-pointer"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
