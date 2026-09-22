import React from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
        aria-label="Previous Page"
      >
        <IoChevronBack />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
            currentPage === page
              ? 'bg-brand-500 text-white shadow-glow'
              : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
        aria-label="Next Page"
      >
        <IoChevronForward />
      </button>
    </div>
  );
};

export default Pagination;
