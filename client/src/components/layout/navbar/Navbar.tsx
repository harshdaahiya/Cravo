import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { selectCartTotalQuantity } from '../../../features/cart';
import { openAuthSidebar } from '../../../features/ui/store/ui-slice';
import { SearchModal } from '../../../features/search-context';
import Button from '../../ui/Button';
import Icon from '../../ui/Icon';
import MobileMenu from './MobileMenu';
import { getNavItems, NavItem } from './NavbarConfig';
import ProfileDropdown from './ProfileDropDown';
import { RootState, AppDispatch } from '../../../store';

interface NavbarProps {
    showSearch?: boolean;
    visibility?: string;
}

const Navbar: React.FC<NavbarProps> = ({ showSearch = true, visibility = "" }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // profile button dropdown state
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const cartCount = useSelector(selectCartTotalQuantity);

    // current selected location fetching from location slice state
    const userLocation = useSelector((state: RootState) => state.location);
    const { city, regionName, country } = userLocation;

    const CurrentLocation = `${city}, ${regionName ? regionName : ''}, ${country ? country : ''}`;

    const navItems = useMemo<NavItem[]>(() => {
        return getNavItems(
            isAuthenticated,
            cartCount,
            dispatch,
            openAuthSidebar,
            setIsProfileDropdownOpen
        );
    }, [isAuthenticated, cartCount, dispatch]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearchModalOpen(false);
    };

    const openSearchModal = () => {
        setIsSearchModalOpen(true);
    };

    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav
                className={`border-gray-100 top-0 z-50 border-b bg-white shadow-sm ${visibility} sticky`}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="flex h-16 items-center justify-between lg:h-20">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex flex-shrink-0 items-center space-x-2 sm:space-x-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white sm:h-14 sm:w-14">
                                <img
                                    src={`/assets/Cravo_logo.png`}
                                    alt="Cravo Logo"
                                    className="rounded-xl h-full w-full object-contain"
                                />
                            </div>
                        </Link>

                        {/* Location & Search - Desktop */}
                        <div className="mr-auto ml-6 hidden flex-1 items-center space-x-4 sm:flex">
                            <div className="text-gray-600 group flex cursor-pointer items-center space-x-2 transition-colors hover:text-yellow-600">
                                <Icon
                                    name="map-pin"
                                    size={20}
                                    className="text-gray-400 transition-colors group-hover:text-yellow-500"
                                />
                                <span className="hidden text-sm font-medium sm:inline md:text-base max-w-[200px] truncate">
                                    {CurrentLocation}
                                </span>
                                <Icon
                                    name="chevron-down"
                                    size={20}
                                    className="text-gray-400 transition-colors group-hover:text-yellow-500"
                                />
                            </div>

                            {showSearch && (
                                <div
                                    className="hidden max-w-xs cursor-pointer items-center space-x-2 rounded-full bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 lg:flex"
                                    onClick={openSearchModal}
                                >
                                    <Icon name="search" size={18} className="text-gray-400" />
                                    <span className="text-gray-400 overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
                                        Search for food, restaurants...
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Desktop Navigation Items */}
                        <div className="hidden flex-shrink-0 items-center space-x-2 md:flex">
                            {navItems.map(item => {
                                // Profile dropdown
                                if (item.id === 'profile') {
                                    return (
                                        <ProfileDropdown
                                            key={item.id}
                                            isOpen={isProfileDropdownOpen}
                                            onClose={() => setIsProfileDropdownOpen(false)}
                                            onToggle={() => setIsProfileDropdownOpen(prev => !prev)}
                                        />
                                    );
                                }

                                // Sign-in button
                                if (item.action) {
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={item.action}
                                            className="hover:bg-gray-50 text-gray-600 hover:text-gray-900 relative flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 hover:scale-105"
                                        >
                                            <Icon name={item.Iconname} size={18} />
                                            <span className="hidden xl:block">{item.label}</span>
                                        </button>
                                    );
                                }

                                // Regular navigation links
                                if (item.path) {
                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `hover:bg-gray-50 relative flex items-center space-x-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 hover:scale-105 ${isActive
                                                    ? 'bg-yellow-50 text-yellow-600'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`
                                            }
                                        >
                                            <Icon name={item.Iconname} size={18} />
                                            <span className="hidden xl:block">{item.label}</span>
                                            {item.badge && (
                                                <span className="bg-primary text-gray-900 absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {item.count !== undefined && item.count > 0 && (
                                                <span className="absolute -top-0.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                                    {item.count > 99 ? '99+' : item.count}
                                                </span>
                                            )}
                                        </NavLink>
                                    );
                                }

                                return null;
                            })}
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex flex-shrink-0 items-center space-x-2 sm:hidden">
                            {showSearch && (
                                <Button
                                    onClick={openSearchModal}
                                    className="rounded-xl p-2"
                                    variant="ghost"
                                >
                                    <Icon
                                        name={'search'}
                                        size={24}
                                        className="text-gray-600"
                                    />
                                </Button>
                            )}
                            <Button
                                onClick={toggleMobileMenu}
                                className="rounded-xl p-2"
                                variant="ghost"
                            >
                                {isMobileMenuOpen ? (
                                    <Icon name={'x'} size={24} className="text-gray-600" />
                                ) : (
                                    <Icon
                                        name={'menu'}
                                        size={24}
                                        className="text-gray-600"
                                    />
                                )}
                            </Button>
                            <div className="flex items-center">
                                <NavLink
                                    to="/cart"
                                    className="relative rounded-xl p-2 transition-colors hover:bg-gray-100"
                                >
                                    <Icon
                                        name={'shopping-cart'}
                                        size={24}
                                        className="text-gray-600"
                                    />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <MobileMenu
                        isOpen={isMobileMenuOpen}
                        navItems={navItems}
                        userLocation={CurrentLocation}
                        onClose={toggleMobileMenu}
                    />
                </div>
            </nav>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={closeSearchModal}
                searchQuery={searchQuery}
                onSearchChange={e => setSearchQuery(e.target.value)}
                onSearchSubmit={handleSearchSubmit}
            />
        </>
    );
};

export default Navbar;
