import React from 'react';
import { CgSpinner } from 'react-icons/cg';

export const Loader = ({ fullPage = false, text = 'Loading SkyMart...' }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md">
        <div className="glass-card p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-glow">
            <CgSpinner className="text-3xl animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <CgSpinner className="text-3xl text-brand-500 animate-spin" />
      {text && <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{text}</p>}
    </div>
  );
};

export default Loader;
