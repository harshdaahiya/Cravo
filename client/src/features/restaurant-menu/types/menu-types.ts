import { IRestaurant, IProduct } from '../../../types/domain-models';

export interface MenuData {
  restaurant: IRestaurant | null;
  products: IProduct[];
  loading?: 'idle' | 'pending' | 'succeeded' | 'failed';
  error?: string | null;
}

export interface RestaurantMenuState {
  menus: {
    [restaurantId: string]: MenuData;
  };
}

export interface RestaurantMenuResponse {
  restaurant: IRestaurant;
  products: IProduct[];
}
