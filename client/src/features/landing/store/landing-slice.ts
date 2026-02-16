import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { checkAuthStatus } from '../../auth/store/auth-slice';
import { setUserLocation } from '../../location/store/location-slice';
import { ICity, ICategory, IRestaurant } from '../../../types/domain-models';

export interface LandingPageState {
  data: {
    cities: ICity[];
    categories: ICategory[];
    restaurants: IRestaurant[];
  };
  isAppInitializing: boolean;
  appInitError: string | null;
}

const initialState: LandingPageState = {
  data: {
    cities: [],
    categories: [],
    restaurants: [],
  },
  isAppInitializing: false,
  appInitError: null,
};

export const initializeApplication = createAsyncThunk(
  'landingPage/initializeApplication',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(checkAuthStatus());

      const [citiesRes, categoriesRes, ipLocationRes] = await Promise.all([
        axiosInstance.get(API_ENDPOINTS.CITIES.GET_ALL_CITIES),
        axiosInstance.get(API_ENDPOINTS.CATEGORIES.GET_ALL_CATEGORIES),
        axiosInstance.get(API_ENDPOINTS.LOCATION.USER_IP_LOCATION),
      ]);

      const cities = citiesRes.data.data.cities;
      const categories = categoriesRes.data.data.categories;
      const { lat, lon, city, country, countryCode, zip } =
        ipLocationRes.data.data.location || ipLocationRes.data.data;

      dispatch(
        setUserLocation({
          lat: lat,
          lon: lon,
          city: city,
          country: country,
          countryCode: countryCode,
          region: '', // Added default as it might be missing
          regionName: '',
          zip: zip,
        })
      );

      const restaurantsRes = await axiosInstance.get(
        `${API_ENDPOINTS.RESTAURANTS.RESTAURANTS_LIST}?cityName=${encodeURIComponent(city)}&sort=rating&limit=15`
      );
      const restaurants = restaurantsRes.data.data.restaurants;

      return {
        cities,
        categories,
        restaurants,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initializeApplication.pending, state => {
        state.isAppInitializing = true;
        state.appInitError = null;
      })
      .addCase(initializeApplication.fulfilled, (state, action: PayloadAction<any>) => {
        state.isAppInitializing = false;
        state.data = action.payload;
        state.appInitError = null;
      })
      .addCase(initializeApplication.rejected, (state, action) => {
        state.isAppInitializing = false;
        state.appInitError = (action.payload as string) || 'Failed to fetch landing page data.';
        state.data = { cities: [], categories: [], restaurants: [] };
      });
  },
});

export default landingPageSlice.reducer;
