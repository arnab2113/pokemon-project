import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import { INITIAL_PRODUCTS } from '../../data/initialData';

// Initialize products in LocalStorage if empty
const storedProducts = getData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
saveData(STORAGE_KEYS.PRODUCTS, storedProducts);

const initialState = {
  products: storedProducts,
  selectedProduct: null,
  filters: {
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    inStockOnly: false,
    isOrganicOnly: false,
    brand: 'all',
  },
  sortBy: 'featured', // 'featured' | 'price_low_high' | 'price_high_low' | 'rating_high_low' | 'discount_high_low'
  searchQuery: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      saveData(STORAGE_KEYS.PRODUCTS, action.payload);
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
      saveData(STORAGE_KEYS.PRODUCTS, state.products);
    },
    updateProduct: (state, action) => {
      const updated = action.payload;
      state.products = state.products.map((p) => (p.id === updated.id ? updated : p));
      saveData(STORAGE_KEYS.PRODUCTS, state.products);
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((p) => p.id !== productId);
      saveData(STORAGE_KEYS.PRODUCTS, state.products);
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'all',
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        inStockOnly: false,
        isOrganicOnly: false,
        brand: 'all',
      };
      state.sortBy = 'featured';
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSelectedProduct,
  setFilter,
  resetFilters,
  setSortBy,
  setSearchQuery,
} = productSlice.actions;

export default productSlice.reducer;
