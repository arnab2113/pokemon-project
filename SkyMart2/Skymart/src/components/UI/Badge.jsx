import React from 'react';

const badgeVariants = {
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  accent: 'bg-accent-500 text-white shadow-sm border-transparent',
  brand: 'bg-brand-500 text-white shadow-sm border-transparent',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide uppercase rounded-full border ${sizeClasses} ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
