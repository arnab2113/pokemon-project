import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  IoBarChartOutline,
  IoCubeOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoAddCircleOutline,
  IoPencil,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoGridOutline,
} from 'react-icons/io5';

import { formatCurrency } from '../../utils/helpers';
import { deleteProduct } from '../../redux/slices/productSlice';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const orders = useSelector((state) => state.order.orders);
  const users = useSelector((state) => state.auth.users);
  const categories = useSelector((state) => state.category.categories);

  const totalRevenue = orders.reduce((acc, order) => {
    return order.status !== 'Cancelled' ? acc + (order.summary?.grandTotal || 0) : acc;
  }, 0);

  const analyticsCards = [
    { title: 'Total Gross Revenue', value: formatCurrency(totalRevenue), icon: IoBarChartOutline, color: 'bg-emerald-500', glow: 'shadow-glow' },
    { title: 'Total Customer Orders', value: orders.length, icon: IoReceiptOutline, color: 'bg-amber-500', glow: '' },
    { title: 'Catalog Products', value: products.length, icon: IoCubeOutline, color: 'bg-blue-500', glow: '' },
    { title: 'Registered Users', value: users.length, icon: IoPeopleOutline, color: 'bg-purple-500', glow: '' },
  ];

  const handleDeleteProd = (id) => {
    if (window.confirm('Delete this product from catalog?')) {
      dispatch(deleteProduct(id));
      toast.success('Product deleted');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-2">
      
      {/* Admin Top Navigation & Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-slate-900/60 to-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest">
              👑 ADMIN WORKSPACE
            </span>
            <span className="text-xs text-purple-400 font-semibold">SkyMart Back-Office v2.0</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            Store Management Dashboard
          </h1>
        </div>

        {/* Quick Admin Tab Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin">
            <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700">
              📊 Overview
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="ghost" size="sm" className="glass-panel">
              📦 Products ({products.length})
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="ghost" size="sm" className="glass-panel">
              🏷️ Categories ({categories.length})
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" className="glass-panel">
              📋 Orders ({orders.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card rounded-3xl p-5 flex items-center justify-between border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">{card.value}</span>
              </div>
              <div className={`p-3.5 rounded-2xl text-white shadow-md ${card.color} ${card.glow}`}>
                <Icon className="text-xl" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Modules Quick Launch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/admin/products')}
          className="glass-card p-6 rounded-3xl cursor-pointer hover:border-purple-500 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📦
            </div>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Product CRUD</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Product Catalog</h3>
            <p className="text-xs text-slate-400 mt-1">Add new items, update prices, discounts, stock levels, or delete products.</p>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">Open Product Editor →</Button>
        </div>

        <div
          onClick={() => navigate('/admin/orders')}
          className="glass-card p-6 rounded-3xl cursor-pointer hover:border-purple-500 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <span className="text-xs font-extrabold text-amber-500 uppercase tracking-wider">Live Fulfillment</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Customer Orders</h3>
            <p className="text-xs text-slate-400 mt-1">Track incoming orders and update delivery status from Processing to Delivered.</p>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">Open Order Queue →</Button>
        </div>

        <div
          onClick={() => navigate('/admin/categories')}
          className="glass-card p-6 rounded-3xl cursor-pointer hover:border-purple-500 transition-all flex flex-col justify-between gap-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏷️
            </div>
            <span className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Category Master</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Categories</h3>
            <p className="text-xs text-slate-400 mt-1">Create new category tags, assign icons, or clean up obsolete categories.</p>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">Open Category Suite →</Button>
        </div>
      </div>

      {/* Recent Catalog Preview Table */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Inventory Items</h3>
          <Link to="/admin/products" className="text-xs font-bold text-purple-500 hover:underline">
            View All ({products.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Discount</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {products.slice(0, 5).map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-9 h-9 object-contain rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <span className="font-bold text-slate-900 dark:text-white">{prod.name}</span>
                    </div>
                  </td>
                  <td className="p-3 uppercase font-bold text-slate-500">{prod.category}</td>
                  <td className="p-3 font-black">{formatCurrency(prod.price)}</td>
                  <td className="p-3 font-bold text-emerald-500">{prod.discount}% OFF</td>
                  <td className="p-3 font-bold">{prod.stock} pcs</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => navigate('/admin/products')}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white transition-colors"
                    >
                      <IoPencil />
                    </button>
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

export default AdminDashboard;
