import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';

// Initial state for the address feature
const initialState = {
  list: [], // An array to hold all of the user's addresses
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

// A thunk to fetch all addresses for the logged-in user
export const fetchAllAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(API.ADDRESS.GET_ALL_ADDRESSES);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk to create a new address
export const createNewAddress = createAsyncThunk(
  'address/createNew',
  async (addressData, thunkAPI) => {
    console.log('addressData inside createNewAddress thunk', addressData);
    try {
      const response = await axiosInstance.post(
        API.ADDRESS.CREATE_NEW_ADDRESS,
        addressData
      );
      // The API is designed to return the full updated list of addresses
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk to update an existing address
export const updateAddress = createAsyncThunk(
  'address/updateExisting',
  async ({ addressId, updates }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        API.ADDRESS.UPDATE_ADDRESS(addressId),
        updates
      );
      // The API is designed to return the full updated list of addresses
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// A thunk to delete an address
export const deleteAddress = createAsyncThunk(
  'address/delete',
  async (addressId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(
        API.ADDRESS.DELETE_ADDRESS(addressId)
      );
      // The API is designed to return the full updated list of addresses
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle fetching all addresses
      .addCase(fetchAllAddresses.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses || action.payload;
        state.error = null;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Handle creating a new address
      .addCase(createNewAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(createNewAddress.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses || action.payload;
        state.error = null;
      })
      .addCase(createNewAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Handle updating an address
      .addCase(updateAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses || action.payload;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })

      // Handle deleting an address
      .addCase(deleteAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses || action.payload;
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
