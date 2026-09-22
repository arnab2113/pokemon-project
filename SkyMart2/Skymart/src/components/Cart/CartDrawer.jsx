import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoTicketOutline, IoArrowForward, IoCheckmarkCircle } from 'react-icons/io5';
import Drawer from '../UI/Drawer';
import CartItem from './CartItem';
import Button from '../UI/Button';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const {
    items,
    isCartDrawerOpen,
    toggleCartDrawer,
    subtotal,
    deliveryFee,
    gst,
    grandTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      applyCoupon(couponCode);
      toast.success(`Coupon ${couponCode.toUpperCase()} applied!`);
      setCouponCode('');
    } catch (err) {
      toast.error(err.message || 'Failed to apply coupon');
    }
  };

  const handleCheckout = () => {
    toggleCartDrawer(false);
    navigate('/checkout');
  };

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => toggleCartDrawer(false)}
      title={`My Cart (${items.reduce((acc, i) => acc + i.quantity, 0)} Items)`}
      position="right"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-4xl text-emerald-500">
            🛒
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your Cart is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs">
            Looks like you haven't added any fresh groceries to your cart yet.
          </p>
          <Button
            onClick={() => toggleCartDrawer(false)}
            variant="primary"
            size="md"
            className="mt-2"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 h-full justify-between">
          
          {/* Cart Item List */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[48vh] pr-1">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Bill & Coupons */}
          <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
            
            {/* Coupon Box */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <IoCheckmarkCircle className="text-base" /> Applied: {appliedCoupon.code}
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <IoTicketOutline className="absolute left-3 top-3 text-slate-400 text-base" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FRESH50)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl text-xs glass-input uppercase font-bold"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm">
                  Apply
                </Button>
              </form>
            )}

            {/* Bill Summary */}
            <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge (10 Mins)</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold">{formatCurrency(gst)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-emerald-500">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Button
              onClick={handleCheckout}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-between py-3.5"
            >
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-100">Proceeding to Pay</span>
                <span className="text-sm font-black">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Checkout</span>
                <IoArrowForward className="text-lg" />
              </div>
            </Button>

          </div>

        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
