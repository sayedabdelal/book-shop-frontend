import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// Fetch cart items async action
export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      return rejectWithValue('User ID not found');
    }
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${apiUrl}/api/cart_items?user_id=${userId}`);
     
    if (!response.ok) {
      return rejectWithValue(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
     
  }
);

const initialState = {
  items: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: null,
};
 

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
     
      const itemInCart = state.items.find(item => item.id === action.payload.id);
      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItemFromCart: (state, action) => {
       
      state.items = state.items.filter(item => item.book_id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter(i => i.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Update the cart with the fetched items
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart items';
      });
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
