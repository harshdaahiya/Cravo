import { Schema, model, Document } from 'mongoose';

export interface IList extends Document {
  owner: Schema.Types.ObjectId;
  list_type: string;
  name: string;
  items: Schema.Types.ObjectId[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema<IList>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    list_type: {
      type: String,
      default: 'productList',
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ListSchema.index({ owner: 1, name: 1 }, { unique: true });

export const ListModel = model<IList>('List', ListSchema);
