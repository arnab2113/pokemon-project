import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = 'text',
      className = '',
      containerClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-slate-400 dark:text-slate-500 text-lg pointer-events-none">
              <Icon />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all ${
              Icon ? 'pl-10 pr-4' : 'px-4'
            } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs font-medium text-rose-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
