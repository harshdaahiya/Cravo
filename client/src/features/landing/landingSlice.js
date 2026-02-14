import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';
import { checkAuthStatus } from '../auth/authSlice';
import { setUserLocation } from '../location/locationSlice';

export const initializeApplication = createAsyncThunk(
  'landingPage/initializeApplication',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(checkAuthStatus());

      const [citiesRes, categoriesRes, ipLocationRes] = await Promise.all([
        axiosInstance.get(API.CITIES.GET_ALL_CITIES),
        axiosInstance.get(API.CATEGORIES.GET_ALL_CATEGORIES),
        // axios.get('http://ip-api.com/json', { withCredentials: false }),
        axiosInstance.get(API.LOCATION.USER_IP_LOCATION),
      ]);

      const cities = citiesRes.data.data.cities;
      const categories = categoriesRes.data.data.categories;
      console.log('api location res', ipLocationRes);
      const { lat, lon, city, country, countryCode, region, regionName, zip } =
        ipLocationRes.data.data.location || ipLocationRes.data.data;
      // const { city, country, countryCode, region, regionName, zip } =
      //   ipLocationRes.data;
      // const lat = 23.2599;
      // const lon = 77.4126;
      // console.log(lat, lon, city, country, countryCode);

      dispatch(
        setUserLocation({
          lat: lat,
          lon: lon,
          city: city,
          country: country,
          countryCode: countryCode,
          region: region,
          regionName: region,
          zip: zip,
        })
      );
      // Make the final, dependent call for restaurants using the fetched location
      // const restaurantsRes = await axiosInstance.get(
      //   `${API.RESTAURANTS.RESTAURANTS_LIST}/?cityName=${encodeURIComponent(city)}/longitude=${lon}&latitude=${lat}&sort=rating&limit=15`
      // );
      // console.log('restaurants after the api call', restaurantsRes);
      const restaurantsRes = await axiosInstance.get(
        `${API.RESTAURANTS.RESTAURANTS_LIST}?cityName=${encodeURIComponent(city)}&sort=rating&limit=15`
      );
      const restaurants = restaurantsRes.data.data.restaurants;

      // Returning the combined payload for the fulfilled action
      return {
        cities,
        categories,
        restaurants,
      };
    } catch (err) {
      // Rejects the entire thunk if any of the concurrent calls fail.
      const errorMessage = err.response?.data?.message || err.message;
      console.error(
        'initializeApplication: UNEXPECTED critical error during app initialization!',
        err
      );
      return rejectWithValue(errorMessage);
    }
  }
);

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState: {
    data: {
      cities: [],
      categories: [],
      restaurants: [],
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initializeApplication.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(initializeApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch landing page data.';
        // Clear previous data on failure
        state.data = { cities: [], categories: [], restaurants: [] };
      });
  },
});

export default landingPageSlice.reducer;
