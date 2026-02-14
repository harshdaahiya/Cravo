import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  profilePicture?: string;
  googleId?: string;
  role: 'customer' | 'admin' | 'delivery_partner';
  preferredLanguage: string;
  preferredCurrency: string;
  addresses: Schema.Types.ObjectId[];
  paymentMethods: Array<{
    cardType?: string;
    last4?: string;
    token?: string;
    isDefault: boolean;
  }>;
  lists: Schema.Types.ObjectId[];
  restaurantLists: Schema.Types.ObjectId[];
  recentlyViewed: Schema.Types.ObjectId[];
  isActive: boolean;
  isVerified: boolean;
  verificationOTP?: string;
  verificationOTPExpires?: Date;
  refreshTokens: Array<{
    token: string;
    createdAt: Date;
  }>;
  isPasswordCorrect(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, lowercase: true },
    email: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
    },
    phone: { type: String },
    profilePicture: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ['customer', 'admin', 'delivery_partner'],
      default: 'customer',
    },
    preferredLanguage: { type: String, default: 'en' },
    preferredCurrency: { type: String, default: 'USD' },
    addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    paymentMethods: [
      {
        cardType: { type: String },
        last4: { type: String },
        token: { type: String },
        isDefault: { type: Boolean, default: false },
      },
    ],
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    restaurantLists: [{ type: Schema.Types.ObjectId, ref: 'RestaurantList' }],
    recentlyViewed: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    verificationOTP: { type: String },
    verificationOTPExpires: { type: Date },
    refreshTokens: [
      {
        token: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password === undefined) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password correctness
UserSchema.methods.isPasswordCorrect = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>('User', UserSchema);
