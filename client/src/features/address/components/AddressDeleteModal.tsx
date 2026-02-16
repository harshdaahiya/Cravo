import React from 'react';
import { useSelector } from 'react-redux';
import { useAddressActions } from '../hooks/use-address-actions';
import { RootState } from '../../../store';

const AddressDeleteModal: React.FC = () => {
    const { deleteAddressID } = useSelector((state: RootState) => state.ui.address);
    const { handleCloseDeleteAddressModal, handleDeleteAddress } = useAddressActions();

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
                <h2 className="text-text-main mb-4 text-2xl font-bold">
                    Confirm Deletion
                </h2>
                <p className="text-text-secondary mb-6">
                    Are you sure you want to delete this address? This action cannot be
                    undone.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleCloseDeleteAddressModal}
                        className="text-text-main cursor-pointer rounded-lg bg-gray-200 px-6 py-3 transition-colors hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteAddressID && handleDeleteAddress(deleteAddressID)}
                        className="cursor-pointer rounded-lg bg-red-500 px-6 py-3 text-white transition-colors hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddressDeleteModal;
