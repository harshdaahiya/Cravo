import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import Icon from '../../../components/ui/Icon';

const CorporateNavigation: React.FC = () => {
    return (
        <>
            <nav className="border-border sticky top-0 z-50 border-b bg-white px-2 py-2 shadow-lg lg:px-2 lg:py-1">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 lg:space-x-5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-2xl lg:h-12 lg:w-12">
                            <img src={`/assets/Cravo_logo.png`} alt="Cravo Logo" />
                        </div>
                        <div className="w-8 lg:w-28">
                            <img
                                src={`/assets/Cravo_text_black_logo_without_bg.png`}
                                alt="Cravo Text Logo"
                            />
                        </div>
                    </Link>

                    <div className="flex items-center space-x-3 lg:space-x-6">
                        <div className="hidden items-center space-x-4 lg:flex">
                            <NavLink
                                to="/corporate/about-cravo"
                                className={({ isActive }) =>
                                    `flex items-center gap-1 text-lg ${isActive
                                        ? 'font-semibold text-yellow-600'
                                        : 'text-text-secondary hover:text-text-main'
                                    }`
                                }
                            >
                                <Icon name="info" size={20} />
                                <span className="hidden xl:block">About Cravo</span>
                            </NavLink>
                            <NavLink
                                to="/corporate/our-business"
                                className={({ isActive }) =>
                                    `flex items-center gap-1 text-lg ${isActive
                                        ? 'font-semibold text-yellow-600'
                                        : 'text-text-secondary hover:text-text-main'
                                    }`
                                }
                            >
                                <Icon name="briefcase" size={20} />
                                <span className="hidden xl:block">Our Business</span>
                            </NavLink>
                            <NavLink
                                to="/corporate/newsroom"
                                className={({ isActive }) =>
                                    `flex items-center gap-1 text-lg ${isActive
                                        ? 'font-semibold text-yellow-600'
                                        : 'text-text-secondary hover:text-text-main'
                                    }`
                                }
                            >
                                <Icon name="newspaper" size={20} />
                                <span className="hidden xl:block">NewsRoom</span>
                            </NavLink>
                            <NavLink
                                to="/corporate/delivering-for-everyone"
                                className={({ isActive }) =>
                                    `flex items-center gap-1 text-lg ${isActive
                                        ? 'font-semibold text-yellow-600'
                                        : 'text-text-secondary hover:text-text-main'
                                    }`
                                }
                            >
                                <Icon name="truck" size={20} />
                                <span className="hidden xl:block">Delivering For Everyone</span>
                            </NavLink>
                            <NavLink
                                to="/corporate/connect-us"
                                className={({ isActive }) =>
                                    `flex items-center gap-1 text-lg ${isActive
                                        ? 'font-semibold text-yellow-600'
                                        : 'text-text-secondary hover:text-text-main'
                                    }`
                                }
                            >
                                <Icon name="mail" size={20} />
                                <span className="hidden xl:block">Connect Us</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default CorporateNavigation;
