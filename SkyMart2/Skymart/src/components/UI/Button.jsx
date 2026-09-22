import React from 'react';
import { motion } from 'framer-motion';
import { CgSpinner } from 'react-icons/cg';

const variants = {
  primary:
    'bg-brand-500 hover:bg-brand-600 text-white shadow-glow hover:shadow-lg focus:ring-brand-500',
  secondary:
    'bg-accent-500 hover:bg-accent-600 text-white shadow-subtle focus:ring-accent-500',
  outline:
    'border border-brand-500 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/30 focus:ring-brand-500',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-slate-400',
  danger:
    'bg-rose-500 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3 text-base font-bold rounded-2xl gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: isDisabled || isLoading ? 1 : 0.96 }}
      whileHover={{ scale: isDisabled || isLoading ? 1 : 1.01 }}
      transition={{ duration: 0.15 }}
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin text-lg" />
      ) : (
        <>
          {Icon && <Icon className="text-lg" />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
