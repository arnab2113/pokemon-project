import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoChevronBack } from 'react-icons/io5';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { updateOrderStatus } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../../components/UI/Badge';

export const ManageOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    toast.success(`Order ${orderId} status changed to ${newStatus}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/admin')} className="p-2 rounded-xl glass-panel text-slate-600">
          <IoChevronBack className="text-xl" />
        </button>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Manage Customer Orders ({orders.length})
        </h1>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Change Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-black text-brand-600 dark:text-brand-400">{order.id}</td>
                  <td className="p-4 text-slate-500">{dayjs(order.createdAt).format('DD MMM YYYY, h:mm A')}</td>
                  <td className="p-4 font-bold">{order.address?.fullName} ({order.address?.phone})</td>
                  <td className="p-4 font-black">{formatCurrency(order.summary.grandTotal)}</td>
                  <td className="p-4">
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'brand'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="py-1.5 px-2 rounded-xl glass-input text-xs font-bold"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Packing">Packing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
