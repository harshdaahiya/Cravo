import React, { ReactNode } from 'react';
import { Phone, Mail, LucideIcon } from 'lucide-react';
import {
    FOOTER_BRANDING,
    FOOTER_CONTACT,
    FOOTER_LINK_GROUPS,
    FOOTER_SOCIAL_LINKS,
    FOOTER_COPYRIGHT,
} from '../../config/footer';

interface LinkItemProps {
    to?: string;
    href?: string;
    children: ReactNode;
}

const InternalLinkItem: React.FC<LinkItemProps> = ({ to, children }) => (
    <a
        href={to}
        className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
        {children}
    </a>
);

const ExternalLinkItem: React.FC<LinkItemProps> = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        className="border-border flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground transition-all duration-200 hover:border-ring hover:text-primary hover:shadow-md"
        aria-label={label}
    >
        <Icon size={18} />
    </a>
);

const Footer: React.FC = () => (
    <footer className="border-border border-t bg-foreground">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
                {/* Brand Section */}
                <div className="col-span-2 lg:col-span-2">
                    <div className="mb-4 flex items-center space-x-1">
                        <div className="h-18 w-18 cursor-pointer rounded-xl">
                            <img src={FOOTER_BRANDING.logoSrc} alt="Cravo Logo" />
                        </div>
                        <div className="w-32">
                            <img
                                src={FOOTER_BRANDING.textLogoSrc}
                                alt="Cravo Text Logo"
                                className="h-10"
                            />
                        </div>
                    </div>
                    <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        {FOOTER_BRANDING.description}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-muted">
                        <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-primary" />
                            <span>{FOOTER_CONTACT[0].text}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail size={14} className="text-primary" />
                            <span>{FOOTER_CONTACT[1].text}</span>
                        </div>
                    </div>
                </div>

                {/* Dynamic Link Groups */}
                {FOOTER_LINK_GROUPS.map((group, index) => (
                    <div key={index} className="space-y-3">
                        <h3 className="text-md font-semibold tracking-wide text-slate-200">
                            {group.title}
                        </h3>
                        <div className="flex flex-col space-y-2">
                            {group.links.map((link, linkIndex) => (
                                link.to ? (
                                    <InternalLinkItem key={linkIndex} to={link.to}>
                                        {link.label}
                                    </InternalLinkItem>
                                ) : (
                                    <ExternalLinkItem key={linkIndex} href={link.href}>
                                        {link.label}
                                    </ExternalLinkItem>
                                )
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border border-t">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    {/* Social Icons */}
                    <div className="flex items-center space-x-3">
                        <span className="mr-2 text-sm text-muted-foreground">Follow us:</span>
                        {FOOTER_SOCIAL_LINKS.map((social, index) => (
                            <SocialIcon
                                key={index}
                                Icon={social.Icon}
                                href={social.href}
                                label={social.label}
                            />
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>© {new Date().getFullYear()} {FOOTER_COPYRIGHT.company}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">
                            {FOOTER_COPYRIGHT.author}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

