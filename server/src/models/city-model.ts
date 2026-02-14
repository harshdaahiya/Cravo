import { Schema, model, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  is_serviceable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CitySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    is_serviceable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CitySchema.index({ location: '2dsphere' });

export const CityModel = model<ICity>('City', CitySchema);
