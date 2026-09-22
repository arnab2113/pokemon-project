import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoHomeOutline, IoSearchOutline, IoCartOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import { toggleSearchModal } from '../../redux/slices/searchSlice';
import { toggleCartDrawer } from '../../redux/slices/uiSlice';

export const MobileNav = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.items.reduce((acc, i) => acc + i.quantity, 0));
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/' ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <IoHomeOutline className="text-xl" />
          <span>Home</span>
        </Link>

        <button
          onClick={() => dispatch(toggleSearchModal(true))}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400"
        >
          <IoSearchOutline className="text-xl" />
          <span>Search</span>
        </button>

        <button
          onClick={() => dispatch(toggleCartDrawer(true))}
          className="relative flex flex-col items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400"
        >
          <IoCartOutline className="text-xl text-brand-500" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 px-1.5 py-0.5 rounded-full bg-brand-500 text-white text-[9px] font-black">
              {cartCount}
            </span>
          )}
        </button>

        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/wishlist' ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <IoHeartOutline className="text-xl" />
          <span>Saved</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            location.pathname === '/profile' ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <IoPersonOutline className="text-xl" />
          <span>Profile</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileNav;
