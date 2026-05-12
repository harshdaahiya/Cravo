import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAddressActions } from '../hooks/use-address-actions';
import { IAddress } from '../../../types/domain-models';

interface AddressModalProps {
    initialData?: Partial<IAddress>;
}

const AddressModal: React.FC<AddressModalProps> = ({ initialData }) => {
    const [formData, setFormData] = useState<Partial<IAddress>>(
        initialData || {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            addressType: 'Home',
            isDefault: false,
        }
    );

    const {
        handleCloseAddressModal,
        handleCreateNewAddress,
        handleUpdateAddress,
    } = useAddressActions();

    // Note: isAddressModalOpen is handled by the parent or UI state, 
    // but we can access it here if needed for internal logic.
    // const { isAddressModalOpen } = useSelector((state: RootState) => state.ui.address);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (initialData?._id) {
            handleUpdateAddress(formData as IAddress);
        } else {
            handleCreateNewAddress(formData);
        }
        handleCloseAddressModal();
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-2xl">
                <h2 className="text-foreground mb-4 text-2xl font-bold">
                    {initialData?._id ? 'Edit Address' : 'Add New Address'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="Address Line 1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            required
                            className="bg-muted text-foreground col-span-2 rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Address Line 2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            className="bg-muted text-foreground col-span-2 rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="bg-muted text-foreground rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className="bg-muted text-foreground rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <input
                            type="text"
                            name="zipCode"
                            placeholder="ZIP Code"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="bg-muted text-foreground rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                            className="bg-muted text-foreground rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                        />

                        <div className="col-span-2 flex items-center gap-4">
                            <label htmlFor="addressType" className="text-text-secondary">
                                Type:
                            </label>

                            <select
                                name="addressType"
                                id="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                                className="bg-muted text-foreground rounded-lg border border-border p-3 focus:border-ring focus:ring-ring outline-none"
                            >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="col-span-2 flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="isDefault"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-border bg-muted text-primary focus:ring-ring cursor-pointer"
                            />

                            <label
                                htmlFor="isDefault"
                                className="text-text-secondary select-none cursor-pointer"
                            >
                                Set as default address
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseAddressModal}
                            className="text-foreground cursor-pointer rounded-lg bg-muted px-6 py-3 transition-colors hover:bg-muted"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-lg px-6 py-3 text-white transition-colors"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
