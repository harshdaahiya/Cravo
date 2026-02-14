import { Schema, model, Document } from 'mongoose';

export interface IRestaurantList extends Document {
  owner: Schema.Types.ObjectId;
  list_type: string;
  name: string;
  restaurants: Schema.Types.ObjectId[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantListSchema = new Schema<IRestaurantList>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    list_type: {
      type: String,
      default: 'restaurantList',
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

RestaurantListSchema.index({ owner: 1, name: 1 }, { unique: true });

export const RestaurantListModel = model<IRestaurantList>('RestaurantList', RestaurantListSchema);
