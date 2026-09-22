import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import productReducer from '../redux/slices/productSlice';
import categoryReducer from '../redux/slices/categorySlice';
import cartReducer from '../redux/slices/cartSlice';
import wishlistReducer from '../redux/slices/wishlistSlice';
import orderReducer from '../redux/slices/orderSlice';
import searchReducer from '../redux/slices/searchSlice';
import uiReducer from '../redux/slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    search: searchReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
