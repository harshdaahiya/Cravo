import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchContextState, LocationSuggestion } from '../types/search-types';

const initialState: SearchContextState = {
  suggestions: [],
  loading: false,
  error: null,
  selectedLocation: null,
  restaurantName: '',
  categoryName: '',
};

export const fetchLocationSuggestions = createAsyncThunk<
  LocationSuggestion[],
  string,
  { rejectValue: string }
>(
  'locationSearch/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    if (query.length < 3) return [];

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5&accept-language=en`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions from OpenStreetMap');
      }
      const data = await response.json();

      return data.map((item: any) => {
        const address = item.address;
        const cityPart = address?.city || address?.town || address?.village || '';
        const placePart = address?.suburb || address?.road || address?.leisure || item.display_name.split(',')[0];

        let formattedName = item.display_name;
        if (cityPart && placePart) {
          formattedName = `${cityPart}, ${placePart}`;
        } else if (cityPart) {
          formattedName = cityPart;
        }

        return {
          name: formattedName,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          simpleCityName: cityPart || item.display_name.split(',')[0],
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentLocation = createAsyncThunk<
  LocationSuggestion,
  void,
  { rejectValue: string }
>(
  'locationSearch/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject('Geolocation not supported.');
      }

      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error('Failed to fetch address from OpenStreetMap');
            }
            const data = await response.json();

            const simpleCityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.display_name.split(',')[0];

            resolve({
              name: data.display_name,
              lat: latitude,
              lng: longitude,
              simpleCityName,
            });
          } catch (error) {
            reject('Reverse geocoding failed.');
          }
        },
        error => {
          reject(`Geolocation error: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }
);

const searchContextSlice = createSlice({
  name: 'searchContext',
  initialState,
  reducers: {
    setConfirmedLocation(state, action: PayloadAction<LocationSuggestion>) {
      state.selectedLocation = action.payload;
      state.suggestions = [];
      state.error = null;
    },
    clearSuggestions(state) {
      state.suggestions = [];
    },
    setCategoryName(state, action: PayloadAction<string>) {
      state.categoryName = action.payload;
    },
    setRestaurantName(state, action: PayloadAction<string>) {
      state.restaurantName = action.payload;
    },
    clearSearchContext(state) {
      state.selectedLocation = null;
      state.restaurantName = '';
      state.categoryName = '';
      state.suggestions = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLocationSuggestions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchLocationSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch suggestions.';
        state.suggestions = [];
      })
      .addCase(fetchCurrentLocation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLocation = action.payload;
        state.suggestions = [];
        state.error = null;
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.suggestions = [];
      });
  },
});

export const {
  setConfirmedLocation,
  clearSuggestions,
  setCategoryName,
  setRestaurantName,
  clearSearchContext,
} = searchContextSlice.actions;

export default searchContextSlice.reducer;
