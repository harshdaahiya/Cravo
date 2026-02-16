import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { RestaurantMenuState, RestaurantMenuResponse } from '../types/menu-types';

const initialState: RestaurantMenuState = {
  menus: {},
};

export const fetchRestaurantMenu = createAsyncThunk<
  { restaurantId: string; data: RestaurantMenuResponse },
  string,
  { rejectValue: any; state: { restaurantMenu: RestaurantMenuState } }
>(
  'restaurantMenu/fetch',
  async (restaurantId, thunkAPI) => {
    const { menus } = thunkAPI.getState().restaurantMenu;
    const cachedData = menus[restaurantId];

    if (cachedData && cachedData.products && cachedData.products.length > 0) {
      return thunkAPI.rejectWithValue({
        isCacheHit: true,
        data: {
          restaurant: cachedData.restaurant,
          products: cachedData.products,
        },
      });
    }

    try {
      const response = await axiosInstance.get<ApiResponse<RestaurantMenuResponse>>(
        API_ENDPOINTS.RESTAURANTS.PRODUCTS(restaurantId)
      );

      if (response.status === 200 && response.data.success) {
        return { restaurantId, data: response.data.data };
      } else {
        return thunkAPI.rejectWithValue(
          response.data.message || 'Failed to load restaurant data.'
        );
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        'Failed to fetch restaurant data. Please check your connection.'
      );
    }
  }
);

const restaurantMenuSlice = createSlice({
  name: 'restaurantMenu',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRestaurantMenu.pending, (state, action) => {
        const restaurantId = action.meta.arg;
        if (!state.menus[restaurantId]) {
          state.menus[restaurantId] = {
            restaurant: null,
            products: [],
          };
        }
        state.menus[restaurantId].loading = 'pending';
        state.menus[restaurantId].error = null;
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action: PayloadAction<{ restaurantId: string; data: RestaurantMenuResponse }>) => {
        const { restaurantId, data } = action.payload;
        state.menus[restaurantId] = {
          restaurant: data.restaurant,
          products: data.products,
          loading: 'succeeded',
          error: null,
        };
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        const restaurantId = action.meta.arg;
        const payload = action.payload as any;

        if (payload && payload.isCacheHit) {
          if (state.menus[restaurantId]) {
            state.menus[restaurantId].loading = 'succeeded';
            state.menus[restaurantId].error = null;
          }
          return;
        }

        if (state.menus[restaurantId]) {
          state.menus[restaurantId].loading = 'failed';
          state.menus[restaurantId].error = payload || 'An unknown error occurred.';
        } else {
          state.menus[restaurantId] = {
            restaurant: null,
            products: [],
            loading: 'failed',
            error: payload || 'An unknown error occurred.',
          };
        }
      });
  },
});

export default restaurantMenuSlice.reducer;
