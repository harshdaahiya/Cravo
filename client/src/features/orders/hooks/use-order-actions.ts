import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
// @ts-ignore - Will migrate this later
import CustomToast from '../../../components/shared/toast/CustomToast';
import {
  cancelOrderThunk,
  clearOrderState,
  createOrderThunk,
  verifyPaymentThunk,
} from '../store/order-slice';
// @ts-ignore - Will migrate this later
import { useToastStack } from '../../ui/hooks/use-stack-toasts';

/**
 * Custom hook for dispatching order-related actions and handling side effects
 * like notifications for the checkout and payment process.
 */
export const useOrderActions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showStackedToast } = useToastStack();

  /**
   * Dispatches the thunk to create a new order on the backend (which generates the Razorpay Order ID).
   * @param orderPayload - The order details (cart items, address, total).
   */
  const handleCreateOrder = (orderPayload: any) => {
    return dispatch(createOrderThunk(orderPayload));
  };

  /**
   * Dispatches the thunk to verify the payment signature after the Razorpay modal is successful.
   * @param verificationPayload - Contains Razorpay IDs and signature.
   */
  const handleVerifyPayment = async (verificationPayload: any) => {
    try {
      await dispatch(verifyPaymentThunk(verificationPayload)).unwrap();

      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'Payment successfully verified! Your order is confirmed.',
            actionText: 'View Order',
            onActionClick: () => {
              /* Logic to navigate to order details */
            },
          },
          { duration: 5000 }
        );
      }
    } catch (error) {
      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'Order placed, but payment verification failed. Contact support.',
            actionText: '',
            onActionClick: () => {},
          },
          { duration: 3000 }
        );
      }
      console.error('Payment Verification Failed:', error);
    }
  };

  /**
   * Resets the order processing state in Redux.
   */
  const handleClearOrderState = () => {
    return dispatch(clearOrderState());
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await dispatch(cancelOrderThunk(orderId)).unwrap();

      if (showStackedToast) {
        showStackedToast(
          CustomToast,
          {
            message: 'Your Order has Cancelled Successfully.',
            actionText: 'View Order',
            onActionClick: () => {
              /* Logic to navigate to order details */
            },
          },
          { duration: 3000 }
        );
      }
    } catch (error) {}
  };

  return {
    handleCreateOrder,
    handleVerifyPayment,
    handleClearOrderState,
    handleCancelOrder,
  };
};
