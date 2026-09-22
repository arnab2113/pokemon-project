import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from '../../utils/constants';

const storedCategories = getData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
saveData(STORAGE_KEYS.CATEGORIES, storedCategories);

const initialState = {
  categories: storedCategories,
  activeCategory: 'all',
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      saveData(STORAGE_KEYS.CATEGORIES, action.payload);
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      saveData(STORAGE_KEYS.CATEGORIES, state.categories);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter((c) => c.id !== action.payload);
      saveData(STORAGE_KEYS.CATEGORIES, state.categories);
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setCategories, addCategory, deleteCategory, setActiveCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
