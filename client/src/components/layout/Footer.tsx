import React, { ReactNode } from 'react';
import {
    Github,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    Twitter,
    LucideIcon,
} from 'lucide-react';

interface LinkItemProps {
    to?: string;
    href?: string;
    children: ReactNode;
}

const InternalLinkItem: React.FC<LinkItemProps> = ({ to, children }) => (
    <a
        href={to}
        className="text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-yellow-500"
    >
        {children}
    </a>
);

const ExternalLinkItem: React.FC<LinkItemProps> = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-yellow-500"
    >
        {children}
    </a>
);

interface SocialIconProps {
    Icon: LucideIcon;
    href: string;
    label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ Icon, href, label }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-gray-700 flex h-10 w-10 items-center justify-center rounded-full border text-gray-300 transition-all duration-200 hover:border-yellow-500 hover:text-yellow-500 hover:shadow-md"
        aria-label={label}
    >
        <Icon size={18} />
    </a>
);

const Footer: React.FC = () => (
    <footer className="border-gray-700 border-t bg-gray-800">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
                {/* Brand Section */}
                <div className="col-span-2 lg:col-span-2">
                    <div className="mb-4 flex items-center space-x-1">
                        <div className="h-18 w-18 cursor-pointer rounded-xl">
                            <img src="/assets/Cravo_logo.png" alt="Cravo Logo" />
                        </div>
                        <div className="w-32">
                            <img
                                src="/assets/Cravo_white_text_logo.png"
                                alt="Cravo Text Logo"
                                className="h-10"
                            />
                        </div>
                    </div>
                    <p className="mb-4 max-w-sm text-sm leading-relaxed text-gray-300">
                        Bringing your favourite dishes from the best restaurants straight to
                        your doorstep.
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-yellow-500" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-yellow-500" />
                            <span>my@cravoindia.com</span>
                        </div>
                    </div>
                </div>

                {/* Company Links */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold tracking-wide text-gray-200">
                        Company
                    </h4>
                    <div className="flex flex-col space-y-2">
                        <InternalLinkItem to="/about-us">About Us</InternalLinkItem>
                        <InternalLinkItem to="/careers">Careers</InternalLinkItem>
                        <InternalLinkItem to="/team">Team</InternalLinkItem>
                        <InternalLinkItem to="/press">Press</InternalLinkItem>
                    </div>
                </div>

                {/* Services Links */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold tracking-wide text-gray-200">
                        Services
                    </h4>
                    <div className="flex flex-col space-y-2">
                        <InternalLinkItem to="/cravo-one">Cravo One</InternalLinkItem>
                        <InternalLinkItem to="/cravo-instamart">Instamart</InternalLinkItem>
                        <InternalLinkItem to="/cravo-dineout">Dineout</InternalLinkItem>
                        <InternalLinkItem to="/cravo-genie">Genie</InternalLinkItem>
                    </div>
                </div>

                {/* Partners Links */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold tracking-wide text-gray-200">
                        Partners
                    </h4>
                    <div className="flex flex-col space-y-2">
                        <InternalLinkItem to="/partner-with-us">
                            Restaurants
                        </InternalLinkItem>
                        <InternalLinkItem to="/for-riders">
                            Delivery Partners
                        </InternalLinkItem>
                        <InternalLinkItem to="/for-businesses">Businesses</InternalLinkItem>
                        <InternalLinkItem to="/cravo-corporate">Corporate</InternalLinkItem>
                    </div>
                </div>

                {/* Support & Apps */}
                <div className="space-y-3">
                    <h4 className="text-md font-semibold tracking-wide text-gray-200">
                        Support
                    </h4>
                    <div className="flex flex-col space-y-2">
                        <InternalLinkItem to="/contact-us">Help Center</InternalLinkItem>
                        <InternalLinkItem to="/privacy-policy">Privacy</InternalLinkItem>
                        <InternalLinkItem to="/terms-of-service">Terms</InternalLinkItem>
                        <ExternalLinkItem href="https://apps.apple.com/us/app/cravo-ios">
                            iOS App
                        </ExternalLinkItem>
                        <ExternalLinkItem href="https://play.google.com/store/apps/details?id=com.cravo.android">
                            Android App
                        </ExternalLinkItem>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-gray-700 border-t">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-3">
                        <span className="mr-2 text-sm text-gray-300">Follow us:</span>
                        <SocialIcon
                            Icon={Github}
                            href="https://github.com/believeharsh"
                            label="Facebook"
                        />
                        <SocialIcon
                            Icon={Twitter}
                            href="https://x.com/believeharsh?t=TIwrahwHjYlsDs8-EbUxig&s=09"
                            label="Twitter"
                        />
                        <SocialIcon
                            Icon={Instagram}
                            href="https://www.instagram.com/theharshdahiya1/"
                            label="Instagram"
                        />
                        <SocialIcon
                            Icon={Linkedin}
                            href="https://www.linkedin.com/in/believeharsh11/"
                            label="LinkedIn"
                        />
                    </div>

                    {/* Copyright */}
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span>© {new Date().getFullYear()} Cravo Limited</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">
                            Made with ❤️ for food lovers
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
