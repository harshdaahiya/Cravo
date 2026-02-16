import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { CartState, CartResponse } from '../types/cart-types';

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
  status: 'idle',
  error: null,
};

export const fetchUserCart = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>(
  'cart/getUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<CartResponse>>(API_ENDPOINTS.CART.GET_USER_CART);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk<
  CartResponse,
  { productId: string; quantity: number; customizations?: any[] },
  { rejectValue: string }
>(
  'cart/addItemToCart',
  async ({ productId, quantity, customizations }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<CartResponse>>(API_ENDPOINTS.CART.ADD_ITEM_TO_CART, {
        productId,
        quantity,
        customizations,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const removeItemFromCart = createAsyncThunk<
  CartResponse,
  { itemId: string },
  { rejectValue: string }
>(
  'cart/removeItem',
  async ({ itemId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiResponse<CartResponse>>(
        API_ENDPOINTS.CART.REMOVE_ITEM_FROM_CART(itemId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const updateQuantity = createAsyncThunk<
  CartResponse,
  { itemId: string; quantity: number },
  { rejectValue: string }
>(
  'cart/updateQuantity',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<ApiResponse<CartResponse>>(
        API_ENDPOINTS.CART.UPDATE_ITEM_QUANTITY(itemId),
        { quantity }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
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
      .addCase(fetchUserCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart;
        state.items = cart.items || [];
        state.totalPrice = cart.totalPrice || 0;
        state.totalQuantity = cart.totalQuantity || 0;
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.items = [];
      })
      .addCase(addItemToCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.status = 'succeeded';
        const cart = action.payload.cart;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeItemFromCart.pending, state => {
        state.status = 'loading';
      })
      .addCase(removeItemFromCart.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateQuantity.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.status = 'succeeded';
        state.error = null;
        const cart = action.payload.cart;
        state.items = cart.items;
        state.totalPrice = cart.totalPrice;
        state.totalQuantity = cart.totalQuantity;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartStatus = (state: { cart: CartState }) => state.cart.status;

export default cartSlice.reducer;
