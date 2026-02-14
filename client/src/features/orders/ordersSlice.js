import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';

// --- Initial State ---
const initialState = {
  // State for the checkout process (Phase 1: Creating the Order)
  razorpayOrderData: null,
  isOrderCreationLoading: false,
  orderCreationError: null,

  // State for the payment verification process (Phase 2: Verifying Payment)
  isPaymentVerificationLoading: false,
  paymentVerificationError: null,
  paymentStatus: 'idle', // 'idle', 'success', 'failed'

  // State for Orders Management
  userOrders: [],
  selectedOrder: null,
  isOrdersLoading: false,
  ordersError: null,
  isOrderDetailsLoading: false,
  orderDetailsError: null,
  isOrderActionLoading: false,
  orderActionError: null,
};

// --- Async Thunks ---

/**
 * Thunk to initiate the order on the backend.
 * * @param {object} orderPayload - Contains required data like delivery address,
 * payment method choice, and user details (optional if inferred on backend).
 * @returns {object} The response data, e.g., { razorpayOrderId, keyId, amount, name, email }
 */
export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API.ORDERS.CHECKOUT,
        orderPayload
      );
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create order.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk to verify the payment signature after the Razorpay modal is successful.
 */
export const verifyPaymentThunk = createAsyncThunk(
  'order/verifyPayment',
  async (verificationPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API.PAYMENTS.VERIFY_PAYMENT,
        verificationPayload
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Payment verification failed.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk to fetch all orders for the currently logged-in user.
 * @returns {Array} An array of user order objects.
 */
export const AllUserOrdersThunk = createAsyncThunk(
  'order/getAllUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.ORDERS.ALL_USER_ORDERS);
      // console.log('response', response);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch user orders.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk to fetch the detailed information for a specific order.
 * @param {string} orderId - The ID of the order to fetch details for.
 * @returns {object} The detailed order object.
 */
export const getOrderDetailThunk = createAsyncThunk(
  'order/getOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API.ORDERS.ORDER_DETAILS(orderId)}`
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to fetch order details.';
      return rejectWithValue(message);
    }
  }
);

/**
 * Thunk to send a request to the backend to cancel a user's order.
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {object} The response data, typically the updated (cancelled) order object.
 */

export const cancelOrderThunk = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${API.ORDERS.CANCEL_ORDER(orderId)}`
      );
      console.log('response after deletion', response);
      return response.data.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to cancel order.';
      console.log('error', error);
      return rejectWithValue(message);
    }
  }
);

// --- Order Slice Definition ---
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Synchronous reducers
    clearOrderState: state => {
      state.razorpayOrderData = null;
      state.isOrderCreationLoading = false;
      state.orderCreationError = null;
      state.paymentStatus = 'idle';
      // Also clear order management state
      state.ordersError = null;
      state.orderDetailsError = null;
      state.orderActionError = null;
    },
  },
  extraReducers: builder => {
    // --- Handlers for createOrderThunk ---

    builder
      .addCase(createOrderThunk.pending, state => {
        state.isOrderCreationLoading = true;
        state.orderCreationError = null;
        state.razorpayOrderData = null;
        state.paymentStatus = 'idle';
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isOrderCreationLoading = false;
        state.razorpayOrderData = action.payload;
        state.orderCreationError = null;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isOrderCreationLoading = false;
        state.razorpayOrderData = null;
        state.orderCreationError = action.payload || action.error.message;
        state.paymentStatus = 'failed';
      })

      // --- Handlers for verifyPaymentThunk ---

      .addCase(verifyPaymentThunk.pending, state => {
        state.isPaymentVerificationLoading = true;
        state.paymentVerificationError = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.isPaymentVerificationLoading = false;
        state.paymentStatus = 'success';
        state.paymentVerificationError = null;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.isPaymentVerificationLoading = false;
        state.paymentStatus = 'failed';
        state.paymentVerificationError = action.payload || action.error.message;
      })

      // --- Handlers for getAllUserOrdersThunk ---
      .addCase(AllUserOrdersThunk.pending, state => {
        state.isOrdersLoading = true;
        state.ordersError = null;
      })
      .addCase(AllUserOrdersThunk.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = action.payload.orders || action.payload; // Store the list of orders
        state.ordersError = null;
      })
      .addCase(AllUserOrdersThunk.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = [];
        state.ordersError = action.payload || action.error.message;
      })

      // --- Handlers for getOrderDetailThunk ---
      .addCase(getOrderDetailThunk.pending, state => {
        state.isOrderDetailsLoading = true;
        state.orderDetailsError = null;
        state.selectedOrder = null;
      })
      .addCase(getOrderDetailThunk.fulfilled, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.selectedOrder = action.payload.data?.order || action.payload.data || action.payload; // Store the detailed order
        state.orderDetailsError = null;
      })
      .addCase(getOrderDetailThunk.rejected, (state, action) => {
        state.isOrderDetailsLoading = false;
        state.selectedOrder = null;
        state.orderDetailsError = action.payload || action.error.message;
      })

      // --- Handlers for cancelOrderThunk ---
      .addCase(cancelOrderThunk.pending, state => {
        state.isOrderActionLoading = true;
        state.orderActionError = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.isOrderActionLoading = false;
        state.orderActionError = null;
        // Update the specific order in the list and selectedOrder state
        const updatedOrder = action.payload.order || action.payload;

        // Update userOrders list
        const index = state.userOrders.findIndex(
          order =>
            order._id === updatedOrder._id || order.id === updatedOrder.id
        );
        if (index !== -1) {
          state.userOrders[index] = updatedOrder;
        }

        // Update selectedOrder if it's the one that was cancelled
        if (
          state.selectedOrder &&
          (state.selectedOrder._id === updatedOrder._id ||
            state.selectedOrder.id === updatedOrder.id)
        ) {
          state.selectedOrder = updatedOrder;
        }
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.isOrderActionLoading = false;
        state.orderActionError = action.payload || action.error.message;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
