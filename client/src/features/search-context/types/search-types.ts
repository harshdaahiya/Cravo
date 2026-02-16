export interface LocationSuggestion {
  name: string;
  lat: number;
  lng: number;
  simpleCityName: string;
}

export interface SearchContextState {
  suggestions: LocationSuggestion[];
  loading: boolean;
  error: string | null;
  selectedLocation: LocationSuggestion | null;
  restaurantName: string;
  categoryName: string;
}
