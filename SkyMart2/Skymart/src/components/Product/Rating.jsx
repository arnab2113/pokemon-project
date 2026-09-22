import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

export const Rating = ({ value = 0, count, size = 'sm', className = '' }) => {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<IoStar key={i} className="text-amber-400" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<IoStarHalf key={i} className="text-amber-400" />);
    } else {
      stars.push(<IoStarOutline key={i} className="text-slate-300 dark:text-slate-600" />);
    }
  }

  const iconSizes = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className={`flex items-center gap-0.5 ${iconSizes}`}>{stars}</div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-[11px] text-slate-400 dark:text-slate-500">({count})</span>
      )}
    </div>
  );
};

export default Rating;
