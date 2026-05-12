import React from 'react';
import { useDispatch } from 'react-redux';

import { openAuthSidebar } from '../../ui/store/ui-slice';
import Icon from '../../../components/ui/Icon';
import { AppDispatch } from '../../../store';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    action?: string;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    action
}) => {
    const dispatch = useDispatch<AppDispatch>();

    if (!isOpen) return null;

    const handleLogin = () => {
        onClose();
        dispatch(openAuthSidebar());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-muted opacity-20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md scale-100 transform rounded-2xl bg-background opacity-100 shadow-2xl transition-all duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="hover:text-text-secondary absolute top-4 right-4 cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                    aria-label="Close modal"
                >
                    <Icon name="x" size={20} />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-muted">
                            <Icon name="user" size={32} className="text-primary-hover" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-foreground mb-3 text-center text-2xl font-bold">
                        {title || 'Login Required'}
                    </h2>

                    {/* Message */}
                    <p className="text-text-secondary mb-6 text-center leading-relaxed">
                        {message ||
                            'Please log in to continue. You need to be logged in to add items to your wishlist.'}
                    </p>

                    {/* Action Info (if provided) */}
                    {action && (
                        <div className="mb-6 rounded-xl border border-ring bg-warning-muted p-4">
                            <div className="flex items-start space-x-3">
                                <Icon
                                    name="info"
                                    size={20}
                                    className="mt-0.5 flex-shrink-0 text-primary-hover"
                                />
                                <p className="text-text-secondary text-sm">{action}</p>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleLogin}
                            className="bg-primary hover:bg-primary-hover text-foreground flex flex-1 transform cursor-pointer items-center justify-center space-x-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-105"
                        >
                            <Icon name="log-in" size={18} />
                            <span>Login / Sign Up</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-text-secondary flex-1 cursor-pointer rounded-xl bg-muted px-6 py-3 font-semibold transition-all duration-200 hover:bg-muted"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>

                {/* Bottom Decoration */}
                <div className="h-2 rounded-b-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
            </div>
        </div>
    );
};

export default AuthRequiredModal;
