import React from 'react';

interface SocialLoginButtonProps {
    onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ onClick }) => (
    <button
        onClick={onClick}
        type="button"
        className="hover:bg-bg-subtle flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-3 transition-colors duration-200 cursor-pointer"
    >
        <img
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="Google"
            className="h-6 w-6"
        />
        <span className="text-text-secondary font-medium">
            Continue with Google
        </span>
    </button>
);

export default SocialLoginButton;
