import { Schema, model, Document } from 'mongoose';

export interface IOpeningHour {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  open: string;
  close: string;
  is_closed: boolean;
}

export interface IRestaurant extends Document {
  name: string;
  description?: string;
  address: {
    street: string;
    city: Schema.Types.ObjectId;
    state: string;
    zip_code: string;
    location: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
  };
  contact: {
    phone?: string;
    email?: string;
  };
  cuisine_type: string[];
  rating: number;
  numberOfReviews: number;
  cost_for_two: number;
  delivery_time_mins: number;
  is_10_min_delivery: boolean;
  is_veg: boolean;
  opening_hours: IOpeningHour[];
  is_active: boolean;
  min_order_value: number;
  delivery_radius_km?: number;
  images: string[];
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
      state: { type: String, required: true, trim: true },
      zip_code: { type: String, required: true, trim: true },
      location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true },
      },
    },
    contact: {
      phone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    cuisine_type: [{ type: String, trim: true }],
    rating: { type: Number, min: 0, max: 5, default: 0 },
    numberOfReviews: { type: Number, min: 0, default: 0 },
    cost_for_two: { type: Number, min: 0, default: 0 },
    delivery_time_mins: { type: Number, min: 0, default: 0 },
    is_10_min_delivery: { type: Boolean, default: false },
    is_veg: { type: Boolean, default: false },
    opening_hours: [
      {
        day: {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          required: true,
        },
        open: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ },
        close: { type: String, required: true, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ },
        is_closed: { type: Boolean, default: false },
      },
    ],
    is_active: { type: Boolean, default: true },
    min_order_value: { type: Number, min: 0, default: 0 },
    delivery_radius_km: { type: Number, min: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

RestaurantSchema.index({
  'address.city': 1,
  cuisine_type: 1,
  is_veg: 1,
  rating: -1,
  cost_for_two: 1,
});

RestaurantSchema.index({
  'address.city': 1,
  cuisine_type: 1,
  is_veg: 1,
  delivery_time_mins: 1,
});

RestaurantSchema.index({ 'address.location': '2dsphere' });

RestaurantSchema.index({
  name: 'text',
  description: 'text',
  cuisine_type: 'text',
});

export const RestaurantModel = model<IRestaurant>('Restaurant', RestaurantSchema);
