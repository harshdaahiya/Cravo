import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  images: string[];
  price: number;
  restaurant: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  ingredients: string[];
  calorieInformation?: number;
  customizationOptions: Array<{
    name?: string;
    type?: 'single-select' | 'multi-select' | 'text';
    options: Array<{
      itemName?: string;
      priceImpact: number;
    }>;
    isRequired: boolean;
  }>;
  availabilityStatus: 'In Stock' | 'Out of Stock' | 'Pre-order';
  sku: string;
  barcode?: string;
  isBestseller: boolean;
  isTrending: boolean;
  promotionalDiscount: {
    type?: 'percentage' | 'fixed';
    value: number;
  };
  averageRating: number;
  numberOfReviews: number;
  relatedMeals: Schema.Types.ObjectId[];
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    ingredients: [{ type: String }],
    calorieInformation: { type: Number },
    customizationOptions: [
      {
        name: { type: String, required: false },
        type: {
          type: String,
          enum: ['single-select', 'multi-select', 'text'],
          required: false,
        },
        options: [
          {
            itemName: { type: String, required: false },
            priceImpact: { type: Number, default: 0 },
          },
        ],
        isRequired: { type: Boolean, default: false },
      },
    ],
    availabilityStatus: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-order'],
      default: 'In Stock',
    },
    sku: { type: String, unique: true, required: true },
    barcode: { type: String, unique: true, sparse: true },
    isBestseller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    promotionalDiscount: {
      type: { type: String, enum: ['percentage', 'fixed'] },
      value: { type: Number, default: 0 },
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    numberOfReviews: { type: Number, default: 0, min: 0 },
    relatedMeals: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text' });

export const ProductModel = model<IProduct>('Product', ProductSchema);
