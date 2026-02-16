export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    GOOGLE: '/auth/google',
    STATUS: '/auth/profile',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_OTP: '/auth/verify',
    RESEND_OTP: '/auth/resend-otp',
    PROFILE: '/auth/profile',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  RESTAURANTS: {
    RESTAURANTS_LIST: '/restaurants',
    DETAILS: (id: string) => `/restaurants/${id}`,
    PRODUCTS: (restaurantId: string) => `/restaurants/${restaurantId}/products`,
    TOP_RATED_RESTAURANTS: '/restaurants/top-rated',
  },
  CITIES: {
    GET_ALL_CITIES: '/cities',
  },
  CATEGORIES: {
    GET_ALL_CATEGORIES: '/categories',
  },
  WISHLIST: {
    GET_ALL_PRODUCTS_LIST: '/lists/?populate=true',
    GET_ALL_RESTAURANTS_LIST: '/restaurantList/?populate=true',
    ADD_ITEM_TO_PRODUCT_LIST: (product_list_id: string) => `/lists/${product_list_id}/add`,
    ADD_ITEM_TO_RESTAURANT_LIST: (restaurant_list_id: string) => `/restaurantList/${restaurant_list_id}/add`,
    REMOVE_ITEM_FROM_PRODUCT_LIST: (product_list_id: string) => `/lists/${product_list_id}/remove`,
    REMOVE_ITEM_FROM_RESTAURANT_LIST: (restaurant_list_id: string) => `/restaurantList/${restaurant_list_id}/remove`,
    CREATE_NEW_PRODUCT_LIST: '/lists',
    CREATE_NEW_RESTAURANT_LIST: '/restaurantList',
    TRANSFER_PRODUCT_FROM_LIST: '/lists/transfer',
    TRANSFER_ITEM: (listId: string) => `/wishlists/${listId}/transfer`,
  },
  CART: {
    ADD_ITEM_TO_CART: '/cart/items',
    REMOVE_ITEM_FROM_CART: (itemId: string) => `/cart/items/${itemId}`,
    DELETE_ENTIRE_CART: `/cart`,
    GET_USER_CART: '/cart',
    UPDATE_ITEM_QUANTITY: (itemId: string) => `/cart/items/${itemId}`,
  },
  ADDRESS: {
    CREATE_NEW_ADDRESS: '/address',
    GET_ALL_ADDRESSES: '/address',
    GET_ADDRESS: (addressId: string) => `/address/${addressId}`,
    UPDATE_ADDRESS: (addressId: string) => `/address/${addressId}`,
    DELETE_ADDRESS: (addressId: string) => `/address/${addressId}`,
  },
  ORDERS: {
    CHECKOUT: '/orders/checkout',
    ALL_USER_ORDERS: '/orders',
    ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
    CANCEL_ORDER: (orderId: string) => `/orders/cancle/${orderId}`,
  },
  PAYMENTS: {
    VERIFY_PAYMENT: '/payments/verify',
  },
  LOCATION: {
    USER_IP_LOCATION: '/location/user-location',
  },
} as const;
