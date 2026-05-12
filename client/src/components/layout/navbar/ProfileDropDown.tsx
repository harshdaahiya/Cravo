import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../../features/auth';
import Icon from '../../ui/Icon';
import { AppDispatch } from '../../../store';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onToggle }) => {
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleLogout = () => {
        onClose();
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <div className="relative" ref={profileDropdownRef}>
            <button
                onClick={onToggle}
                className={`hover:bg-muted relative flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${isOpen
                        ? 'bg-warning-muted text-primary-hover'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
            >
                <Icon name="user" size={18} />
                <span className="hidden xl:block">Profile</span>
                <Icon
                    name="chevron-down"
                    size={18}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-sm bg-background shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {/* Account */}
                        <Link
                            to="/profile/account"
                            className="text-muted-foreground flex items-center px-4 py-2 text-sm hover:bg-muted"
                            onClick={onClose}
                        >
                            <Icon name="user" size={16} className="mr-2" />
                            Account
                        </Link>

                        {/* Settings */}
                        <Link
                            to="/profile/settings"
                            className="text-muted-foreground flex items-center px-4 py-2 text-sm hover:bg-muted"
                            onClick={onClose}
                        >
                            <Icon name="settings" size={16} className="mr-2" />
                            Settings
                        </Link>

                        {/* Favorites */}
                        <Link
                            to="/profile/favorites"
                            className="text-muted-foreground flex items-center px-4 py-2 text-sm hover:bg-muted"
                            onClick={onClose}
                        >
                            <Icon name="heart" size={16} className="mr-2" />
                            Favorites
                        </Link>

                        {/* Orders */}
                        <Link
                            to="/profile/orders"
                            className="text-muted-foreground flex items-center px-4 py-2 text-sm hover:bg-muted"
                            onClick={onClose}
                        >
                            <Icon name="shopping-bag" size={16} className="mr-2" />
                            Orders
                        </Link>

                        {/* Help & Support */}
                        <Link
                            to="/help"
                            className="text-muted-foreground flex items-center px-4 py-2 text-sm hover:bg-muted"
                            onClick={onClose}
                        >
                            <Icon name="help-circle" size={16} className="mr-2" />
                            Help & Support
                        </Link>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-muted cursor-pointer"
                        >
                            <Icon name="log-out" size={16} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
