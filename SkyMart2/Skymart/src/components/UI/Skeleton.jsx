import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
      <Skeleton className="w-full h-44 rounded-xl" />
      <Skeleton className="w-16 h-4 rounded-full" />
      <Skeleton className="w-3/4 h-5 rounded" />
      <Skeleton className="w-1/2 h-4 rounded" />
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="w-20 h-6 rounded" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
