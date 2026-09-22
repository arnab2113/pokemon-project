import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  clearCart as clearCartAction,
} from '../redux/slices/cartSlice';
import { toggleCartDrawer as toggleCartDrawerAction } from '../redux/slices/uiSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const isCartDrawerOpen = useSelector((state) => state.ui.isCartDrawerOpen);

  const addToCart = (product, quantity = 1) => dispatch(addToCartAction({ product, quantity }));
  const removeFromCart = (id) => dispatch(removeFromCartAction(id));
  const updateQuantity = (id, quantity) => dispatch(updateQuantityAction({ id, quantity }));
  const applyCoupon = (code) => dispatch(applyCouponAction(code));
  const removeCoupon = () => dispatch(removeCouponAction());
  const clearCart = () => dispatch(clearCartAction());
  const toggleCartDrawer = (open) => dispatch(toggleCartDrawerAction(open));

  const totalItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    ...cart,
    totalItemCount,
    isCartDrawerOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    toggleCartDrawer,
  };
};
