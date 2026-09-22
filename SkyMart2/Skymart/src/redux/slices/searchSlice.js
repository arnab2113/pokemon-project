import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';

const RECENT_SEARCHES_KEY = 'skymart_recent_searches';
const storedRecent = getData(RECENT_SEARCHES_KEY, ['Organic Broccoli', 'Fresh Milk', 'Alphonso Mangoes', 'Dove Soap']);

const initialState = {
  searchTerm: '',
  recentSearches: storedRecent,
  isSearchOpen: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    addRecentSearch: (state, action) => {
      const query = action.payload.trim();
      if (!query) return;
      const filtered = state.recentSearches.filter((item) => item.toLowerCase() !== query.toLowerCase());
      state.recentSearches = [query, ...filtered].slice(0, 8);
      saveData(RECENT_SEARCHES_KEY, state.recentSearches);
    },
    removeRecentSearch: (state, action) => {
      state.recentSearches = state.recentSearches.filter((item) => item !== action.payload);
      saveData(RECENT_SEARCHES_KEY, state.recentSearches);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      saveData(RECENT_SEARCHES_KEY, []);
    },
    toggleSearchModal: (state, action) => {
      state.isSearchOpen = typeof action.payload === 'boolean' ? action.payload : !state.isSearchOpen;
    },
  },
});

export const {
  setSearchTerm,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  toggleSearchModal,
} = searchSlice.actions;

export default searchSlice.reducer;
