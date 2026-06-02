import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';
import { logoutUser } from '../../../features/auth';
import { openAuthSidebar } from '../../../features/ui';
import { RootState, AppDispatch } from '../../../store';
import { NAVIGATION_CONFIG } from '../../../config/landing';

const LandingNavigation: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const handleSignOut = () => {
        dispatch(logoutUser());
        setIsProfileDropdownOpen(false);
        navigate('/');
    };

    const profileMenuItems = NAVIGATION_CONFIG.getProfileMenuItems(handleSignOut);
    const mobileMenuItems = NAVIGATION_CONFIG.mobileMenuItems;

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                menuButtonRef.current &&
                !menuButtonRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="relative z-50 px-4 py-4 sm:px-6 sm:py-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link
                    to="/"
                    className="flex flex-shrink-0 items-center space-x-3 sm:space-x-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border-2 border-white sm:h-14 sm:w-14">
                        <img
                            src={NAVIGATION_CONFIG.logoSrc}
                            alt="Cravo Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="w-20 sm:w-28 md:w-32">
                        <img
                            src={NAVIGATION_CONFIG.textLogoSrc}
                            alt="Cravo"
                            className="h-auto w-full object-contain"
                        />
                    </div>
                </Link>

                <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                    <div className="hidden items-center space-x-4 lg:flex xl:space-x-6">
                        <NavLink
                            to="/corporate"
                            className={({ isActive }) =>
                                `flex items-center space-x-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${isActive
                                    ? 'bg-warning-muted text-primary-hover'
                                    : 'text-foreground hover:text-text-secondary hover:bg-bg-subtle'
                                }`
                            }
                        >
                            <Icon name="building-2" size={18} />
                            <span className="text-md">Corporate</span>
                        </NavLink>
                        <NavLink
                            to={mobileMenuItems[1].path}
                            className={({ isActive }) =>
                                `flex items-center rounded-lg px-3 py-2 font-medium transition-all duration-200 ${isActive ? 'bg-warning-muted text-primary-hover' : 'text-foreground hover:text-text-secondary hover:bg-bg-subtle'}`
                            }
                        >
                            <span className="text-md">{mobileMenuItems[1].label}</span>
                        </NavLink>
                        <NavLink to={mobileMenuItems[2].path}>
                            <button className="text-foreground bg-muted hover:bg-bg-subtle text-md flex cursor-pointer items-center justify-center rounded-xl border border-border px-4 py-2 font-medium transition-all duration-200 hover:border-border">
                                <Icon name={mobileMenuItems[2].icon!} size={16} className="mr-2" />
                                {NAVIGATION_CONFIG.getTheAppText}
                            </button>
                        </NavLink>
                    </div>

                    <button
                        className="text-foreground hover:bg-bg-subtle flex items-center justify-center rounded-lg p-2 transition-colors lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        ref={menuButtonRef}
                        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="landing-mobile-menu"
                    >
                        <Icon name="menu" size={20} aria-hidden="true" />
                    </button>
                    {isMobileMenuOpen && (
                        <div
                            ref={mobileMenuRef}
                            className="border-border absolute top-full right-4 z-50 mt-2 w-56 rounded-xl border bg-background py-2 shadow-lg sm:right-6 lg:hidden"
                        >
                            {mobileMenuItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-150 ${isActive
                                            ? 'bg-warning-muted text-primary-hover'
                                            : 'text-text-secondary hover:bg-bg-subtle'
                                        }`
                                    }
                                >
                                    {item.icon && (
                                        <Icon
                                            name={item.icon}
                                            size={16}
                                            className="text-muted-foreground"
                                        />
                                    )}
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {isAuthenticated ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        >
                            <button className="hover:bg-bg-subtle text-text-secondary hover:text-text-main hover:border-border flex items-center space-x-2 rounded-xl border border-transparent px-3 py-2 font-medium transition-all duration-200 hover:scale-105">
                                <Icon name="user" size={18} />
                                <span className="text-md hidden sm:block">{NAVIGATION_CONFIG.profileButtonText}</span>
                                <Icon
                                    name="chevron-down"
                                    size={14}
                                    className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute top-full right-0 z-50 pt-2">
                                    <div className="h-2 w-56 bg-transparent"></div>
                                    <div className="border-border w-56 rounded-xl border bg-background py-2 shadow-lg">
                                        {profileMenuItems.map((item, index) => {
                                            if (item.type === 'link') {
                                                return (
                                                    <Link
                                                        key={index}
                                                        to={item.path!}
                                                        className="text-text-secondary hover:bg-bg-subtle hover:text-text-main flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-150"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                    >
                                                        <Icon
                                                            name={`${item.icon}`}
                                                            size={16}
                                                            className="text-muted-foreground"
                                                        />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={item.onClick}
                                                    className="text-text-secondary hover:bg-bg-subtle flex w-full items-center space-x-3 px-4 py-3 text-sm transition-colors duration-150 hover:text-destructive"
                                                >
                                                    <Icon
                                                        name={`${item.icon}`}
                                                        size={16}
                                                        className="text-destructive"
                                                    />
                                                    <span>{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="">
                            <button
                                className="bg-muted text-text-secondary border-border flex items-center space-x-2 rounded-xl border px-4 py-2 font-medium transition-all duration-200 hover:scale-105 hover:border-border hover:bg-muted"
                                onClick={() => dispatch(openAuthSidebar({ mode: 'login' }))}
                            >
                                <Icon name="log-in" size={16} className="text-info" />
                                <span className="text-foreground text-sm font-medium">
                                    {NAVIGATION_CONFIG.signInText}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default LandingNavigation;
