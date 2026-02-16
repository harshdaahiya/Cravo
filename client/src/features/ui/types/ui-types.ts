export interface UIState {
  auth: {
    isAuthSidebarOpen: boolean;
    mode: 'login' | 'signup' | 'otp' | string;
    showOTPModal: boolean;
    signupEmail: string;
  };
  wishlist: {
    isWishlistModalOpen: boolean;
    modalProductData: any | null;
    modalProps: any | null;
  };
  cart: {
    isDeleteModalOpen: boolean;
    modalProps: any | null;
  };
  address: {
    isAddressModalOpen: boolean;
    modalProps: any | null;
    isDeleteAddressModalOpen: boolean;
    deleteAddressID: string | null;
  };
  authRequireModal: {
    isAuthRequireModalOpen: boolean;
    modalProps: any | null;
  };
}
