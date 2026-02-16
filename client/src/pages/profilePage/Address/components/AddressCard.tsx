import React from 'react';
import { useAddressActions } from '../../../../features/address/hooks/use-address-actions';
import { IAddress } from '../../../../types/domain-models';

interface AddressCardProps {
    address: IAddress;
    onEdit: (address: IAddress) => void;
    onDelete?: (id: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit }) => {
    const { handleOpenDeleteAddressModal } = useAddressActions();

    return (
        <div className="group relative h-42 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-yellow-200 hover:shadow-lg sm:h-56">
            {/* Default Badge */}
            {address.isDefault && (
                <div className="absolute top-0 right-0">
                    <div className="to-primary-hover rounded-bl-lg bg-gradient-to-br from-yellow-400 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        Default
                    </div>
                </div>
            )}

            {/* Card Content */}
            <div className="flex h-full flex-col p-5 pt-7">
                {/* Address Type Header */}
                <div className="mb-3 flex items-center gap-2">
                    <div className="to-primary-hover h-5 w-1.5 rounded-full bg-gradient-to-b from-yellow-400"></div>
                    <h3 className="text-text-main truncate text-base font-semibold">
                        {address.addressType || 'Address'}
                    </h3>
                </div>

                {/* Address Details - Fixed height container */}
                <div className="text-text-secondary mb-4 min-h-0 flex-1 space-y-0.5 text-sm leading-snug">
                    <p className="text-text-main truncate font-medium">
                        {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                        <p className="truncate">{address.addressLine2}</p>
                    )}
                    <p className="truncate">
                        {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-text-muted truncate text-xs">{address.country}</p>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="mt-auto flex gap-4">
                    <button
                        onClick={() => onEdit(address)}
                        className="text-text-secondary bg-bg-subtle border-border cursor-pointer rounded-lg border px-5 py-2 text-sm font-medium transition-all duration-200 hover:border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:outline-none"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleOpenDeleteAddressModal(address._id)}
                        className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:outline-none"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Subtle hover accent */}
            <div className="to-primary-hover absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform bg-gradient-to-r from-yellow-400 transition-transform duration-300 group-hover:scale-x-100"></div>
        </div>
    );
};

export default AddressCard;
