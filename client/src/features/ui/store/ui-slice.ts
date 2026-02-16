import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  auth: {
    isAuthSidebarOpen: boolean;
    mode: 'login' | 'signup' | 'otp';
    authRequiredModal: {
      isOpen: boolean;
      actionType: string | null;
      onSuccess: (() => void) | null;
    };
  };
  wishlist: {
    isWishlistModalOpen: boolean;
    selectedProduct?: any | null;
    modalProps?: {
      productId?: string;
      sourceListId?: string;
    } | null;
  };
  address: {
    isAddressModalOpen: boolean;
    isDeleteAddressModalOpen: boolean;
    deleteAddressID: string | null;
    selectedAddress?: any | null;
    modalProps?: any | null;
  };
  cart: {
    isDeleteModalOpen: boolean;
    deleteItemID: string | null;
    deleteItemName: string | null;
  };
  search: {
    isSearchModalOpen: boolean;
  };
}

const initialState: UIState = {
  auth: {
    isAuthSidebarOpen: false,
    mode: 'login',
    authRequiredModal: {
      isOpen: false,
      actionType: null,
      onSuccess: null,
    },
  },
  wishlist: {
    isWishlistModalOpen: false,
    selectedProduct: null,
    modalProps: null,
  },
  address: {
    isAddressModalOpen: false,
    isDeleteAddressModalOpen: false,
    deleteAddressID: null,
    selectedAddress: null,
    modalProps: null,
  },
  cart: {
    isDeleteModalOpen: false,
    deleteItemID: null,
    deleteItemName: null,
  },
  search: {
    isSearchModalOpen: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Auth UI Actions
    openAuthSidebar: (state, action: PayloadAction<{ mode?: 'login' | 'signup' | 'otp' } | undefined>) => {
      state.auth.isAuthSidebarOpen = true;
      if (action.payload?.mode) {
        state.auth.mode = action.payload.mode;
      }
    },
    closeAuthSidebar: state => {
      state.auth.isAuthSidebarOpen = false;
    },
    setAuthMode: (state, action: PayloadAction<'login' | 'signup' | 'otp'>) => {
      state.auth.mode = action.payload;
    },
    openAuthRequiredModal: (state, action: PayloadAction<{ actionType: string; onSuccess?: () => void }>) => {
      state.auth.authRequiredModal.isOpen = true;
      state.auth.authRequiredModal.actionType = action.payload.actionType;
      state.auth.authRequiredModal.onSuccess = action.payload.onSuccess || null;
    },
    closeAuthRequiredModal: state => {
      state.auth.authRequiredModal.isOpen = false;
      state.auth.authRequiredModal.actionType = null;
      state.auth.authRequiredModal.onSuccess = null;
    },

    // Wishlist UI Actions
    openWishlistModal: (state, action: PayloadAction<{ product?: any; modalProps?: { productId?: string; sourceListId?: string } } | any>) => {
      state.wishlist.isWishlistModalOpen = true;
      if (action.payload?.modalProps) {
        state.wishlist.modalProps = action.payload.modalProps;
        state.wishlist.selectedProduct = action.payload.product || null;
      } else {
        state.wishlist.selectedProduct = action.payload;
        state.wishlist.modalProps = null;
      }
    },
    closeWishlistModal: state => {
      state.wishlist.isWishlistModalOpen = false;
      state.wishlist.selectedProduct = null;
      state.wishlist.modalProps = null;
    },

    // Address UI Actions
    openAddressModal: (state, action: PayloadAction<{ address?: any; modalProps?: any } | any>) => {
      state.address.isAddressModalOpen = true;
      if (action.payload?.modalProps) {
        state.address.modalProps = action.payload.modalProps;
        state.address.selectedAddress = action.payload.address || null;
      } else {
        state.address.selectedAddress = action.payload || null;
        state.address.modalProps = null;
      }
    },
    closeAddressModal: state => {
      state.address.isAddressModalOpen = false;
      state.address.selectedAddress = null;
      state.address.modalProps = null;
    },
    openDeleteAddressModal: (state, action: PayloadAction<string>) => {
      state.address.isDeleteAddressModalOpen = true;
      state.address.deleteAddressID = action.payload;
    },
    closeDeleteAddressModal: state => {
      state.address.isDeleteAddressModalOpen = false;
      state.address.deleteAddressID = null;
    },

    // Cart UI Actions
    openDeleteModal: (
      state,
      action: PayloadAction<{ itemId: string; itemName: string }>
    ) => {
      state.cart.isDeleteModalOpen = true;
      state.cart.deleteItemID = action.payload.itemId;
      state.cart.deleteItemName = action.payload.itemName;
    },
    closeDeleteModal: state => {
      state.cart.isDeleteModalOpen = false;
      state.cart.deleteItemID = null;
      state.cart.deleteItemName = null;
    },

    // Search UI Actions
    toggleSearchModal: state => {
      state.search.isSearchModalOpen = !state.search.isSearchModalOpen;
    },
    closeSearchModal: state => {
      state.search.isSearchModalOpen = false;
    },
  },
});

export const {
  openAuthSidebar,
  closeAuthSidebar,
  setAuthMode,
  openAuthRequiredModal,
  closeAuthRequiredModal,
  openWishlistModal,
  closeWishlistModal,
  openAddressModal,
  closeAddressModal,
  openDeleteAddressModal,
  closeDeleteAddressModal,
  openDeleteModal,
  closeDeleteModal,
  toggleSearchModal,
  closeSearchModal,
} = uiSlice.actions;

export default uiSlice.reducer;
