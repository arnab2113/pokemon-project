import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS } from '../../utils/constants';

const storedWishlist = getData(STORAGE_KEYS.WISHLIST, []);

const initialState = {
  items: storedWishlist,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      if (!state.items.some((item) => item.id === product.id)) {
        state.items.push(product);
        saveData(STORAGE_KEYS.WISHLIST, state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveData(STORAGE_KEYS.WISHLIST, state.items);
    },
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        state.items.push(product);
      }
      saveData(STORAGE_KEYS.WISHLIST, state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveData(STORAGE_KEYS.WISHLIST, []);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
