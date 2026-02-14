import { Schema, model, Document } from 'mongoose';

export enum CouponType {
  Percentage = 'percentage',
  Fixed = 'fixed',
}

export enum CouponAppliesTo {
  All = 'all',
  SpecificProducts = 'specific_products',
  SpecificCategories = 'specific_categories',
}

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  minimumOrderValue: number;
  appliesTo: CouponAppliesTo;
  productIds: Schema.Types.ObjectId[];
  categoryIds: Schema.Types.ObjectId[];
  expiryDate: Date;
  startDate: Date;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: Object.values(CouponType), required: true },
    value: { type: Number, required: true, min: 0 },
    minimumOrderValue: { type: Number, default: 0 },
    appliesTo: {
      type: String,
      enum: Object.values(CouponAppliesTo),
      default: CouponAppliesTo.All,
    },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    expiryDate: { type: Date, required: true },
    startDate: { type: Date, default: Date.now },
    usageLimit: { type: Number, default: 0 },
    timesUsed: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const CouponModel = model<ICoupon>('Coupon', CouponSchema);
