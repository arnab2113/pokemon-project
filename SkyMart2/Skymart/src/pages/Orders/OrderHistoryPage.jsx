import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoReceiptOutline, IoRefreshCircle, IoCloseCircle } from 'react-icons/io5';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import { cancelOrder } from '../../redux/slices/orderSlice';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/helpers';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const currentUser = useSelector((state) => state.auth.user);
  const { addToCart } = useCart();

  const userOrders = orders.filter(
    (o) => o.userId === currentUser?.id || currentUser?.role === 'admin'
  );

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.quantity);
    });
    toast.success('Items added to cart!');
    navigate('/cart');
  };

  const handleCancel = (orderId) => {
    dispatch(cancelOrder(orderId));
    toast.success('Order cancelled');
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Out for Delivery': return 'brand';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <IoReceiptOutline className="text-brand-500" /> My Orders ({userOrders.length})
        </h1>
      </div>

      {userOrders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <span className="text-5xl">📦</span>
          <h2 className="text-lg font-bold">No Past Orders Found</h2>
          <p className="text-xs text-slate-500">You haven't placed any grocery orders yet.</p>
          <Button onClick={() => navigate('/')}>Start Shopping</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col gap-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{order.id}</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {dayjs(order.createdAt).format('DD MMM YYYY, h:mm A')}
                </span>
              </div>

              {/* Items Preview */}
              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.unit} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Paid ({order.paymentMethod})</span>
                  <span className="text-base font-black text-brand-500">{formatCurrency(order.summary.grandTotal)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(order.id)}
                      icon={IoCloseCircle}
                      className="text-rose-500 hover:bg-rose-50"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(order)}
                    icon={IoRefreshCircle}
                  >
                    Reorder Items
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Timeline
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
