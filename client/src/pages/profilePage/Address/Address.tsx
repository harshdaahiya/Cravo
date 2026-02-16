import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import AddressDeleteConfirmationModal from '../../../features/address/components/AddressDeleteModal';
import AddressModal from '../../../features/address/components/AddressModal';
import Icon from '../../../components/ui/Icon';
import { useAddressActions } from '../../../features/address/hooks/use-address-actions';
import AddressCard from './components/AddressCard';
import { RootState } from '../../../store';
import { IAddress } from '../../../types/domain-models';

const AddressPage: React.FC = () => {
    const { isAddressModalOpen, isDeleteAddressModalOpen } = useSelector(
        (state: RootState) => state.ui.address
    );

    const {
        list: userAddresses,
        loading,
        error,
    } = useSelector((state: RootState) => state.address);

    const { handleOpenAddressModal } = useAddressActions();

    const [currentAddress, setCurrentAddress] = useState<IAddress | null>(null);

    const handleOpenEditModal = (address: IAddress) => {
        setCurrentAddress(address);
        handleOpenAddressModal();
    };

    if (loading === 'pending') {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
                <p className="text-text-secondary animate-pulse text-xl font-medium">
                    Loading addresses...
                </p>
            </div>
        );
    }

    if (loading === 'failed' && error) {
        return (
            <div className="bg-bg-subtle flex min-h-screen items-center justify-center">
                <p className="text-xl font-medium text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="text-text-main min-h-screen rounded-xl py-2">
            <div className="mx-auto px-4 sm:px-6 md:max-w-6xl lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Icon name="home" className="text-text-secondary h-9 w-9" />
                        <h1 className="text-text-main text-4xl font-extrabold">
                            Your Addresses
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            setCurrentAddress(null);
                            handleOpenAddressModal();
                        }}
                        className="bg-primary-hover focus:ring-opacity-75 transform cursor-pointer rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                        New
                    </button>
                </div>

                {userAddresses.length === 0 ? (
                    <div className="border-border rounded-xl border bg-white p-12 text-center shadow-md">
                        <p className="text-text-muted text-xl font-light">
                            You haven't saved any addresses yet. Add one to get started!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userAddresses.map(address => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                onEdit={handleOpenEditModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isAddressModalOpen && <AddressModal initialData={currentAddress} />}
            {isDeleteAddressModalOpen && <AddressDeleteConfirmationModal />}
        </div>
    );
};

export default AddressPage;
