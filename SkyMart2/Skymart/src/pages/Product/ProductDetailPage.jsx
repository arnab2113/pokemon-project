import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoHeart, IoHeartOutline, IoAdd, IoRemove, IoFlash, IoShieldCheckmark, IoTime } from 'react-icons/io5';
import { useCart } from '../../hooks/useCart';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { formatCurrency, calculateSavings } from '../../utils/helpers';
import Rating from '../../components/Product/Rating';
import ProductGrid from '../../components/Product/ProductGrid';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { addToCart, items: cartItems, updateQuantity } = useCart();

  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id) || products[0];
  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);

  const cartItem = cartItems.find((item) => item.id === product?.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-12">
      
      {/* Detail Main Card */}
      <div className="glass-panel p-6 md:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left: Image Box & Zoom */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-center overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="object-contain h-full w-full hover:scale-110 transition-transform duration-500"
            />

            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className="absolute top-4 right-4 p-3 rounded-full glass-panel hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 shadow-md transition-colors"
            >
              {isWishlisted ? (
                <IoHeart className="text-2xl fill-rose-500" />
              ) : (
                <IoHeartOutline className="text-2xl text-slate-400" />
              )}
            </button>

            {product.discount > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="accent" size="lg">{product.discount}% OFF</Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 text-xs font-bold flex items-center gap-2 flex-1">
              <IoFlash className="text-base" /> Superfast 10 Mins Delivery
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center gap-2 flex-1">
              <IoShieldCheckmark className="text-base" /> Freshness Guaranteed
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {product.brand}
              </span>
              {product.isOrganic && <Badge variant="success">100% ORGANIC</Badge>}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              {product.name}
            </h1>

            <Rating value={product.rating} count={product.reviewsCount} size="md" />

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                  Save {formatCurrency(calculateSavings(product.originalPrice, product.price))}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Table */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Origin</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {product.specifications?.origin || 'India'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Shelf Life</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {product.specifications?.shelfLife || '3-5 Days'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Unit Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{product.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Storage</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {product.specifications?.storage || 'Cool Dry Place'}
                </span>
              </div>
            </div>
          </div>

          {/* Quantity Selector & Add Actions */}
          <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            {quantityInCart > 0 ? (
              <div className="flex items-center gap-3 bg-brand-500 text-white rounded-2xl px-4 py-3 shadow-glow">
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="p-1 hover:bg-brand-600 rounded-lg"
                >
                  <IoRemove className="text-lg" />
                </button>
                <span className="font-bold text-sm w-6 text-center">{quantityInCart} in cart</span>
                <button
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="p-1 hover:bg-brand-600 rounded-lg"
                >
                  <IoAdd className="text-lg" />
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-4 text-sm"
              >
                Add {quantity} to Cart • {formatCurrency(product.price * quantity)}
              </Button>
            )}
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Similar Products You Might Like
          </h3>
          <ProductGrid products={relatedProducts} />
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
