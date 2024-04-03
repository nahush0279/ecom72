import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentProduct: JSON.parse(window.sessionStorage.getItem('CURRENT_PRODUCT'))
};

const currentProductSlice = createSlice({
  name: 'currentProduct',
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      window.sessionStorage.setItem('CURRENT_PRODUCT', JSON.stringify(state.currentProduct))
    },
  },
});

export const { setCurrentProduct } = currentProductSlice.actions;

export default currentProductSlice.reducer;