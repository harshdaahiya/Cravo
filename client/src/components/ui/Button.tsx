import React, { ButtonHTMLAttributes, ReactElement } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconLeft?: ReactElement;
    iconRight?: ReactElement;
    className?: string;
}

/**
 * Reusable Button component with customizable size, variant, and icon support.
 */
const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    iconLeft,
    iconRight,
    className = '',
    disabled = false,
    ...props
}) => {
    // Base styles applied to all buttons
    const baseClasses =
        'font-semibold rounded-md transition-colors duration-normal ease-in-out whitespace-nowrap flex items-center justify-center';

    // Styles based on the 'variant' prop
    let variantClasses = '';
    switch (variant) {
        case 'primary':
            variantClasses = 'bg-primary text-charcoal hover:bg-primary-hover';
            break;
        case 'secondary':
            variantClasses =
                'bg-medium-gray text-white hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-medium-gray focus:ring-opacity-75';
            break;
        case 'outline':
            variantClasses =
                'border border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75';
            break;
        case 'ghost':
            variantClasses =
                'text-charcoal hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-75';
            break;
        case 'success':
            variantClasses =
                'bg-mint-green text-white hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-mint-green focus:ring-opacity-75';
            break;
        default:
            variantClasses =
                'bg-gray-200 text-charcoal hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-medium-gray focus:ring-opacity-75';
    }

    // Styles based on the 'size' prop
    let sizeClasses = '';
    let iconSizeClasses = '';
    switch (size) {
        case 'sm':
            sizeClasses = 'px-3 py-1.5 text-sm gap-1.5';
            iconSizeClasses = 'h-4 w-4';
            break;
        case 'md':
            sizeClasses = 'px-4 py-2 text-base gap-2';
            iconSizeClasses = 'h-5 w-5';
            break;
        case 'lg':
            sizeClasses = 'px-6 py-3 text-lg gap-2.5';
            iconSizeClasses = 'h-6 w-6';
            break;
        default:
            sizeClasses = 'px-4 py-2 text-base gap-2';
            iconSizeClasses = 'h-5 w-5';
    }

    // Disabled state styling
    const disabledClasses = disabled
        ? 'opacity-60 cursor-not-allowed pointer-events-none'
        : '';

    // Combine all classes
    const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`.trim();

    // Clone icons to add dynamic size classes
    const renderIcon = (icon: ReactElement) => {
        return React.cloneElement(icon, {
            className: `${(icon.props as any).className || ''} ${iconSizeClasses}`.trim(),
        } as any);
    };

    return (
        <button className={combinedClasses} disabled={disabled} {...props}>
            {iconLeft && renderIcon(iconLeft)}
            {children}
            {iconRight && renderIcon(iconRight)}
        </button>
    );
};

export default Button;
