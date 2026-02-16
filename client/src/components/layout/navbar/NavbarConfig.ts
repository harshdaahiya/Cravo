import { AppDispatch } from '../../../store';
import { IconName } from '../../ui/Icon';

export interface NavItem {
  id: string;
  label: string;
  Iconname: IconName;
  path?: string;
  badge?: string;
  count?: number;
  showOnMobile: boolean;
  action?: () => void;
}

export const getNavItems = (
  isAuthenticated: boolean,
  cartCount: number,
  dispatch: AppDispatch,
  openAuthSidebarAction: any,
  setIsProfileDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>
): NavItem[] => {
  const baseNavItems: NavItem[] = [
    {
      id: 'offers',
      label: 'Offers',
      Iconname: 'tag',
      path: '/offers',
      badge: 'New',
      showOnMobile: true,
    },
    {
      id: 'corporate',
      label: 'Corporate',
      Iconname: 'building-2',
      path: '/corporate',
      showOnMobile: true,
    },
    {
      id: 'help',
      label: 'Help',
      Iconname: 'help-circle',
      path: '/help',
      showOnMobile: true,
    },
    {
      id: 'cart',
      label: 'Cart ',
      Iconname: 'shopping-cart',
      path: '/cart',
      count: cartCount,
      showOnMobile: true,
    },
  ];

  if (isAuthenticated) {
    baseNavItems.push({
      id: 'profile',
      label: 'Profile',
      Iconname: 'user',
      path: '/profile/account', // Path for mobile
      action: () => setIsProfileDropdownOpen(prev => !prev), // Action for desktop
      showOnMobile: true,
    });
  } else {
    baseNavItems.push({
      id: 'signin',
      label: 'Sign In',
      Iconname: 'log-in',
      action: () => dispatch(openAuthSidebarAction()),
      showOnMobile: true,
    });
  }

  return baseNavItems;
};
