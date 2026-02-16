import React, { FormEvent } from 'react';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

interface OTPVerificationFormProps {
    email: string;
    otpVerification: {
        otp: string;
        setOtp: (otp: string) => void;
        isLoading: boolean;
        error: string | null;
        resendCooldown: number;
        isResending: boolean;
        verifyOTP: (e?: FormEvent) => Promise<{ success: boolean; error?: string }>;
        resendOTP: () => Promise<{ success: boolean; error?: string } | undefined>;
    };
    onSuccess: () => void;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
    email,
    otpVerification,
    onSuccess
}) => {
    const {
        otp,
        setOtp,
        isLoading,
        error,
        resendCooldown,
        isResending,
        verifyOTP,
        resendOTP,
    } = otpVerification;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = await verifyOTP(e);
        if (result.success) {
            onSuccess();
        }
    };

    return (
        <div className="flex flex-1 flex-col justify-between">
            <div>
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-text-main text-3xl font-bold">
                        Verify Your Email
                    </h2>
                    <p className="text-text-muted mt-2 text-sm">
                        A 6-digit code has been sent to{' '}
                        <span className="font-semibold">{email}</span>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-500">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter OTP"
                        required
                        maxLength={6}
                        className="w-full rounded-xl border border-gray-300 px-4 py-4 text-center text-2xl tracking-widest placeholder-gray-400 transition-all focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="bg-primary-hover w-full rounded-xl py-3 font-semibold text-white shadow-lg transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Verify OTP'}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="mt-auto text-center">
                <p className="text-text-muted text-sm">
                    Didn't receive the code?
                    <button
                        onClick={resendOTP}
                        disabled={resendCooldown > 0 || isResending}
                        type="button"
                        className="ml-1 font-semibold text-yellow-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline cursor-pointer"
                    >
                        {isResending
                            ? 'Sending...'
                            : `Resend OTP${resendCooldown > 0 ? ` (${resendCooldown}s)` : ''}`}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OTPVerificationForm;
