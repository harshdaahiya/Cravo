import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../store';

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  [selectCartState],
  cart => cart.items
);

// A memoized selector that gets the total quantity directly from the state,
export const selectCartTotalQuantity = createSelector(
  [selectCartState],
  cart => cart.totalQuantity
);

// A memoized selector that gets the total price directly from the state.
export const selectCartTotalValue = createSelector(
  [selectCartState],
  cart => cart.totalPrice
);
