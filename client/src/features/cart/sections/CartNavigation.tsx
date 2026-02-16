import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';

const CartNavigation: React.FC = () => {
    return (
        <nav className="border-border sticky top-0 z-50 border-b bg-white px-4 py-1 shadow-sm sm:px-6 sm:py-1">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center justify-center rounded-full bg-white">
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-2xl border-2 border-white sm:h-16 sm:w-16 overflow-hidden">
                            <img
                                src={`/assets/Cravo_logo.png`}
                                alt="Cravo Logo"
                                className="w-full h-full object-contain"
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'https://placehold.co/60x60/fde047/6b7280?text=C';
                                }}
                            />
                        </div>
                    </div>
                    <h1 className="text-text-main text-xl font-bold sm:text-xl">
                        Secure Checkout
                    </h1>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-8">
                    <div className="hidden items-center space-x-6 lg:flex">
                        <NavLink
                            to="/help-support"
                            className={({ isActive }) =>
                                `flex items-center gap-1 ${isActive
                                    ? 'font-semibold text-yellow-600'
                                    : 'text-text-secondary hover:text-text-main'
                                }`
                            }
                        >
                            <Icon name="help-circle" size={20} />
                            <span className="hidden xl:block">Help</span>
                        </NavLink>
                        <NavLink
                            to="/profile/account"
                            className={({ isActive }) =>
                                `flex items-center gap-1 ${isActive
                                    ? 'font-semibold text-yellow-600'
                                    : 'text-text-secondary hover:text-text-main'
                                }`
                            }
                        >
                            <Icon name="user" size={20} />
                            <span className="hidden xl:block">Profile</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default CartNavigation;
