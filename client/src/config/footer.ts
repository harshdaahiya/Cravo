import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  LucideIcon,
} from 'lucide-react';

export interface FooterLink {
  label: string;
  to?: string;
  href?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialIconConfig {
  Icon: LucideIcon;
  href: string;
  label: string;
}

export const FOOTER_BRANDING = {
  logoSrc: '/assets/Cravo_logo.png',
  textLogoSrc: '/assets/Cravo_white_text_logo.png',
  description: 'Bringing your favourite dishes from the best restaurants straight to your doorstep.',
};

export const FOOTER_CONTACT = [
  { icon: 'Phone', text: '+1 (555) 123-4567' },
  { icon: 'Mail', text: 'my@cravoindia.com' },
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about-us' },
      { label: 'Careers', to: '/careers' },
      { label: 'Team', to: '/team' },
      { label: 'Press', to: '/press' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Cravo One', to: '/cravo-one' },
      { label: 'Instamart', to: '/cravo-instamart' },
      { label: 'Dineout', to: '/cravo-dineout' },
      { label: 'Genie', to: '/cravo-genie' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Restaurants', to: '/partner-with-us' },
      { label: 'Delivery Partners', to: '/for-riders' },
      { label: 'Businesses', to: '/for-businesses' },
      { label: 'Corporate', to: '/cravo-corporate' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/contact-us' },
      { label: 'Privacy', to: '/privacy-policy' },
      { label: 'Terms', to: '/terms-of-service' },
      { label: 'iOS App', href: 'https://apps.apple.com/us/app/cravo-ios' },
      { label: 'Android App', href: 'https://play.google.com/store/apps/details?id=com.cravo.android' },
    ],
  },
];

export const FOOTER_SOCIAL_LINKS: SocialIconConfig[] = [
  { Icon: Github, href: 'https://github.com/believeharsh', label: 'Github' },
  { Icon: Twitter, href: 'https://x.com/believeharsh?t=TIwrahwHjYlsDs8-EbUxig&s=09', label: 'Twitter' },
  { Icon: Instagram, href: 'https://www.instagram.com/theharshdahiya1/', label: 'Instagram' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/believeharsh11/', label: 'LinkedIn' },
];

export const FOOTER_COPYRIGHT = {
  company: 'Cravo Limited',
  author: 'Made By Harsh Dahiya',
};
