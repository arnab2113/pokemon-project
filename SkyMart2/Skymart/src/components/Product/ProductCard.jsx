import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHeart, IoHeartOutline, IoAdd, IoRemove } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { useCart } from '../../hooks/useCart';
import { formatCurrency, calculateSavings } from '../../utils/helpers';
import Badge from '../UI/Badge';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { items: cartItems, addToCart, updateQuantity } = useCart();

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group cursor-pointer glass-card rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden h-full border border-slate-200/80 dark:border-slate-800"
    >
      {/* Badges & Wishlist */}
      <div className="flex items-center justify-between z-10 w-full mb-2">
        <div className="flex flex-col gap-1 items-start">
          {product.discount > 0 && (
            <Badge variant="accent">{product.discount}% OFF</Badge>
          )}
          {product.isOrganic && (
            <Badge variant="success" size="sm">ORGANIC</Badge>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          className="p-2 rounded-full glass-panel hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors shadow-sm"
          aria-label="Wishlist"
        >
          {isWishlisted ? (
            <IoHeart className="text-lg fill-rose-500 text-rose-500" />
          ) : (
            <IoHeartOutline className="text-lg text-slate-400 group-hover:text-rose-500" />
          )}
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full h-36 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-rose-600 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {product.brand}
        </span>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mt-0.5 group-hover:text-brand-500 transition-colors">
          {product.name}
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {product.unit}
        </span>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Cart Control Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          ⚡ 10 Mins Delivery
        </span>

        {quantityInCart === 0 ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={!product.inStock}
            onClick={() => addToCart(product, 1)}
            className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white dark:bg-brand-950/60 dark:text-brand-300 dark:hover:bg-brand-500 dark:hover:text-white font-bold text-xs border border-brand-200 dark:border-brand-800 transition-all duration-200 shadow-sm"
          >
            ADD
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 bg-brand-500 text-white rounded-xl px-2 py-1 shadow-glow">
            <button
              onClick={() => updateQuantity(product.id, quantityInCart - 1)}
              className="p-1 hover:bg-brand-600 rounded-md transition-colors"
            >
              <IoRemove className="text-xs" />
            </button>
            <span className="text-xs font-bold w-4 text-center">{quantityInCart}</span>
            <button
              onClick={() => updateQuantity(product.id, quantityInCart + 1)}
              className="p-1 hover:bg-brand-600 rounded-md transition-colors"
            >
              <IoAdd className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
