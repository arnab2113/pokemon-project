import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/Product/ProductGrid';
import Pagination from '../../components/UI/Pagination';
import Button from '../../components/UI/Button';
import { IoFilter, IoRefresh } from 'react-icons/io5';

export const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    filteredProducts,
    categories,
    filters,
    sortBy,
    setFilter,
    resetFilters,
    setSortBy,
  } = useProducts();

  const currentCategorySlug = slug || 'all';

  // Sync route category slug with filters
  React.useEffect(() => {
    if (currentCategorySlug !== filters.category) {
      setFilter({ category: currentCategorySlug });
    }
  }, [currentCategorySlug]);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeCategoryObj = categories.find((c) => c.slug === currentCategorySlug);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Category Header */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{activeCategoryObj?.icon || '📦'}</span>{' '}
            {activeCategoryObj ? activeCategoryObj.name : 'All Groceries Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {activeCategoryObj?.description || 'Browse our entire catalog of 100% fresh groceries and home items'}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel text-xs font-bold"
          >
            <IoFilter /> Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-xl glass-input text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="featured">Featured First</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="rating_high_low">Highest Rated</option>
              <option value="discount_high_low">Biggest Discounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => navigate('/category/all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            currentCategorySlug === 'all'
              ? 'bg-brand-500 text-white shadow-glow'
              : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              currentCategorySlug === cat.slug
                ? 'bg-brand-500 text-white shadow-glow'
                : 'glass-panel text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Filter Sidebar */}
        <aside className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'} glass-panel p-5 rounded-3xl h-fit flex flex-col gap-6`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <IoFilter className="text-brand-500" /> Filter Products
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
            >
              <IoRefresh /> Reset
            </button>
          </div>

          {/* Price Range Slider */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Max Price: ₹{filters.maxPrice}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              step="20"
              value={filters.maxPrice}
              onChange={(e) => setFilter({ maxPrice: Number(e.target.value) })}
              className="w-full accent-brand-500"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Minimum Rating
            </label>
            {[4, 3, 2, 0].map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="radio"
                  name="ratingFilter"
                  checked={filters.minRating === rating}
                  onChange={() => setFilter({ minRating: rating })}
                  className="accent-brand-500"
                />
                <span>{rating === 0 ? 'All Ratings' : `★ ${rating}.0 & above`}</span>
              </label>
            ))}
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilter({ inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>
            <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>100% Organic Only</span>
              <input
                type="checkbox"
                checked={filters.isOrganicOnly}
                onChange={(e) => setFilter({ isOrganicOnly: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-500"
              />
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="md:col-span-3 flex flex-col justify-between">
          <ProductGrid products={paginatedProducts} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

      </div>

    </div>
  );
};

export default CategoryPage;
