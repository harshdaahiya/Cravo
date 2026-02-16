export interface IUser {
  _id: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  role: 'customer' | 'admin' | 'delivery_partner';
  preferredLanguage: string;
  preferredCurrency: string;
  addresses: string[]; // Array of Address IDs
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOpeningHour {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  open: string;
  close: string;
  is_closed: boolean;
}

export interface IRestaurant {
  _id: string;
  name: string;
  description?: string;
  address: {
    street: string;
    city: any; // Can be string (ID) or populated ICity
    cityDetails?: ICity;
    state: string;
    zip_code: string;
    location: {
      type: 'Point';
      coordinates: [number, number];
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
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | { _id: string; name: string };
  image: string;
  images?: string[];
  restaurant: string | IRestaurant;
  is_available: boolean;
  is_veg: boolean;
  isBestseller?: boolean;
  rating: number;
  numberOfReviews: number;
  promotionalDiscount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  _id: string;
  product: IProduct;
  quantity: number;
  itemTotal: number;
  customizations?: string[];
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface IOrder {
  _id: string;
  user: string | IUser;
  orderItems: Array<{
    _id?: string;
    product: string | IProduct;
    name: string;
    quantity: number;
    price: number;
    customizations?: Array<{
        optionName?: string;
        selectedItems: string[];
    }>;
  }>;
  subTotal: number;
  shippingCost: number;
  taxAmount: number;
  discountApplied: number;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    addressType?: string;
  };
  paymentMethod: 'Debit Card' | 'Credit Card' | 'UPI' | 'Wallet' | 'COD';
  paymentStatus: 'Pending' | 'Authorized' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  cancellationReason?: string;
  driver?: any;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id: string;
  user: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
  updatedAt: string;
}

export interface IWishlist {
  _id: string;
  user: string;
  name: string;
  list_type: 'productList' | 'restaurantList';
  products?: (string | IProduct)[];
  restaurants?: (string | IRestaurant)[];
  items?: any[]; // Normalized items key for UI
  createdAt: string;
  updatedAt: string;
}

export interface ICity {
  _id: string;
  name: string;
  state: string;
  country: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}
