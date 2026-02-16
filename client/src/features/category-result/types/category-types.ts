import { IRestaurant } from '../../../types/domain-models';

export interface CategoryResultState {
  currentCategorySlug: string | null;
  restaurants: IRestaurant[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

export interface CategoryRestaurantsResponse {
  restaurants: IRestaurant[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  categorySlug: string;
}
