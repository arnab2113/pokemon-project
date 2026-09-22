import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { getData, saveData } from './services/localStorageService';
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from './utils/constants';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_ORDERS } from './data/initialData';

export const App = () => {
  useEffect(() => {
    // Seed LocalStorage database on first load if missing
    if (!getData(STORAGE_KEYS.PRODUCTS)) saveData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!getData(STORAGE_KEYS.USERS)) saveData(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!getData(STORAGE_KEYS.CATEGORIES)) saveData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    if (!getData(STORAGE_KEYS.ORDERS)) saveData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);

    // Initial Theme Sync
    const settings = getData(STORAGE_KEYS.SETTINGS, { theme: 'light' });
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
            },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
