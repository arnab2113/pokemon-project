import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoHeartOutline, IoTrashOutline } from 'react-icons/io5';
import ProductGrid from '../../components/Product/ProductGrid';
import Button from '../../components/UI/Button';
import { clearWishlist } from '../../redux/slices/wishlistSlice';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <IoHeartOutline className="text-rose-500" /> My Saved Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-slate-400">Save items here and add them to your cart with 1-click</p>
        </div>

        {wishlistItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearWishlist())}
            icon={IoTrashOutline}
            className="text-rose-500 hover:bg-rose-50"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center gap-4">
          <span className="text-5xl">❤️</span>
          <h2 className="text-lg font-bold">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 max-w-xs">
            Explore our fresh grocery catalog and tap the heart icon to save products for later.
          </p>
          <Button onClick={() => navigate('/category/all')}>Explore Groceries</Button>
        </div>
      ) : (
        <ProductGrid products={wishlistItems} />
      )}
    </div>
  );
};

export default WishlistPage;
