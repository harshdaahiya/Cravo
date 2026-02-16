import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
// @ts-ignore - Will migrate this later
import CustomToast from '../../../components/shared/toast/CustomToast';
import {
  createNewAddress,
  deleteAddress,
  fetchAllAddresses,
  updateAddress,
} from '../store/address-slice';
import {
  closeAddressModal,
  closeDeleteAddressModal,
  openAddressModal,
  openDeleteAddressModal,
} from '../../ui/store/ui-slice';
// @ts-ignore - Will migrate this later
import { useToastStack } from '../../ui/hooks/use-stack-toasts';

export const useAddressActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deleteId = useSelector((state: RootState) => state.ui.address.deleteAddressID);
  const { showStackedToast } = useToastStack();

  const handleFetchAllAddresses = () => {
    dispatch(fetchAllAddresses());
  };

  const handleCreateNewAddress = async (addressData: any) => {
    try {
      await dispatch(createNewAddress(addressData)).unwrap();
      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'New address created successfully',
            actionText: '',
            onActionClick: () => {},
          },
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Failed to create address:', error);
    }
  };

  const handleUpdateAddress = async (updatedData: any) => {
    const addressId = updatedData._id;
    const updates = updatedData;
    try {
      await dispatch(updateAddress({ addressId, updates })).unwrap();
      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'Address updated successfully',
            actionText: '',
            onActionClick: () => {},
          },
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await dispatch(deleteAddress(addressId)).unwrap();
      dispatch(closeDeleteAddressModal());
      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'Address has been Deleted',
            actionText: '',
            onActionClick: () => {},
          },
          { duration: 3000 }
        );
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleCloseDeleteAddressModal = () => {
    dispatch(closeDeleteAddressModal());
  };

  const handleOpenDeleteAddressModal = (addressId: string) => {
    dispatch(openDeleteAddressModal(addressId));
  };

  const handleCloseAddressModal = () => {
    dispatch(closeAddressModal());
  };

  const handleOpenAddressModal = (payload?: any) => {
    dispatch(openAddressModal(payload));
  };

  return {
    handleFetchAllAddresses,
    handleCreateNewAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleOpenDeleteAddressModal,
    handleCloseDeleteAddressModal,
    handleOpenAddressModal,
    handleCloseAddressModal,
    deleteId,
  };
};
