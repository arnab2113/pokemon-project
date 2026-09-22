import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS } from '../../utils/constants';

const storedSettings = getData(STORAGE_KEYS.SETTINGS, {
  theme: 'light',
  userLocation: 'Sector 14, Gurugram (10 Mins)',
});

const initialState = {
  theme: storedSettings.theme || 'light',
  userLocation: storedSettings.userLocation || 'Sector 14, Gurugram (10 Mins)',
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isAddressModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      saveData(STORAGE_KEYS.SETTINGS, {
        theme: state.theme,
        userLocation: state.userLocation,
      });
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
      saveData(STORAGE_KEYS.SETTINGS, {
        theme: state.theme,
        userLocation: state.userLocation,
      });
    },
    toggleCartDrawer: (state, action) => {
      state.isCartDrawerOpen =
        typeof action.payload === 'boolean' ? action.payload : !state.isCartDrawerOpen;
    },
    toggleMobileMenu: (state, action) => {
      state.isMobileMenuOpen =
        typeof action.payload === 'boolean' ? action.payload : !state.isMobileMenuOpen;
    },
    toggleAddressModal: (state, action) => {
      state.isAddressModalOpen =
        typeof action.payload === 'boolean' ? action.payload : !state.isAddressModalOpen;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setUserLocation,
  toggleCartDrawer,
  toggleMobileMenu,
  toggleAddressModal,
} = uiSlice.actions;

export default uiSlice.reducer;
