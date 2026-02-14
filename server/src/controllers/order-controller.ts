import { Request, Response } from 'express';
import { BaseController } from './base-controller.js';
import { orderRepository, OrderRepository } from '../repositories/order-repository.js';
import { cartRepository } from '../repositories/cart-repository.js';
import { productRepository } from '../repositories/product-repository.js';
import { OrderStatus, PaymentStatus } from '../models/order-model.js';
import mongoose from 'mongoose';
import { LoggerService } from '../services/logger-service.js';

export class OrderController extends BaseController {
  private orderRepo: OrderRepository;

  constructor() {
    super();
    this.orderRepo = orderRepository;
  }

  private async validateAndPrepareOrderItems(items: any[]) {
    let subTotal = 0;
    const TAX_RATE = 0.18;
    const SHIPPING_FLAT_RATE = 50;

    const orderItems = [];
    for (const cartItem of items) {
      const product = await productRepository.findById(cartItem.product.toString() as string);
      if (!product) {
        throw new Error(`Product ${cartItem.product} not found`);
      }

      const itemPrice = product.price;
      const itemTotal = itemPrice * cartItem.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: cartItem.quantity,
        price: itemPrice,
        customizations: cartItem.customizations || [],
      });

      subTotal += itemTotal;
    }

    const taxAmount = subTotal * TAX_RATE;
    const totalAmount = subTotal + taxAmount + SHIPPING_FLAT_RATE;

    return {
      orderItems,
      subTotal,
      taxAmount,
      shippingCost: SHIPPING_FLAT_RATE,
      totalAmount,
      discountApplied: 0,
    };
  }

  public createOrder = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const userId = (req.user as any)?._id;
      const { deliveryAddress, paymentMethod, deliveryMethod, guestInfo } = req.body;

      if (!deliveryAddress || !paymentMethod || !deliveryMethod) {
        return this.sendError(res, 'Required order fields missing', 400);
      }

      const cart = await cartRepository.findOne({ user: userId });
      if (!cart || cart.items.length === 0) {
        return this.sendError(res, 'Cart is empty', 400);
      }

      const preparedData = await this.validateAndPrepareOrderItems(cart.items);

      const razorpayOrderId = `fake_rzp_${Date.now()}`;

      const newOrderData = {
        user: userId,
        guestInfo,
        ...preparedData,
        paymentMethod,
        paymentStatus: PaymentStatus.Pending,
        razorpayOrderId,
        orderStatus: OrderStatus.Pending,
        deliveryAddress,
        deliveryMethod,
      };

      const newOrder = await this.orderRepo.create(newOrderData as any);

      await session.commitTransaction();
      session.endSession();

      return this.sendSuccess(res, {
        orderId: newOrder._id,
        razorpayOrderId,
        amount: preparedData.totalAmount,
        currency: 'INR',
      }, 'Order initiated successfully', 201);
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      LoggerService.error('Order creation failed:', error);
      return this.sendError(res, 'Order initiation failed', 500, error);
    }
  };

  public getAllUserOrders = async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?._id;
      const orders = await this.orderRepo.find({ user: userId as string });
      return this.sendSuccess(res, { orders }, 'User orders retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve orders', 500, error);
    }
  };

  public getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const orderId = id as string;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return this.sendError(res, 'Invalid order ID', 400);
      }

      const order = await this.orderRepo.findOne({ _id: orderId, user: userId });
      if (!order) {
        return this.sendError(res, 'Order not found', 404);
      }

      return this.sendSuccess(res, { order }, 'Order retrieved successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to retrieve order', 500, error);
    }
  };

  public cancelOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any)?._id;
      const orderId = id as string;
      const { reason } = req.body;

      const order = await this.orderRepo.findOne({ _id: orderId, user: userId });
      if (!order) {
        return this.sendError(res, 'Order not found', 404);
      }

      const canBeCancelled = [OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Preparing];
      if (!canBeCancelled.includes(order.orderStatus)) {
        return this.sendError(res, `Order cannot be cancelled in status: ${order.orderStatus}`, 400);
      }

      await this.orderRepo.update(orderId, {
        orderStatus: OrderStatus.Cancelled,
        cancellationReason: reason || 'Cancelled by user',
        paymentStatus: PaymentStatus.Refunded
      });

      return this.sendSuccess(res, null, 'Order cancelled successfully');
    } catch (error: any) {
      return this.sendError(res, 'Failed to cancel order', 500, error);
    }
  };
}

export const orderController = new OrderController();
