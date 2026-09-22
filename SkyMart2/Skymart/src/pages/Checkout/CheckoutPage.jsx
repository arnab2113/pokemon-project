import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { addressSchema } from '../../utils/validators';
import { createOrder } from '../../redux/slices/orderSlice';
import { formatCurrency, generateOrderID } from '../../utils/helpers';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { items, subtotal, deliveryFee, gst, grandTotal, discountAmount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {
    fullName: user?.name || '',
    phone: user?.phone || '',
    houseNo: '',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    addressType: 'Home',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultAddress,
  });

  const handlePlaceOrder = (addressData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    const newOrder = {
      id: generateOrderID(),
      userId: user?.id || 'guest',
      items: [...items],
      address: addressData,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid',
      summary: {
        subtotal,
        discount: discountAmount,
        deliveryFee,
        gst,
        grandTotal,
      },
      status: 'Processing',
      createdAt: new Date().toISOString(),
    };

    dispatch(createOrder(newOrder));
    setCreatedOrder(newOrder);
    clearCart();
    setIsSuccessModalOpen(true);

    // Trigger celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center gap-4 max-w-md mx-auto my-12">
        <span className="text-5xl">🛒</span>
        <h2 className="text-xl font-bold">No Items to Checkout</h2>
        <p className="text-xs text-slate-500">Please add items to your shopping cart before placing an order.</p>
        <Button onClick={() => navigate('/category/all')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">
        Checkout & Express Delivery
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Address & Payment Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Address Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📍</span> 1. Delivery Address
            </h3>

            <form id="checkout-form" onSubmit={handleSubmit(handlePlaceOrder)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
              <Input label="Phone Number" {...register('phone')} error={errors.phone?.message} />
              <Input label="Flat / House No" {...register('houseNo')} error={errors.houseNo?.message} />
              <Input label="Street / Area Name" {...register('street')} error={errors.street?.message} />
              <Input label="City" {...register('city')} error={errors.city?.message} />
              <Input label="State" {...register('state')} error={errors.state?.message} />
              <Input label="Pincode" {...register('pincode')} error={errors.pincode?.message} />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Address Type</label>
                <select
                  {...register('addressType')}
                  className="py-2.5 px-3 rounded-xl glass-input text-xs font-bold outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </form>
          </div>

          {/* Payment Method Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💳</span> 2. Select Payment Option
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI', label: 'Instant UPI', desc: 'Google Pay / PhonePe' },
                { id: 'Card', label: 'Credit/Debit Card', desc: 'Visa / Mastercard' },
                { id: 'Netbanking', label: 'Netbanking', desc: 'All Major Banks' },
                { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when delivered' },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col gap-1 ${
                    paymentMethod === method.id
                      ? 'border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300 font-bold shadow-glow'
                      : 'border-slate-200 dark:border-slate-800 glass-card text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{method.label}</span>
                  <span className="text-[10px] text-slate-400">{method.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Summary & Place Order */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 sticky top-24">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Order Summary ({items.length} Items)
            </h3>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 border-b border-slate-100 dark:border-slate-800 pb-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                  <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>To Pay</span>
                <span className="text-brand-500">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              variant="primary"
              size="lg"
              className="w-full mt-2 py-4"
            >
              Place Order • {formatCurrency(grandTotal)}
            </Button>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => navigate('/orders')}
        title="🎉 Order Placed Successfully!"
      >
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-4xl flex items-center justify-center">
            ✓
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Order ID: {createdOrder?.id}
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Express Delivery Initiated!
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Your fresh groceries are being packed at your nearest SkyMart dark store. Delivery expected in 10 minutes!
          </p>
          <div className="flex gap-3 w-full mt-2">
            <Button variant="outline" size="md" className="flex-1" onClick={() => navigate('/orders')}>
              Track Order
            </Button>
            <Button variant="primary" size="md" className="flex-1" onClick={() => navigate('/')}>
              Keep Shopping
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default CheckoutPage;
