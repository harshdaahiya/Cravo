import { ICartItem } from '../../../types/domain-models';

export interface CartState {
  items: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface CartResponse {
  cart: {
    items: ICartItem[];
    totalPrice: number;
    totalQuantity: number;
  };
}
