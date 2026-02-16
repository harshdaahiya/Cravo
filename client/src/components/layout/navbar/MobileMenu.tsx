import React from 'react';
import { NavLink } from 'react-router-dom';

import Icon from '../../ui/Icon';
import { NavItem } from './NavbarConfig';

interface MobileMenuProps {
    isOpen: boolean;
    navItems: NavItem[];
    userLocation: string;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, navItems, userLocation, onClose }) => {
    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${isOpen ? 'max-h-screen opacity-100 pb-4' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="border-gray-100 space-y-2 border-t py-4">
                <div className="text-gray-600 flex items-center space-x-3 rounded-xl p-4">
                    <Icon name="map-pin" size={20} className="text-gray-400" />
                    <span className="truncate">{userLocation}</span>
                </div>
                {navItems
                    .filter(item => item.showOnMobile)
                    .map(item =>
                        item.action && item.id !== 'profile' ? (
                            <button
                                key={item.id}
                                onClick={() => {
                                    item.action?.();
                                    onClose();
                                }}
                                className="text-gray-600 hover:bg-gray-50 flex w-full items-center justify-between rounded-xl p-4 font-medium transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon name={item.Iconname} size={20} />
                                    <span>{item.label}</span>
                                </div>
                                <Icon
                                    name="chevron-right"
                                    size={16}
                                    className="text-gray-400"
                                />
                            </button>
                        ) : item.path ? (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex w-full items-center justify-between rounded-xl p-4 font-medium transition-all duration-200 ${isActive
                                        ? 'border border-yellow-200 bg-yellow-50 text-yellow-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon name={item.Iconname} size={20} />
                                    <span>{item.label}</span>
                                </div>
                                <Icon
                                    name="chevron-right"
                                    size={16}
                                    className="text-gray-400"
                                />
                            </NavLink>
                        ) : null
                    )}
            </div>
            <div className="bg-gray-50 border-gray-100 border-t p-4 rounded-xl">
                <p className="text-gray-500 text-center text-sm">
                    Cravo - Satisfy Your Cravings
                </p>
            </div>
        </div>
    );
};

export default MobileMenu;
