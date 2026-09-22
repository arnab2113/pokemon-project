import React from 'react';
import { IoAdd, IoRemove, IoTrashOutline } from 'react-icons/io5';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl glass-card border border-slate-100 dark:border-slate-800">
      {/* Product Image */}
      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1 shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="object-contain w-full h-full" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
        <span className="text-[11px] text-slate-400 block mt-0.5">{item.unit}</span>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(item.price * item.quantity)}
          </span>
          {item.originalPrice > item.price && (
            <span className="text-[10px] text-slate-400 line-through">
              {formatCurrency(item.originalPrice * item.quantity)}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <IoRemove className="text-xs" />
          </button>
          <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <IoAdd className="text-xs" />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(item.id)}
          className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors"
          title="Remove Item"
        >
          <IoTrashOutline className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
