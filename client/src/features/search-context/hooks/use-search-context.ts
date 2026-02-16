import { useCallback, useEffect, useRef, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import {
  fetchLocationSuggestions,
  fetchCurrentLocation,
  setConfirmedLocation,
  setCategoryName,
  setRestaurantName,
} from '../store/search-context-slice';
import { LocationSuggestion } from '../types/search-types';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const useSearchContext = () => {
  const dispatch = useDispatch<AppDispatch>();

  // --- Redux State (Source of Truth) ---
  const initialIpLocation = useSelector((state: RootState) => ({
    city: state.location.city,
    region: state.location.region,
    country: state.location.country,
    lat: state.location.lat,
    lng: state.location.lon,
  }));

  const {
    suggestions,
    loading: isLocationLoading,
    selectedLocation,
    categoryName,
    restaurantName,
  } = useSelector((state: RootState) => state.searchContext);

  // --- Local UI State (Temporary/Display) ---
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced function reference
  const debouncedFetchSuggestions = useRef(
    debounce((query: string) => dispatch(fetchLocationSuggestions(query)), 500)
  ).current;

  // --- Effects ---

  useEffect(() => {
    const { city, region, country, lat, lng } = initialIpLocation;

    if (city && lat && lng && !selectedLocation) {
      const initialName = `${city}, ${region}, ${country}`;

      const initialLocationObject: LocationSuggestion = {
        name: initialName,
        lat: lat,
        lng: lng,
        simpleCityName: city,
      };

      dispatch(setConfirmedLocation(initialLocationObject));
      setLocationSearchTerm(initialName);
    }
  }, [initialIpLocation, selectedLocation, dispatch]);

  useEffect(() => {
    if (selectedLocation) {
      setLocationSearchTerm(selectedLocation.name);
      setShowSuggestions(false);
    }
  }, [selectedLocation]);

  // --- Handlers ---

  const handleLocationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocationSearchTerm(value);
      setShowSuggestions(true);
      debouncedFetchSuggestions(value);
    },
    [debouncedFetchSuggestions]
  );

  const handleSelectLocation = useCallback(
    (location: LocationSuggestion) => {
      dispatch(setConfirmedLocation(location));
    },
    [dispatch]
  );

  const handleUseCurrentLocation = useCallback(() => {
    dispatch(fetchCurrentLocation());
  }, [dispatch]);

  const handleCategoryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setCategoryName(e.target.value));
    },
    [dispatch]
  );

  const handleRestaurantNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setRestaurantName(e.target.value));
    },
    [dispatch]
  );

  const handleInputFocus = useCallback(() => {
    setShowSuggestions(true);
  }, []);

  return {
    locationSearchTerm,
    suggestions,
    isLocationLoading,
    selectedLocation,
    showSuggestions,
    categoryName,
    restaurantName,
    initialPlaceholder: `${initialIpLocation.city}, ${initialIpLocation.region}, ${initialIpLocation.country}`,

    // Handlers
    handleLocationChange,
    handleSelectLocation,
    handleUseCurrentLocation,
    handleCategoryChange,
    handleRestaurantNameChange,
    handleInputFocus,
    setShowSuggestions,
  };
};
