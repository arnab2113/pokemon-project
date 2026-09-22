import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS } from '../../utils/constants';
import { INITIAL_ORDERS } from '../../data/initialData';

const storedOrders = getData(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
saveData(STORAGE_KEYS.ORDERS, storedOrders);

const initialState = {
  orders: storedOrders,
  currentOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      const newOrder = action.payload;
      state.orders.unshift(newOrder);
      state.currentOrder = newOrder;
      saveData(STORAGE_KEYS.ORDERS, state.orders);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        saveData(STORAGE_KEYS.ORDERS, state.orders);
      }
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order && order.status !== 'Delivered') {
        order.status = 'Cancelled';
        saveData(STORAGE_KEYS.ORDERS, state.orders);
      }
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
});

export const { createOrder, updateOrderStatus, cancelOrder, setCurrentOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
