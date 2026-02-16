import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import Icon, { IconName } from '../ui/Icon';
import Navbar from './navbar/Navbar';
import Button from '../ui/Button';

interface SidebarOption {
    id: string;
    path?: string;
    title: string;
    icon: IconName;
    color: string;
    count?: string;
    badge?: string;
    action?: () => void;
}

const ProfileLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sidebarOptions: SidebarOption[] = [
        {
            id: 'profile',
            path: 'account',
            title: 'Account',
            icon: 'user',
            color: 'text-yellow-400',
        },
        {
            id: 'orders',
            path: 'orders',
            title: 'Orders',
            icon: 'shopping-bag',
            color: 'text-yellow-400',
            count: '12',
        },
        {
            id: 'favorites',
            path: 'favorites',
            title: 'Favorites',
            icon: 'heart',
            color: 'text-red-500',
            count: '8',
        },
        {
            id: 'payments',
            path: 'payments',
            title: 'Payments',
            icon: 'credit-card',
            color: 'text-green-400',
        },
        {
            id: 'addresses',
            path: 'addresses',
            title: 'Addresses',
            icon: 'map-pin',
            color: 'text-blue-500',
            count: '3',
        },
        {
            id: 'settings',
            path: 'settings',
            title: 'Settings',
            icon: 'settings',
            color: 'text-gray-400',
        },
    ];

    const additionalOptions: SidebarOption[] = [
        {
            id: 'help',
            path: 'help-support',
            title: 'Help & Support',
            icon: 'help-circle',
            color: 'text-blue-500',
        },
        {
            id: 'logout',
            title: 'Logout',
            icon: 'log-out',
            color: 'text-red-500',
            action: () => console.log('Logout clicked'),
        },
    ];

    const getMobileSectionTitle = () => {
        const currentPath = window.location.pathname.split('/').pop();
        const section = [...sidebarOptions, ...additionalOptions].find(
            opt => opt.path === currentPath
        );
        if (!currentPath && window.location.pathname.endsWith('/profile/')) {
            return 'Profile Dashboard';
        }
        return section ? section.title : 'Profile';
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 flex min-h-screen">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <aside
                    className={`border-gray-100 fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-white transition-transform duration-300 ease-in-out lg:static lg:z-0 ${isSidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    {/* Close button for mobile sidebar */}
                    <div className="absolute top-4 right-4 z-40 lg:hidden">
                        <Button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-900"
                            variant="ghost"
                            size="sm"
                        >
                            <Icon name={'x'} size={24} />
                        </Button>
                    </div>

                    <nav className="space-y-2 overflow-y-auto p-4 pt-16 lg:pt-4">
                        {[...sidebarOptions, ...additionalOptions].map(
                            ({ id, title, icon, color, count, badge, path, action }) =>
                                path ? (
                                    <NavLink
                                        key={id}
                                        to={path}
                                        className={({ isActive }) =>
                                            `flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-gray-100 transition-colors ${isActive
                                                ? 'bg-yellow-50 font-semibold text-yellow-700'
                                                : 'text-gray-700'
                                            }`
                                        }
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={icon} className={`${color}`} size={20} />
                                            <span>{title}</span>
                                            {badge && (
                                                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] text-yellow-800 font-bold">
                                                    {badge}
                                                </span>
                                            )}
                                        </div>
                                        {count && (
                                            <span className="text-gray-400 text-xs font-medium">{count}</span>
                                        )}
                                    </NavLink>
                                ) : (
                                    <button
                                        key={id}
                                        onClick={() => {
                                            action?.();
                                            setIsSidebarOpen(false);
                                        }}
                                        className="text-gray-700 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={icon} className={`${color}`} size={20} />
                                            <span>{title}</span>
                                        </div>
                                    </button>
                                )
                        )}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex flex-1 flex-col">
                    <header className="border-gray-100 sticky top-0 z-20 flex items-center justify-between border-b bg-white p-4 lg:hidden">
                        <Button onClick={() => setIsSidebarOpen(true)} variant="ghost" size="sm">
                            <Icon name={'menu'} size={24} />
                        </Button>
                        <h1 className="text-gray-900 text-lg font-semibold">
                            {getMobileSectionTitle()}
                        </h1>
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                            <Icon name="shopping-cart" size={18} className="text-gray-900" />
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </>
    );
};

export default ProfileLayout;
