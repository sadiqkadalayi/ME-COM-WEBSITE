import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Array of cart items: { product: {}, quantity: number }
    totalItems: 0, // Total number of items in cart
    totalAmount: 0, // Total price of all items
    isCartOpen: false, // For mobile cart drawer
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product._id === product._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        state.items.push({ product, quantity });
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    addDuplicateToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      // Always add as a new separate entry (for multiple quantities of same product)
      state.items.push({ 
        product, 
        quantity,
        // Add a unique identifier to distinguish between duplicate entries
        cartId: Date.now() + Math.random()
      });
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    removeFromCart: (state, action) => {
      const { productId, cartId } = action.payload;
      if (cartId) {
        // Remove specific duplicate item by cartId
        state.items = state.items.filter(item => item.cartId !== cartId);
      } else {
        // Remove by productId (original behavior)
        state.items = state.items.filter(item => item.product._id !== productId);
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity, cartId } = action.payload;
      
      let existingItem;
      if (cartId) {
        // Find specific duplicate item by cartId
        existingItem = state.items.find(item => item.cartId === cartId);
      } else {
        // Find by productId (original behavior)
        existingItem = state.items.find(item => item.product._id === productId);
      }
      
      if (existingItem) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          if (cartId) {
            state.items = state.items.filter(item => item.cartId !== cartId);
          } else {
            state.items = state.items.filter(item => item.product._id !== productId);
          }
        } else {
          existingItem.quantity = quantity;
        }
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
    
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
    },
    
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    
    setCartOpen: (state, action) => {
      state.isCartOpen = action.payload;
    }
  }
});

export const {
  addToCart,
  addDuplicateToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateTotals,
  toggleCart,
  setCartOpen
} = cartSlice.actions;

export default cartSlice.reducer;