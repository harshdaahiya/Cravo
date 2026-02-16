import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocationState {
  lat: number | null;
  lon: number | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  regionName: string | null;
  zip: string | null;
  isLocationSet: boolean;
}

const initialState: LocationState = {
  lat: null,
  lon: null,
  city: null,
  country: null,
  countryCode: null,
  region: null,
  regionName: null,
  zip: null,
  isLocationSet: false,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<Partial<LocationState>>) => {
      return {
        ...state,
        ...action.payload,
        isLocationSet: true,
      };
    },
    clearLocation: state => {
      return {
        ...initialState,
        isLocationSet: false,
      };
    },
  },
});

export const { setUserLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
