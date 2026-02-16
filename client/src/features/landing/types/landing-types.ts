import { ICity, ICategory, IRestaurant } from '../../../types/domain-models';

export interface LandingData {
  cities: ICity[];
  categories: ICategory[];
  restaurants: IRestaurant[];
}

export interface LandingPageState {
  data: LandingData;
  isLoading: boolean;
  error: string | null;
}
