import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import updateProduct from './../../services/updateProduct';


export const modifyProductLocally = createAction('products/modifyProductLocally');

export const updateBackendWithReduxState = createAsyncThunk(
  'products/updateBackendWithReduxState',
  async (id, { getState }) => {
    const state = getState();
    // console.log(state.products.data)
    const productToUpdate = state.products.data.find((product) => product.productId === id);
    // console.log(productToUpdate)
    if (productToUpdate) {
      console.log(id, productToUpdate.name, productToUpdate.descreption, productToUpdate.category, productToUpdate.seller, productToUpdate.price, productToUpdate.quantity)
      const response = await updateProduct(id, productToUpdate.product_name, productToUpdate.description, productToUpdate.category, productToUpdate.seller, productToUpdate.price, productToUpdate.quantity,productToUpdate.image_data);
      return response.data;
    }
    return null;
  }
);
export const updateProductOnServer = createAsyncThunk(
  'products/updateProductOnServer',
  async (updatedData) => {
    // console.log(updatedData)
    const response = await updateProduct(updatedData.id, updatedData.name ,updatedData.description, updatedData.category, updatedData.seller , updatedData.price, updatedData.quantity  );
    return response.data;
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'products/all');
      // debugger;
      return response.data;
    } catch (error) {
      console.error('Fetch failed:', error.message);
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  
  reducers: {

    modifyProductLocally: (state, action) => {
      const { productId, updatedData } = action.payload;
      console.log(productId, updatedData);
    
      const productIndex = state.data.findIndex((product) => product.productId === productId);
    
      if (productIndex !== -1) {
        return {
          ...state,
          data: [
            ...state.data.slice(0, productIndex),
            updatedData,
            ...state.data.slice(productIndex + 1),
          ],
        };
      }
     
      return state;
    },
    productAdded: {
      reducer(state, action) {
        state.data = [...state.data, action.payload];
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.data = action.payload.slice();
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const selectAllProducts = (state) => state.products;
export const { productAdded  } = productsSlice.actions;
export default productsSlice.reducer;