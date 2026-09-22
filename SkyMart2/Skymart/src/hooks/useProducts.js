import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setFilter as setFilterAction,
  resetFilters as resetFiltersAction,
  setSortBy as setSortByAction,
  addProduct as addProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from '../redux/slices/productSlice';
import { sortProducts } from '../utils/helpers';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, filters, sortBy, searchQuery } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Price Filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      // Rating Filter
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }
      // In Stock Filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      // Organic Filter
      if (filters.isOrganicOnly && !product.isOrganic) {
        return false;
      }
      // Brand Filter
      if (filters.brand && filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      return true;
    });
  }, [products, filters, searchQuery]);

  const sortedAndFilteredProducts = useMemo(() => {
    return sortProducts(filteredProducts, sortBy);
  }, [filteredProducts, sortBy]);

  // Featured and Trending slices for Home Page
  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    [products]
  );
  const trendingProducts = useMemo(
    () => products.filter((p) => p.trending).slice(0, 8),
    [products]
  );

  const setFilter = (filterObj) => dispatch(setFilterAction(filterObj));
  const resetFilters = () => dispatch(resetFiltersAction());
  const setSortBy = (sortOption) => dispatch(setSortByAction(sortOption));
  const addProduct = (prod) => dispatch(addProductAction(prod));
  const updateProduct = (prod) => dispatch(updateProductAction(prod));
  const deleteProduct = (id) => dispatch(deleteProductAction(id));

  return {
    products,
    filteredProducts: sortedAndFilteredProducts,
    featuredProducts,
    trendingProducts,
    categories,
    filters,
    sortBy,
    searchQuery,
    setFilter,
    resetFilters,
    setSortBy,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
