import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCartData = createAsyncThunk('cart/fetchCartData', async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL  + 'cart/get');
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  });

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartSlice: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateproduct_ids: (state, action) => {
      const { userId, product_ids } = action.payload;
      state.cartSlice = state.cartSlice.map((item) =>
        item.userId === userId ? { ...item, product_ids: product_ids } : item
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cartSlice = action.payload;
      })
      .addCase(fetchCartData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateproduct_ids } = cartSlice.actions;

export default cartSlice.reducer;
