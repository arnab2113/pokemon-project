import { createSlice } from '@reduxjs/toolkit';
import { getData, saveData } from '../../services/localStorageService';
import { STORAGE_KEYS, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, GST_PERCENTAGE, DEFAULT_OFFERS } from '../../utils/constants';

const storedCart = getData(STORAGE_KEYS.CART, []);

const calculateTotals = (items, coupon = null) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      const calc = (subtotal * coupon.discountValue) / 100;
      discountAmount = coupon.maxDiscount ? Math.min(calc, coupon.maxDiscount) : calc;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    }
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 || (coupon && coupon.discountType === 'free_delivery') ? 0 : DELIVERY_FEE;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gst = Math.round((taxableAmount * GST_PERCENTAGE) / 100);
  const grandTotal = Math.max(0, Math.round(taxableAmount + deliveryFee + gst));

  return {
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    deliveryFee,
    gst,
    grandTotal,
  };
};

const initialTotals = calculateTotals(storedCart);

const initialState = {
  items: storedCart,
  appliedCoupon: null,
  availableOffers: DEFAULT_OFFERS,
  ...initialTotals,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          unit: product.unit,
          image: product.image,
          category: product.category,
          quantity,
        });
      }

      saveData(STORAGE_KEYS.CART, state.items);
      const totals = calculateTotals(state.items, state.appliedCoupon);
      Object.assign(state, totals);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveData(STORAGE_KEYS.CART, state.items);
      const totals = calculateTotals(state.items, state.appliedCoupon);
      Object.assign(state, totals);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      saveData(STORAGE_KEYS.CART, state.items);
      const totals = calculateTotals(state.items, state.appliedCoupon);
      Object.assign(state, totals);
    },

    applyCoupon: (state, action) => {
      const couponCode = action.payload.toUpperCase();
      const foundCoupon = state.availableOffers.find((o) => o.code.toUpperCase() === couponCode);

      if (!foundCoupon) {
        throw new Error('Invalid coupon code');
      }

      if (state.subtotal < (foundCoupon.minOrder || 0)) {
        throw new Error(`Minimum order of ₹${foundCoupon.minOrder} required for this coupon`);
      }

      state.appliedCoupon = foundCoupon;
      const totals = calculateTotals(state.items, foundCoupon);
      Object.assign(state, totals);
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
      const totals = calculateTotals(state.items, null);
      Object.assign(state, totals);
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      saveData(STORAGE_KEYS.CART, []);
      const totals = calculateTotals([], null);
      Object.assign(state, totals);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
