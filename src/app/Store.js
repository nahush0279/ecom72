import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import productsReducer from '../features/products/productsSlice'
import currentProductReducer from '../features/currentProduct/currentProductSlice';
import cartReducer from "../features/cart/cartSlice";
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
const Store = configureStore({
  reducer: {
    user: userReducer,
    products : productsReducer,
    currentProduct : currentProductReducer,
    cart : cartReducer,
    auth : authReducer,
    users : usersReducer

  },
});



export default Store;
