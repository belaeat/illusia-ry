import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  _id: string;
  description: string;
  contentSummary: string;
  storageDetails: string;
  storageLocation?: string;
  isAvailable: boolean;
  featured: boolean;
  quantity: number;
  bookingDates?: {
    startDate: string;
    endDate: string;
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
}

interface ClearCartPayload {
  saveToStorage?: boolean;
  userEmail?: string;
}

// Load cart from cookies
const loadCartFromCookies = (userEmail?: string): CartState => {
  if (!userEmail) return { items: [], totalItems: 0 };

  try {
    const cookies = document.cookie.split(";");
    const cartCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`cart_${userEmail}=`)
    );
    if (cartCookie) {
      const cartData = decodeURIComponent(cartCookie.split("=")[1]);
      const parsedCart = JSON.parse(cartData);
      console.log("Loaded cart from cookies:", parsedCart);
      return parsedCart;
    }
  } catch (error) {
    console.error("Error loading cart from cookies:", error);
  }
  return { items: [], totalItems: 0 };
};

// Save cart to cookies
const saveCartToCookies = (state: CartState, userEmail?: string) => {
  if (!userEmail) return;

  try {
    const cookieValue = encodeURIComponent(JSON.stringify(state));
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 7 days
    document.cookie = `cart_${userEmail}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/`;
    console.log("Cart saved to cookies:", state);
  } catch (error) {
    console.error("Error saving cart to cookies:", error);
  }
};

const initialState: CartState = { items: [], totalItems: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ item: CartItem; userEmail?: string }>
    ) => {
      const { item, userEmail } = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.items.push(item);
      }

      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      saveCartToCookies(state, userEmail);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string; userEmail?: string }>
    ) => {
      const { id, userEmail } = action.payload;
      state.items = state.items.filter((item) => item._id !== id);
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      saveCartToCookies(state, userEmail);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        userEmail?: string;
      }>
    ) => {
      const { id, quantity, userEmail } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;
        state.totalItems = state.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        saveCartToCookies(state, userEmail);
      }
    },
    clearCart: (state, action: PayloadAction<ClearCartPayload>) => {
      const { saveToStorage, userEmail } = action.payload;
      if (saveToStorage && userEmail) {
        saveCartToCookies(state, userEmail);
      } else if (userEmail) {
        document.cookie = `cart_${userEmail}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        console.log("Cart removed from cookies");
      }
      state.items = [];
      state.totalItems = 0;
    },
    restoreCart: (state, action: PayloadAction<string>) => {
      const userEmail = action.payload;
      const savedCart = loadCartFromCookies(userEmail);
      state.items = savedCart.items;
      state.totalItems = savedCart.totalItems;
      console.log("Cart restored from cookies:", state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  restoreCart,
} = cartSlice.actions;
export default cartSlice.reducer;
