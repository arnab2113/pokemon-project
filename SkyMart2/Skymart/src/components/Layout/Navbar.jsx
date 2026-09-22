import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoSearch,
  IoCartOutline,
  IoHeartOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoShieldCheckmarkOutline,
  IoMenu,
} from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../hooks/useTheme';
import { toggleSearchModal } from '../../redux/slices/searchSlice';
import { toggleMobileMenu, toggleCartDrawer } from '../../redux/slices/uiSlice';
import { APP_NAME } from '../../utils/constants';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { totalItemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const userLocation = useSelector((state) => state.ui.userLocation);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => dispatch(toggleMobileMenu(true))}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <IoMenu className="text-2xl" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform">
                <span className="text-xl font-black tracking-tighter"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  {APP_NAME} <span className="text-emerald-500 text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950">EXPRESS</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">10 MIN GROCERY</span>
              </div>
            </Link>

            {/* Delivery Location pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-xs font-medium border border-slate-200 dark:border-slate-700/60">
              <IoLocationOutline className="text-emerald-500 text-base animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Deliver to</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                  {userLocation}
                </span>
              </div>
            </div>
          </div>

          {/* Search Trigger */}
          <div className="flex-1 max-w-xl">
            <div
              onClick={() => dispatch(toggleSearchModal(true))}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-input cursor-pointer hover:border-emerald-500 transition-all group"
            >
              <IoSearch className="text-slate-400 group-hover:text-emerald-500 text-lg" />
              <span className="text-xs text-slate-400 font-medium truncate">
                Search...
              </span>
              <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl glass-panel text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Toggle Theme"
            >
              {isDark ? <IoSunnyOutline className="text-xl text-amber-400" /> : <IoMoonOutline className="text-xl text-slate-700" />}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-2xl glass-panel text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-500 transition-all"
              title="Wishlist"
            >
              <IoHeartOutline className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleCartDrawer(true))}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-glow transition-all"
            >
              <IoCartOutline className="text-xl" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-emerald-700 text-xs font-black">
                  {totalItemCount}
                </span>
              )}
            </motion.button>

            {/* User / Admin Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800"
                  >
                    <IoShieldCheckmarkOutline className="text-base" /> Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-500"
                  />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl glass-panel text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <IoPersonOutline className="text-base text-emerald-500" /> Login
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
