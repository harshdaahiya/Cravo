import { IOrder } from '../../../types/domain-models';

export interface OrdersState {
  razorpayOrderData: any | null;
  isOrderCreationLoading: boolean;
  orderCreationError: string | null;

  isPaymentVerificationLoading: boolean;
  paymentVerificationError: string | null;
  paymentStatus: 'idle' | 'success' | 'failed';

  userOrders: IOrder[];
  selectedOrder: IOrder | null;
  isOrdersLoading: boolean;
  ordersError: string | null;
  isOrderDetailsLoading: boolean;
  orderDetailsError: string | null;
  isOrderActionLoading: boolean;
  orderActionError: string | null;
}

export interface OrderCreationResponse {
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  name: string;
  email: string;
}

export interface OrdersResponse {
  orders: IOrder[];
}

export interface OrderDetailResponse {
  order: IOrder;
}
