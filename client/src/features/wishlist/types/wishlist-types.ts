import { IWishlist } from '../../../types/domain-models';

export interface WishlistState {
  lists: IWishlist[];
  isLoading: boolean;
  error: string | null;
}

export interface WishlistResponse {
  lists: IWishlist[];
}

export interface SingleWishlistResponse {
  list: IWishlist;
}
