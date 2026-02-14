import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';

// Initial state for the wishlist feature
const initialState = {
  lists: [], // An array to hold all of the user's wishlists (products & restaurants)
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

// A thunk to fetch all wishlists (products and restaurants) at once
export const fetchAllWishlists = createAsyncThunk(
  'wishlist/fetchAll',
  async (_, thunkAPI) => {
    try {
      const [productsResponse, restaurantsResponse] = await Promise.all([
        // Assuming you have separate API functions for fetching each list type
        axiosInstance.get(API.WISHLIST.GET_ALL_PRODUCTS_LIST),
        axiosInstance.get(API.WISHLIST.GET_ALL_RESTAURANTS_LIST),
      ]);

      // Use a utility function to combine the responses into a single, clean format
      const combinedLists = normalizeAndCombineLists(
        productsResponse.data.data.lists || productsResponse.data.data,
        restaurantsResponse.data.data.lists || restaurantsResponse.data.data
      );

      return combinedLists;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk to add a new item (product or restaurant) to a specific list
export const addItemToWishlist = createAsyncThunk(
  'wishlist/addItem',
  async ({ listId, itemId, itemType }, thunkAPI) => {
    try {
      let response;
      if (itemType === 'product') {
        response = await axiosInstance.post(
          API.WISHLIST.ADD_ITEM_TO_PRODUCT_LIST(listId),
          { productId: itemId }
        );
      } else if (itemType === 'restaurant') {
        response = await axiosInstance.post(
          API.WISHLIST.ADD_ITEM_TO_RESTAURANT_LIST(listId),
          { restaurantId: itemId }
        );
      }
      return response.data; // The API returns the updated list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk to remove an item (product or restaurant) from a specific list
export const removeItemFromWishlist = createAsyncThunk(
  'wishlist/removeItem',
  async ({ listId, itemId, itemType }, thunkAPI) => {
    try {
      let response;
      if (itemType === 'product') {
        response = await axiosInstance.delete(
          API.WISHLIST.REMOVE_ITEM_FROM_PRODUCT_LIST(listId),
          { data: { productId: itemId } }
        );
      } else if (itemType === 'restaurant') {
        response = await axiosInstance.delete(
          API.WISHLIST.REMOVE_ITEM_FROM_RESTAURANT_LIST(listId),
          { data: { restaurantId: itemId } }
        );
      }
      return response.data; // The API returns the updated list
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk for creating the new wishlist
export const createNewWishList = createAsyncThunk(
  'wishList/newProductList',
  async ({ listName, list_type }, thunkAPI) => {
    console.log('listName and the list_type in the thunk', listName, list_type);
    try {
      let response;
      if (list_type == 'productList') {
        response = await axiosInstance.post(
          API.WISHLIST.CREATE_NEW_PRODUCT_LIST,
          { name: listName }
        );
        console.log('response of the createNewProductList', response);
        return response.data;
      } else if (list_type == 'restaurantList') {
        response = await axiosInstance.post(
          API.WISHLIST.CREATE_NEW_RESTAURANT_LIST,
          { name: listName }
        );
        console.log('response of the createNewRestaurantList', response);
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk for tranfering prduct from one list to another list

export const TransferProductFromList = createAsyncThunk(
  'wishList/transferProduct',
  async ({ productId, sourceListId, destinationListId }, thunkAPI) => {
    try {
      let response;
      response = await axiosInstance.post(
        API.WISHLIST.TRANSFER_PRODUCT_FROM_LIST,
        { productId, sourceListId, destinationListId }
      );
      console.log('response of the TransferProductFromList', response);
      return response.data.data.lists || response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Helper Function to Normalize API Responses
const normalizeAndCombineLists = (productLists, restaurantLists) => {
  const combinedLists = {};

  // Process all product lists and standardize to 'items' key
  productLists.forEach(list => {
    combinedLists[list._id] = {
      ...list,
      // items: list.products || [], // Use 'items' as the standard key
      // The original 'products' key is now implicitly discarded
    };
  });

  // Process all restaurant lists and standardize to 'items' key
  restaurantLists.forEach(list => {
    // This part should not try to 'merge' lists with the same ID, as product and restaurant lists
    // have different IDs. It should just create a new entry.
    combinedLists[list._id] = {
      ...list,
      items: list.restaurants || [], // Use 'items' as the standard key
    };
  });

  return Object.values(combinedLists);
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle fetching all lists
      .addCase(fetchAllWishlists.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchAllWishlists.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.lists = action.payload; // Correctly sets the normalized lists
      })
      .addCase(fetchAllWishlists.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Handle adding and removing items
      .addCase(addItemToWishlist.fulfilled, (state, action) => {
        const updatedList = action.payload.data.list || action.payload.data;
        state.lists = state.lists.map(list =>
          list._id === updatedList._id
            ? {
              ...updatedList,
              // Check the list type from the API response and map it to the 'items' key
              items:
                updatedList.list_type === 'productList'
                  ? updatedList.items || updatedList.products
                  : updatedList.restaurants,
            }
            : list
        );
      })
      .addCase(removeItemFromWishlist.fulfilled, (state, action) => {
        const updatedList = action.payload.data.list || action.payload.data;
        state.lists = state.lists.map(list =>
          list._id === updatedList._id
            ? {
              ...updatedList,
              // Check the list type from the API response and map it to the 'items' key
              items:
                updatedList.list_type === 'productList'
                  ? updatedList.items || updatedList.products
                  : updatedList.restaurants,
            }
            : list
        );
      })

      // Handle creating new Product and Restaurants List
      .addCase(createNewWishList.fulfilled, (state, action) => {
        // Extract the new list object from the payload.
        const newList = action.payload.data.list || action.payload.data;

        // Create a new array by copying the existing lists and adding the new one.
        state.lists.push(newList);
      })

      // Handle transfering the product from list to antother list
      .addCase(TransferProductFromList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(TransferProductFromList.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(TransferProductFromList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
