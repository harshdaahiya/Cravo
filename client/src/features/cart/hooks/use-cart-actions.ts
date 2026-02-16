import { useDispatch } from 'react-redux';
import {
  addItemToCart,
  clearCart,
  fetchUserCart,
  removeItemFromCart,
  updateQuantity,
} from '../store/cart-slice';
import { closeDeleteModal, openDeleteModal } from '../../ui/store/ui-slice';
// @ts-ignore - Will migrate this later
import CustomToast from '../../../components/shared/toast/CustomToast';
// @ts-ignore - Will migrate this later
import { useToastStack } from '../../ui/hooks/use-stack-toasts';
import { AppDispatch } from '../../../store';

export const useCartActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showStackedToast } = useToastStack();

  const handleGetUserCart = () => {
    dispatch(fetchUserCart());
  };

  const handleAddToCart = (itemId: string) => {
    dispatch(
      addItemToCart({
        productId: itemId,
        quantity: 1,
        customizations: [],
      })
    );
  };

  const handleUpdateQuantity = ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  const handleDeleteItemFromCart = async ({ itemId, itemName }: { itemId: string; itemName: string }) => {
    try {
      await dispatch(removeItemFromCart({ itemId: itemId })).unwrap();
      dispatch(closeDeleteModal());
      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: `${itemName} has been removed from your cart`,
            actionText: '',
            onActionClick: () => {},
          },
          { duration: 3000 }
        );
      }
    } catch (error) {}
  };

  const handleOpenDeleteModal = (itemName: string, itemId: string) => {
    dispatch(
      openDeleteModal({
        itemName: itemName,
        itemId: itemId,
      })
    );
  };

  const handleCloseDeleteModal = () => {
    dispatch(closeDeleteModal());
  };

  const handleClearUserCart = () => {
    dispatch(clearCart());
  };

  return {
    handleGetUserCart,
    handleAddToCart,
    handleDeleteItemFromCart,
    handleUpdateQuantity,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleClearUserCart,
  };
};
