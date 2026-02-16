import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';
import { WishlistState } from '../types/wishlist-types';

export const selectWishlistState = (state: RootState) => state.wishlist as WishlistState;

export const selectAllWishlists = createSelector(
  [selectWishlistState],
  (wishlist) => wishlist.lists
);

export const selectDefaultProductListId = createSelector(
  [selectAllWishlists],
  (lists) => lists.find(list => list.list_type === 'productList')?._id
);

export const selectDefaultRestaurantListId = createSelector(
  [selectAllWishlists],
  (lists) => lists.find(list => list.list_type === 'restaurantList')?._id
);

export const selectIsRestaurantInAnyRestaurantList = createSelector(
  [selectAllWishlists, (_: RootState, restaurantId: string) => restaurantId],
  (lists, restaurantId) => 
    lists.some(list => 
      list.list_type === 'restaurantList' && 
      list.restaurants?.some(r => 
        typeof r === 'string' ? r === restaurantId : r._id === restaurantId
      )
    )
);

export const selectIsProductInAnyProductList = createSelector(
  [selectAllWishlists, (_: RootState, productId: string) => productId],
  (lists, productId) => 
    lists.some(list => 
      list.list_type === 'productList' && 
      list.items?.some(p => 
        typeof p === 'string' ? p === productId : p._id === productId
      )
    )
);
