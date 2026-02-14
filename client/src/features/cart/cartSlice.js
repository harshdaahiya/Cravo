import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';

// Helper function to check if two customization arrays are equal
const areCustomizationsEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) return !arr1 && !arr2;
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = [...arr1].sort((a, b) =>
    a.optionName.localeCompare(b.optionName)
  );
  const sortedArr2 = [...arr2].sort((a, b) =>
    a.optionName.localeCompare(b.optionName)
  );

  return sortedArr1.every((item, index) => {
    const otherItem = sortedArr2[index];
    return (
      item.optionName === otherItem.optionName &&
      JSON.stringify(item.selectedItems) ===
      JSON.stringify(otherItem.selectedItems)
    );
  });
};

const initialState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk to fetch the user's cart from the backend.
export const fetchUserCart = createAsyncThunk(
  'cart/getUserCart',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(API.CART.GET_USER_CART);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk to add an item to the cart.
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async ({ productId, quantity, customizations }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(API.CART.ADD_ITEM_TO_CART, {
        productId: productId,
        quantity,
        customizations,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to remove an item from the cart.
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ itemId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(
        API.CART.REMOVE_ITEM_FROM_CART(itemId)
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to update an item's quantity.
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        API.CART.UPDATE_ITEM_QUANTITY(itemId),
        { quantity }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: builder => {
    builder
      // Reducers for the fetchUserCart thunk
      .addCase(fetchUserCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart || (action.payload?.items ? action.payload : { items: [], totalPrice: 0, totalQuantity: 0 });
        state.items = cart.items || [];
        state.totalPrice = cart.totalPrice || 0;
        state.totalQuantity = cart.totalQuantity || 0;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.items = [];
      })

      // Reducers for the addItemToCart thunk
      .addCase(addItemToCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const cart = action.payload.cart || action.payload;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Reducers for the removeItemFromCart thunk
      .addCase(removeItemFromCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart || action.payload;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Reducers for the updateQuantity thunk
      .addCase(updateQuantity.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart || action.payload;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
