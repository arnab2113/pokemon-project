import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoCheckmarkCircle, IoTimeOutline, IoLocationOutline, IoChevronBack } from 'react-icons/io5';
import dayjs from 'dayjs';

import { formatCurrency } from '../../utils/helpers';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.order.orders);

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center">
        <h2>Order Not Found</h2>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const steps = ['Processing', 'Packing', 'Out for Delivery', 'Delivered'];
  const currentStepIndex = order.status === 'Cancelled' ? -1 : steps.indexOf(order.status) !== -1 ? steps.indexOf(order.status) : 1;

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100"
        >
          <IoChevronBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Order Details: {order.id}</h1>
          <span className="text-xs text-slate-400">Placed on {dayjs(order.createdAt).format('DD MMMM YYYY, h:mm A')}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Live Tracking Timeline</h3>
        
        {order.status === 'Cancelled' ? (
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold text-center">
            This order was cancelled.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 pt-2">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isCompleted ? 'bg-brand-500 text-white shadow-glow' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <IoCheckmarkCircle className="text-xl" /> : idx + 1}
                  </div>
                  <span className={`text-[11px] font-bold ${isCompleted ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Address & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-3xl text-xs flex flex-col gap-2">
          <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <IoLocationOutline className="text-brand-500" /> Delivery Address
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{order.address?.fullName}</span>
          <span className="text-slate-500">{order.address?.houseNo}, {order.address?.street}</span>
          <span className="text-slate-500">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</span>
          <span className="text-slate-500 font-semibold mt-1">📞 {order.address?.phone}</span>
        </div>

        <div className="glass-panel p-5 rounded-3xl text-xs flex flex-col gap-2">
          <span className="font-extrabold text-slate-900 dark:text-white">Payment & Billing</span>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Mode</span>
            <span className="font-bold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Status</span>
            <span className="font-bold text-emerald-500">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 text-sm font-black text-brand-500">
            <span>Grand Total</span>
            <span>{formatCurrency(order.summary.grandTotal)}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OrderDetailsPage;
