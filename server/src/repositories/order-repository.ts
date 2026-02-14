import { IOrder, OrderModel, OrderStatus, PaymentStatus } from '../models/order-model.js';
import { BaseRepository } from './base-repository.js';

export class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  public async findByUser(userId: string): Promise<IOrder[]> {
    return await this.find({ user: userId });
  }

  public async findByStatus(status: OrderStatus): Promise<IOrder[]> {
    return await this.find({ orderStatus: status });
  }

  public async findByRazorpayId(razorpayOrderId: string): Promise<IOrder | null> {
    return await this.findOne({ razorpayOrderId });
  }

  public async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<IOrder | null> {
    return await this.update(orderId, { paymentStatus: status });
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder | null> {
    return await this.update(orderId, { orderStatus: status });
  }
}

export const orderRepository = new OrderRepository();
