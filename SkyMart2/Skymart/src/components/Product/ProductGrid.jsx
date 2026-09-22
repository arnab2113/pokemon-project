import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../UI/Skeleton';

export const ProductGrid = ({ products = [], isLoading = false, skeletonCount = 8 }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">🥦</span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Products Found</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
