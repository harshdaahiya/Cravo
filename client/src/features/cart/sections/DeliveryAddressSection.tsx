import React from 'react';
import { useSelector } from 'react-redux';

import AddressModal from '../../address/components/AddressModal';
import Icon from '../../../components/ui/Icon';
import { useAddressActions } from '../../address/hooks/use-address-actions';
import { IAddress } from '../../../types/domain-models';
import { RootState } from '../../../store';

interface DeliveryAddressSectionProps {
    addresses: IAddress[];
    selectedAddress: string | null;
    setSelectedAddress: (id: string) => void;
}

const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
    addresses,
    selectedAddress,
    setSelectedAddress,
}) => {
    const { isAddressModalOpen } = useSelector(
        (state: RootState) => state.ui.address
    );
    const { handleOpenAddressModal } = useAddressActions();

    return (
        <div className="rounded-3xl bg-background p-4 shadow-lg">
            <div className="flex items-center justify-between pb-1">
                <h2 className="text-foreground mb-3 text-xl font-bold">
                    Delivery Details
                </h2>
                <button
                    className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full p-2 text-xs font-bold"
                    onClick={() => {
                        handleOpenAddressModal();
                    }}
                >
                    <Icon name="plus" />
                </button>
            </div>

            <div className="space-y-3">
                {addresses.map(addr => (
                    <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`cursor-pointer rounded-xl p-3 transition-all duration-200 ${selectedAddress === addr._id ? 'border-border-focus border-2 bg-warning-muted' : 'bg-muted border border-transparent hover:bg-muted'}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background shadow">
                                {addr.addressType.toLowerCase() === 'home' ? (
                                    <Icon name="home" className="text-text-secondary h-4 w-4" />
                                ) : (
                                    <Icon
                                        name="building"
                                        className="text-text-secondary h-4 w-4"
                                    />
                                )}
                            </div>
                            <div className="flex-grow">
                                <p className="text-foreground font-semibold">
                                    {addr.addressType}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {addr.addressLine1}, {addr.addressLine2},
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isAddressModalOpen && <AddressModal />}
        </div>
    );
};

export default DeliveryAddressSection;
