import React from 'react';
import Icon, { IconName } from '../../../components/ui/Icon';

interface Address {
    type: string;
    icon: IconName;
    isDefault: boolean;
    address: string;
    city: string;
    landmark?: string;
}

interface CartAddressCardProps {
    address: Address;
    isSelected: boolean;
    onClick: () => void;
}

const CartAddressCard: React.FC<CartAddressCardProps> = ({ address, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${isSelected
                ? 'border-border-focus bg-yellow-50'
                : 'border-cream hover:border-gray-300'
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? 'bg-primary' : 'bg-gray-100'
                        }`}
                >
                    <Icon
                        name={address.icon}
                        className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-medium-gray'
                            }`}
                    />
                </div>
                <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        <span className="text-charcoal font-semibold">{address.type}</span>
                        {address.isDefault && (
                            <span className="bg-mint-green rounded-full px-2 py-0.5 text-xs text-white">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-charcoal text-sm">{address.address}</p>
                    <p className="text-medium-gray text-sm">{address.city}</p>
                    {address.landmark && (
                        <p className="text-medium-gray mt-1 text-xs">{address.landmark}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartAddressCard;
