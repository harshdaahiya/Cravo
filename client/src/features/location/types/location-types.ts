export interface LocationState {
  city: string;
  latitude: number | null;
  longitude: number | null;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  zip: string;
  source: string;
  isLoading: boolean;
  error: string | null;
}

export interface GeolocationCoords {
  lat: number;
  lng: number;
}

export interface IpLocationDetails {
  city: string;
  lat: number;
  lon: number;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  zip: string;
  source: string;
}
