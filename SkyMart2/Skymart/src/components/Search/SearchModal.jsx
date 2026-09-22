import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearch, IoTimeOutline, IoClose, IoTrashOutline } from 'react-icons/io5';
import Modal from '../UI/Modal';
import {
  toggleSearchModal,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../../redux/slices/searchSlice';
import { setSearchQuery } from '../../redux/slices/productSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { formatCurrency } from '../../utils/helpers';

export const SearchModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearchOpen = useSelector((state) => state.search.isSearchOpen);
  const recentSearches = useSelector((state) => state.search.recentSearches);
  const products = useSelector((state) => state.product.products);

  const [inputVal, setInputVal] = useState('');
  const debouncedTerm = useDebounce(inputVal, 250);

  const handleClose = () => {
    dispatch(toggleSearchModal(false));
    setInputVal('');
  };

  const suggestions = debouncedTerm.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(debouncedTerm.toLowerCase()) || p.brand.toLowerCase().includes(debouncedTerm.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSelectSearch = (term) => {
    dispatch(addRecentSearch(term));
    dispatch(setSearchQuery(term));
    handleClose();
    navigate('/category/all');
  };

  const handleProductClick = (productId) => {
    if (inputVal) dispatch(addRecentSearch(inputVal));
    handleClose();
    navigate(`/product/${productId}`);
  };

  return (
    <Modal isOpen={isSearchOpen} onClose={handleClose} title="Search SkyMart Catalog" maxWidth="max-w-xl">
      <div className="flex flex-col gap-4">
        
        {/* Search Bar Input */}
        <div className="relative">
          <IoSearch className="absolute left-3.5 top-3.5 text-slate-400 text-lg" />
          <input
            type="text"
            autoFocus
            placeholder="Search broccoli, milk, fruits, soap..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-sm font-semibold"
          />
          {inputVal && (
            <button
              onClick={() => setInputVal('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <IoClose className="text-lg" />
            </button>
          )}
        </div>

        {/* Live Search Suggestions */}
        {debouncedTerm.trim() && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Matching Products ({suggestions.length})
            </span>
            {suggestions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No matching products found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-contain rounded-lg" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{product.name}</span>
                        <span className="text-[10px] text-slate-400">{product.unit} • {product.brand}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-brand-500">{formatCurrency(product.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent Search Tags */}
        {!debouncedTerm.trim() && recentSearches.length > 0 && (
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IoTimeOutline /> Recent Searches
              </span>
              <button
                onClick={() => dispatch(clearRecentSearches())}
                className="text-[11px] text-rose-500 hover:underline flex items-center gap-1"
              >
                <IoTrashOutline /> Clear All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-300 cursor-pointer transition-all"
                  onClick={() => handleSelectSearch(term)}
                >
                  <span>{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeRecentSearch(term));
                    }}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <IoClose className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default SearchModal;
