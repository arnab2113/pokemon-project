import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoHomeOutline,
  IoGridOutline,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import Drawer from '../UI/Drawer';
import { toggleMobileMenu } from '../../redux/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { DEFAULT_CATEGORIES } from '../../utils/constants';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleClose = () => dispatch(toggleMobileMenu(false));

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Menu Navigation" position="left">
      <div className="flex flex-col gap-6">
        
        {/* User Card */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl glass-card">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-brand-500"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user?.name}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-brand-500 text-white flex flex-col gap-3 shadow-glow">
            <span className="text-sm font-bold">Welcome to SkyMart!</span>
            <p className="text-xs text-brand-100">Sign in to unlock exclusive deals and track 10-min orders.</p>
            <Link
              to="/login"
              onClick={handleClose}
              className="w-full py-2 bg-white text-brand-700 font-bold rounded-xl text-xs text-center shadow-sm"
            >
              Login / Register
            </Link>
          </div>
        )}

        {/* Main Links */}
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <IoHomeOutline className="text-lg text-brand-500" /> Home
          </Link>
          <Link
            to="/cart"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <IoCartOutline className="text-lg text-brand-500" /> Shopping Cart
          </Link>
          <Link
            to="/wishlist"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <IoHeartOutline className="text-lg text-rose-500" /> My Wishlist
          </Link>
          <Link
            to="/orders"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <IoReceiptOutline className="text-lg text-amber-500" /> My Orders
          </Link>
          <Link
            to="/profile"
            onClick={handleClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <IoPersonOutline className="text-lg text-blue-500" /> Account Profile
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={handleClose}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-sm"
            >
              <IoShieldCheckmarkOutline className="text-lg text-purple-600" /> Admin Dashboard
            </Link>
          )}
        </div>

        {/* Categories Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2 block px-4">
            Browse Categories
          </span>
          <div className="flex flex-col gap-1">
            {DEFAULT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
              handleClose();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-auto"
          >
            <IoLogOutOutline className="text-lg" /> Logout Account
          </button>
        )}

      </div>
    </Drawer>
  );
};

export default Sidebar;
