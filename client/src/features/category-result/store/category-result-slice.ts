import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { CategoryResultState, CategoryRestaurantsResponse } from '../types/category-types';

const initialState: CategoryResultState = {
  currentCategorySlug: null,
  restaurants: [],
  isLoading: false,
  error: null,
  totalResults: 0,
  currentPage: 0,
  totalPages: 0,
};

export const fetchCategoryRestaurants = createAsyncThunk<
  CategoryRestaurantsResponse,
  { categorySlug: string; cityName?: string; latitude?: number; longitude?: number; page?: number; limit?: number },
  { rejectValue: string }
>(
  'categoryResult/fetchRestaurants',
  async (
    { categorySlug, cityName, latitude, longitude, page = 1, limit = 50 },
    { rejectWithValue }
  ) => {
    try {
      const apiUrl = `${API_ENDPOINTS.RESTAURANTS.RESTAURANTS_LIST}?categoryName=${categorySlug}&longitude=${longitude || ''}&latitude=${latitude || ''}&limit=${limit}&page=${page}`;
      const response = await axiosInstance.get<ApiResponse<any>>(apiUrl);

      const fetchedCurrentPage = Number(response.data.data.currentPage) || page;

      return {
        ...response.data.data,
        categorySlug,
        currentPage: fetchedCurrentPage,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch restaurants for this category.';
      return rejectWithValue(message);
    }
  }
);

const categoryResultSlice = createSlice({
  name: 'categoryResult',
  initialState,
  reducers: {
    clearCategoryResults: state => {
      state.restaurants = [];
      state.totalResults = 0;
      state.currentPage = 0;
      state.totalPages = 0;
      state.currentCategorySlug = null;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategoryRestaurants.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryRestaurants.fulfilled, (state, action: PayloadAction<CategoryRestaurantsResponse>) => {
        const {
          restaurants,
          totalResults,
          currentPage,
          totalPages,
          categorySlug,
        } = action.payload;

        state.isLoading = false;
        state.error = null;
        state.totalResults = totalResults;
        state.totalPages = totalPages;

        if (currentPage === 1) {
          state.restaurants = restaurants;
          state.currentPage = currentPage;
          state.currentCategorySlug = categorySlug;
        } else {
          if (currentPage === state.currentPage + 1) {
            state.restaurants.push(...restaurants);
            state.currentPage = currentPage;
            state.currentCategorySlug = categorySlug;
          }
        }
      })
      .addCase(fetchCategoryRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unknown error occurred.';
      });
  },
});

export const { clearCategoryResults } = categoryResultSlice.actions;
export default categoryResultSlice.reducer;
