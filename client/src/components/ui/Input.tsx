import React, { InputHTMLAttributes, ReactElement } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    iconLeft?: ReactElement;
    iconRight?: ReactElement;
    error?: string;
    labelClassName?: string;
}

/**
 * Reusable Input component with label, icon, and error handling.
 */
const Input: React.FC<InputProps> = ({
    id,
    label,
    iconLeft,
    iconRight,
    error,
    type = 'text',
    className = '',
    labelClassName = '',
    ...props
}) => {
    // Base input styling
    const baseInputClasses = `
    block w-full py-3 border border-cream rounded-lg focus:ring-1 focus:ring-yellow-400 text-charcoal placeholder-medium-gray
    transition-all duration-200
    ${iconLeft ? 'pl-10' : 'pl-3'}
    ${iconRight ? 'pr-10' : 'pr-3'}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
  `.trim();

    // Combined classes for the input element
    const combinedInputClasses = `${baseInputClasses} ${className}`.trim();

    // Classes for the label element
    const combinedLabelClasses = `block text-sm font-medium text-coffee mb-2 ${labelClassName}`.trim();

    // For dynamically sizing icons within the input
    const iconSizeClasses = 'h-5 w-5';

    const renderIcon = (icon: ReactElement) => {
        return React.cloneElement(icon, {
            className: `${(icon.props as any).className || ''} ${iconSizeClasses}`.trim(),
        } as any);
    };

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className={combinedLabelClasses}>
                    {label}
                </label>
            )}
            <div className="relative">
                {iconLeft && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {renderIcon(iconLeft)}
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    className={combinedInputClasses}
                    {...props}
                />
                {iconRight && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        {renderIcon(iconRight)}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm font-medium text-red-500">{error}</p>
            )}
        </div>
    );
};

export default Input;
