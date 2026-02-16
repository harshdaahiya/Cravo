import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { openWishlistModal } from '../../ui/store/ui-slice';
import {
  addRestaurantToWishlist,
  removeRestaurantFromWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  createWishlist,
  fetchAllWishlists,
} from '../store/wishlist-slice';
import { WishlistState } from '../types/wishlist-types';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
// @ts-ignore - Will migrate this later
import CustomToast from '../../../components/shared/toast/CustomToast';
// @ts-ignore - Will migrate this later
import { useToastStack } from '../../ui/hooks/use-stack-toasts';

export const useWishlistActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lists, isLoading } = useSelector((state: RootState) => state.wishlist as WishlistState);
  const { showStackedToast } = useToastStack();

  const handleAddItemToWishlist = async ({
    listId,
    itemId,
    itemType,
    itemName,
    listName,
  }: {
    listId: string;
    itemId: string;
    itemType: 'product' | 'restaurant';
    itemName: string;
    listName: string;
  }) => {
    try {
      if (itemType === 'restaurant') {
        await dispatch(
          addRestaurantToWishlist({ listId, restaurantId: itemId })
        ).unwrap();
      } else {
        await dispatch(
          addProductToWishlist({ listId, productId: itemId })
        ).unwrap();
      }

      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: `${itemName} added to the ${listName}`,
            actionText: 'Change List',
            onActionClick: () => {
              dispatch(
                openWishlistModal({
                  productId: itemId,
                  sourceListId: listId,
                })
              );
            },
          },
          { duration: 3000 }
        );
      }
    } catch (error) {
      toast.error('Failed to add item to wishlist. Please try again.');
    }
  };

  const handleRemoveItemFromWishlist = async ({
    listId,
    itemId,
    itemType,
    itemName,
    listName,
  }: {
    listId: string;
    itemId: string;
    itemType: 'product' | 'restaurant';
    itemName: string;
    listName: string;
  }) => {
    try {
      if (itemType === 'restaurant') {
        await dispatch(
          removeRestaurantFromWishlist({ listId, restaurantId: itemId })
        ).unwrap();
      } else {
        await dispatch(
          removeProductFromWishlist({ listId, productId: itemId })
        ).unwrap();
      }

      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: `${itemName} removed from ${listName}`,
            actionText: '',
            onActionClick: () => {
              dispatch(openWishlistModal({}));
            },
          },
          { duration: 6000 }
        );
      }
    } catch (error) {}
  };

  const handleCreateWishlist = async ({ name, description, isPublic }: { name: string; description?: string; isPublic?: boolean }) => {
    try {
      await dispatch(createWishlist({ name, description, isPublic })).unwrap();
    } catch (error) {}
  };

  const handleTransferProductFromList = async ({
    productId,
    sourceListId,
    destinationListId,
  }: {
    productId: string;
    sourceListId: string;
    destinationListId: string;
  }) => {
    try {
      await axiosInstance.post(
        API_ENDPOINTS.WISHLIST.TRANSFER_ITEM(sourceListId),
        { productId, destinationListId }
      );
      dispatch(fetchAllWishlists());
    } catch (error) {
      console.error('Failed to transfer product:', error);
    }
  };

  return {
    lists,
    isLoading,
    handleAddItemToWishlist,
    handleRemoveItemFromWishlist,
    handleCreateWishlist,
    handleTransferProductFromList,
  };
};
