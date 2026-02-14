import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { orderRepository } from '../repositories/order-repository.js';
import { cartRepository } from '../repositories/cart-repository.js';
import { configService } from '../services/config-service.js';
import { OrderStatus, PaymentStatus } from '../models/order-model.js';

export class PaymentController extends BaseController {
  constructor() {
    super();
  }

  public verifyPayment = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return this.sendError(res, 'Missing payment verification details', 400);
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', configService.razorpayKeySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return this.sendError(res, 'Payment verification failed', 403);
      }

      const order = await orderRepository.model.findOne({
        razorpayOrderId: razorpay_order_id,
        paymentStatus: PaymentStatus.Pending,
      }).session(session);

      if (!order) {
        const processedOrder = await orderRepository.model.findOne({
          razorpayOrderId: razorpay_order_id,
          paymentStatus: PaymentStatus.Paid,
        });

        if (processedOrder) {
          await session.commitTransaction();
          session.endSession();
          return this.sendSuccess(res, { orderId: processedOrder._id }, 'Payment already verified');
        }

        return this.sendError(res, 'Order not found or already processed', 404);
      }

      order.paymentStatus = PaymentStatus.Paid;
      order.orderStatus = OrderStatus.Confirmed;
      order.razorpayPaymentId = razorpay_payment_id;
      (order as any).paidAt = new Date();

      await order.save({ session });

      const userId = (order as any).user;
      if (userId) {
        await cartRepository.model.findOneAndUpdate(
          { user: userId },
          { items: [], totalPrice: 0, totalQuantity: 0 },
          { session }
        );
      }

      await session.commitTransaction();
      session.endSession();

      return this.sendSuccess(res, { orderId: order._id }, 'Payment verified and order confirmed');
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      return this.sendError(res, 'Payment verification failed', 500, error);
    }
  };
}

export const paymentController = new PaymentController();
