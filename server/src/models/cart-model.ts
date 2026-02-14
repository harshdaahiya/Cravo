import { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  customizations: Array<{
    optionName?: string;
    selectedItems: string[];
  }>;
  addedAt: Date;
}

export interface ICart extends Document {
  user?: Schema.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  totalPrice: number;
  totalQuantity: number;
}

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    sessionId: { type: String, unique: true, sparse: true },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        customizations: [
          {
            optionName: { type: String },
            selectedItems: [{ type: String }],
          },
        ],
        addedAt: { type: Date, default: Date.now },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CartModel = model<ICart>('Cart', CartSchema);
