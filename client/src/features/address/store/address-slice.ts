import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { IAddress } from '../../../types/domain-models';
import { AddressState, AddressesResponse } from '../types/address-types';

const initialState: AddressState = {
  list: [],
  loading: 'idle',
  error: null,
};

export const fetchAllAddresses = createAsyncThunk<
  AddressesResponse,
  void,
  { rejectValue: string }
>(
  'address/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<ApiResponse<AddressesResponse>>(
        API_ENDPOINTS.ADDRESS.GET_ALL_ADDRESSES
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewAddress = createAsyncThunk<
  AddressesResponse,
  any,
  { rejectValue: string }
>(
  'address/createNew',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiResponse<AddressesResponse>>(
        API_ENDPOINTS.ADDRESS.CREATE_NEW_ADDRESS,
        addressData
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk<
  AddressesResponse,
  { addressId: string; updates: Partial<IAddress> },
  { rejectValue: string }
>(
  'address/updateExisting',
  async ({ addressId, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch<ApiResponse<AddressesResponse>>(
        API_ENDPOINTS.ADDRESS.UPDATE_ADDRESS(addressId),
        updates
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk<
  AddressesResponse,
  string,
  { rejectValue: string }
>(
  'address/delete',
  async (addressId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiResponse<AddressesResponse>>(
        API_ENDPOINTS.ADDRESS.DELETE_ADDRESS(addressId)
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllAddresses.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action: PayloadAction<AddressesResponse>) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses;
        state.error = null;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createNewAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(createNewAddress.fulfilled, (state, action: PayloadAction<AddressesResponse>) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses;
        state.error = null;
      })
      .addCase(createNewAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<AddressesResponse>) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteAddress.pending, state => {
        state.loading = 'pending';
      })
      .addCase(deleteAddress.fulfilled, (state, action: PayloadAction<AddressesResponse>) => {
        state.loading = 'succeeded';
        state.list = action.payload.addresses;
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default addressSlice.reducer;
