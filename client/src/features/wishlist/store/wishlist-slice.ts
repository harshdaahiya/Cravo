import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { IWishlist } from '../../../types/domain-models';
import { WishlistState } from '../types/wishlist-types';

const initialState: WishlistState = {
  lists: [],
  isLoading: false,
  error: null,
};

export const fetchAllWishlists = createAsyncThunk<
  IWishlist[],
  void,
  { rejectValue: string }
>('wishlist/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<{ lists: IWishlist[] }>>(
      API_ENDPOINTS.WISHLIST.GET_ALL_RESTAURANTS_LIST
    );
    return response.data.data.lists;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlists.');
  }
});

export const createWishlist = createAsyncThunk<
  IWishlist,
  { name: string; description?: string; isPublic?: boolean },
  { rejectValue: string }
>('wishlist/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ list: IWishlist }>>(
      API_ENDPOINTS.WISHLIST.CREATE_NEW_RESTAURANT_LIST,
      payload
    );
    return response.data.data.list;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create wishlist.');
  }
});

export const addRestaurantToWishlist = createAsyncThunk<
  IWishlist,
  { listId: string; restaurantId: string },
  { rejectValue: string }
>('wishlist/addRestaurant', async ({ listId, restaurantId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ list: IWishlist }>>(
      API_ENDPOINTS.WISHLIST.ADD_ITEM_TO_RESTAURANT_LIST(listId),
      { restaurantId }
    );
    return response.data.data.list;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add restaurant.');
  }
});

export const removeRestaurantFromWishlist = createAsyncThunk<
  IWishlist,
  { listId: string; restaurantId: string },
  { rejectValue: string }
>('wishlist/removeRestaurant', async ({ listId, restaurantId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<{ list: IWishlist }>>(
      API_ENDPOINTS.WISHLIST.REMOVE_ITEM_FROM_RESTAURANT_LIST(listId),
      { data: { restaurantId } }
    );
    return response.data.data.list;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove restaurant.');
  }
});

export const addProductToWishlist = createAsyncThunk<
  IWishlist,
  { listId: string; productId: string },
  { rejectValue: string }
>('wishlist/addProduct', async ({ listId, productId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ list: IWishlist }>>(
      API_ENDPOINTS.WISHLIST.ADD_ITEM_TO_PRODUCT_LIST(listId),
      { productId }
    );
    return response.data.data.list;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add product.');
  }
});

export const removeProductFromWishlist = createAsyncThunk<
  IWishlist,
  { listId: string; productId: string },
  { rejectValue: string }
>('wishlist/removeProduct', async ({ listId, productId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ApiResponse<{ list: IWishlist }>>(
      API_ENDPOINTS.WISHLIST.REMOVE_ITEM_FROM_PRODUCT_LIST(listId),
      { data: { productId } }
    );
    return response.data.data.list;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove product.');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAllWishlists.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllWishlists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists = action.payload;
      })
      .addCase(fetchAllWishlists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      .addMatcher(
        action => 
          [
            addRestaurantToWishlist.fulfilled.type,
            removeRestaurantFromWishlist.fulfilled.type,
            addProductToWishlist.fulfilled.type,
            removeProductFromWishlist.fulfilled.type,
          ].includes(action.type),
        (state, action: PayloadAction<IWishlist>) => {
          const index = state.lists.findIndex(l => l._id === action.payload._id);
          if (index !== -1) {
            state.lists[index] = action.payload;
          }
        }
      );
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
