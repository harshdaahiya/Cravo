import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { IOrder } from '../../../types/domain-models';
import {
  OrdersState,
  OrderCreationResponse,
  OrdersResponse,
  OrderDetailResponse,
} from '../types/order-types';

const initialState: OrdersState = {
  razorpayOrderData: null,
  isOrderCreationLoading: false,
  orderCreationError: null,

  isPaymentVerificationLoading: false,
  paymentVerificationError: null,
  paymentStatus: 'idle',

  userOrders: [],
  selectedOrder: null,
  isOrdersLoading: false,
  ordersError: null,
  isOrderDetailsLoading: false,
  orderDetailsError: null,
  isOrderActionLoading: false,
  orderActionError: null,
};

export const createOrderThunk = createAsyncThunk<
  OrderCreationResponse,
  any,
  { rejectValue: string }
>('order/createOrder', async (orderPayload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<OrderCreationResponse>>(
      API_ENDPOINTS.ORDERS.CHECKOUT,
      orderPayload
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to create order.';
    return rejectWithValue(message);
  }
});

export const verifyPaymentThunk = createAsyncThunk<
  ApiResponse<any>,
  any,
  { rejectValue: string }
>('order/verifyPayment', async (verificationPayload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ApiResponse<any>>(
      API_ENDPOINTS.PAYMENTS.VERIFY_PAYMENT,
      verificationPayload
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Payment verification failed.';
    return rejectWithValue(message);
  }
});

export const AllUserOrdersThunk = createAsyncThunk<
  OrdersResponse,
  void,
  { rejectValue: string }
>('order/getAllUserOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<OrdersResponse>>(
      API_ENDPOINTS.ORDERS.ALL_USER_ORDERS
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch user orders.';
    return rejectWithValue(message);
  }
});

export const getOrderDetailThunk = createAsyncThunk<
  ApiResponse<OrderDetailResponse>,
  string,
  { rejectValue: string }
>('order/getOrderDetail', async (orderId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ApiResponse<OrderDetailResponse>>(
      API_ENDPOINTS.ORDERS.ORDER_DETAILS(orderId)
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch order details.';
    return rejectWithValue(message);
  }
});

export const cancelOrderThunk = createAsyncThunk<
  { order: IOrder },
  string,
  { rejectValue: string }
>('order/cancelOrder', async (orderId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch<ApiResponse<{ order: IOrder }>>(
      API_ENDPOINTS.ORDERS.CANCEL_ORDER(orderId)
    );
    return response.data.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to cancel order.';
    return rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: state => {
      state.razorpayOrderData = null;
      state.isOrderCreationLoading = false;
      state.orderCreationError = null;
      state.paymentStatus = 'idle';
      state.ordersError = null;
      state.orderDetailsError = null;
      state.orderActionError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createOrderThunk.pending, state => {
        state.isOrderCreationLoading = true;
        state.orderCreationError = null;
        state.razorpayOrderData = null;
        state.paymentStatus = 'idle';
      })
      .addCase(createOrderThunk.fulfilled, (state, action: PayloadAction<OrderCreationResponse>) => {
        state.isOrderCreationLoading = false;
        state.razorpayOrderData = action.payload;
        state.orderCreationError = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isOrderCreationLoading = false;
        state.razorpayOrderData = null;
        state.orderCreationError = (action.payload as string) || 'An error occurred';
        state.paymentStatus = 'failed';
      })
      .addCase(verifyPaymentThunk.pending, state => {
        state.isPaymentVerificationLoading = true;
        state.paymentVerificationError = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state) => {
        state.isPaymentVerificationLoading = false;
        state.paymentStatus = 'success';
        state.paymentVerificationError = null;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.isPaymentVerificationLoading = false;
        state.paymentStatus = 'failed';
        state.paymentVerificationError = (action.payload as string) || 'An error occurred';
      })
      .addCase(AllUserOrdersThunk.pending, state => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(AllUserOrdersThunk.fulfilled, (state, action: PayloadAction<OrdersResponse>) => {
        state.isOrdersLoading = false;
        state.userOrders = action.payload.orders;
        state.ordersError = null;
      })
      .addCase(AllUserOrdersThunk.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = [];
        state.ordersError = (action.payload as string) || 'An error occurred';
      })
      .addCase(getOrderDetailThunk.pending, state => {
        state.isOrderDetailsLoading = true;
        state.orderDetailsError = null;
        state.selectedOrder = null;
      })
      .addCase(getOrderDetailThunk.fulfilled, (state, action: PayloadAction<ApiResponse<OrderDetailResponse>>) => {
        state.isOrderDetailsLoading = false;
        state.selectedOrder = action.payload.data.order;
        state.orderDetailsError = null;
      })
      .addCase(getOrderDetailThunk.rejected, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.selectedOrder = null;
        state.orderDetailsError = (action.payload as string) || 'An error occurred';
      })
      .addCase(cancelOrderThunk.pending, state => {
        state.isOrderActionLoading = true;
        state.orderActionError = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action: PayloadAction<{ order: IOrder }>) => {
        state.isOrderActionLoading = false;
        state.orderActionError = null;
        const updatedOrder = action.payload.order;
        const index = state.userOrders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.userOrders[index] = updatedOrder;
        }
        if (state.selectedOrder && state.selectedOrder._id === updatedOrder._id) {
          state.selectedOrder = updatedOrder;
        }
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.isOrderActionLoading = false;
        state.orderActionError = (action.payload as string) || 'An error occurred';
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
