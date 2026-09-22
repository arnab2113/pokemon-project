import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import { INITIAL_USERS } from '../../data/initialData';

// Initialize users in LocalStorage if empty
const storedUsers = getData(STORAGE_KEYS.USERS, INITIAL_USERS);
saveData(STORAGE_KEYS.USERS, storedUsers);

const currentUser = getData(STORAGE_KEYS.CURRENT_USER, null);

const initialState = {
  user: currentUser,
  users: storedUsers,
  isAuthenticated: !!currentUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (foundUser) {
        state.user = foundUser;
        state.isAuthenticated = true;
        state.error = null;
        saveData(STORAGE_KEYS.CURRENT_USER, foundUser);
      } else {
        state.error = 'Invalid email or password';
      }
    },
    register: (state, action) => {
      const newUser = action.payload;
      const existingUser = state.users.find(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
      );
      if (existingUser) {
        state.error = 'An account with this email already exists';
        return;
      }
      state.users.push(newUser);
      state.user = newUser;
      state.isAuthenticated = true;
      state.error = null;
      saveData(STORAGE_KEYS.USERS, state.users);
      saveData(STORAGE_KEYS.CURRENT_USER, newUser);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      saveData(STORAGE_KEYS.CURRENT_USER, null);
    },
    updateProfile: (state, action) => {
      if (!state.user) return;
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
      state.users = state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      saveData(STORAGE_KEYS.CURRENT_USER, updatedUser);
      saveData(STORAGE_KEYS.USERS, state.users);
    },
    addAddress: (state, action) => {
      if (!state.user) return;
      const newAddress = action.payload;
      const addresses = state.user.addresses || [];
      if (newAddress.isDefault) {
        addresses.forEach((a) => (a.isDefault = false));
      }
      const updatedAddresses = [...addresses, newAddress];
      state.user.addresses = updatedAddresses;
      state.users = state.users.map((u) => (u.id === state.user.id ? state.user : u));
      saveData(STORAGE_KEYS.CURRENT_USER, state.user);
      saveData(STORAGE_KEYS.USERS, state.users);
    },
    removeAddress: (state, action) => {
      if (!state.user) return;
      const addressId = action.payload;
      state.user.addresses = state.user.addresses.filter((a) => a.id !== addressId);
      state.users = state.users.map((u) => (u.id === state.user.id ? state.user : u));
      saveData(STORAGE_KEYS.CURRENT_USER, state.user);
      saveData(STORAGE_KEYS.USERS, state.users);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  login,
  register,
  logout,
  updateProfile,
  addAddress,
  removeAddress,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
