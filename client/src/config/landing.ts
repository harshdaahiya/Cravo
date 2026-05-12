import { IconName } from '../components/ui/Icon';

export interface BaseMenuItem {
    label: string;
    icon?: IconName;
    type?: 'link' | 'button';
    path?: string;
    onClick?: () => void;
}

export const NAVIGATION_CONFIG = {
    signInText: 'Sign in',
    getTheAppText: 'Get The App',
    profileButtonText: 'Profile',
    logoSrc: '/assets/Cravo_logo.png',
    textLogoSrc: '/assets/Cravo_white_text_logo.png',
    mobileMenuItems: [
        { label: 'Corporate', path: '/corporate', icon: 'building-2' as IconName },
        { label: 'Partner with us', path: '/partner', icon: 'handshake' as IconName },
        { label: 'Get The App', path: '/get-the-app', icon: 'smartphone' as IconName },
    ],
    // Function to get profile menu items because it needs a dynamic sign-out handler
    getProfileMenuItems: (handleSignOut: () => void): BaseMenuItem[] => [
        { label: 'Account', path: '/profile/account', icon: 'user', type: 'link' },
        {
            label: 'Account Settings',
            path: '/profile/settings',
            icon: 'settings',
            type: 'link',
        },
        {
            label: 'My Orders',
            path: '/profile/orders',
            icon: 'package',
            type: 'link',
        },
        {
            label: 'Favorites',
            path: '/profile/favorites',
            icon: 'heart',
            type: 'link',
        },
        {
            label: 'Help & Support',
            path: '/profile/help-support',
            icon: 'help-circle',
            type: 'link',
        },
        {
            label: 'Sign Out',
            icon: 'log-out',
            type: 'button',
            onClick: handleSignOut,
        },
    ],
};

export const GET_THE_APP_CONFIG = {
    headingHighlight: 'Cravo: Faster, Fresher, Yours.',
    headingSuffix: ' Download Today!',
    description: 'Get exclusive app-only deals and real-time delivery tracking right on your smartphone.',
    buttons: [
        { label: 'App Store', icon: 'download' as IconName },
        { label: 'Google Play', icon: 'download' as IconName },
    ],
    qrCodeText: 'Scan for instant download link',
};

export const CITIES_CONFIG = {
    heading: 'Cities We Serve',
    subheading: 'Bringing delicious food to your doorstep across India',
    showMoreTextPrefix: 'Show More Cities',
    showLessText: 'Show Less',
    loadingText: 'Loading cities...',
    errorText: 'Error loading cities',
    noDataText: 'No cities available',
    initialVisibleCount: 8,
};

export const CATEGORIES_CONFIG = {
    headingPrefix: "What's on your mind",
    headingSuffix: "?",
    errorText: 'Failed to load categories',
};
