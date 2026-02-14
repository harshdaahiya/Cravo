import { Schema, model, Document } from 'mongoose';

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Preparing = 'Preparing',
  OutForDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum PaymentStatus {
  Pending = 'Pending',
  Authorized = 'Authorized',
  Paid = 'Paid',
  Failed = 'Failed',
  Refunded = 'Refunded'
}

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  customizations?: Array<{
    optionName?: string;
    selectedItems: string[];
  }>;
}

export interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType?: string;
}

export interface IOrder extends Document {
  user?: Schema.Types.ObjectId;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  orderItems: IOrderItem[];
  subTotal: number;
  shippingCost: number;
  taxAmount: number;
  discountApplied: number;
  totalAmount: number;
  couponUsed?: Schema.Types.ObjectId;
  paymentMethod: 'Debit Card' | 'Credit Card' | 'UPI' | 'Wallet' | 'COD';
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  orderStatus: OrderStatus;
  deliveryAddress: IDeliveryAddress;
  deliveryMethod: 'Standard' | 'Express' | 'Scheduled Delivery' | 'Pickup';
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  trackingNumber?: string;
  pickupStore?: string;
  cancellationReason?: string;
  refundStatus: 'None' | 'Initiated' | 'Completed' | 'Failed';
  refundAmount: number;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestInfo: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    orderItems: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        customizations: [
          {
            optionName: { type: String },
            selectedItems: [{ type: String }],
          },
        ],
      },
    ],
    subTotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountApplied: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    couponUsed: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    paymentMethod: {
      type: String,
      enum: ['Debit Card', 'Credit Card', 'UPI', 'Wallet', 'COD'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
      index: true,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
      index: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      addressType: { type: String },
    },
    deliveryMethod: {
      type: String,
      enum: ['Standard', 'Express', 'Scheduled Delivery', 'Pickup'],
      required: true,
    },
    estimatedDeliveryTime: { type: Date },
    actualDeliveryTime: { type: Date },
    trackingNumber: { type: String },
    pickupStore: { type: String },
    cancellationReason: { type: String },
    refundStatus: {
      type: String,
      enum: ['None', 'Initiated', 'Completed', 'Failed'],
      default: 'None',
    },
    refundAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>('Order', OrderSchema);
