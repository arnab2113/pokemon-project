// Helper Utilities

/**
 * Format amount into Indian Rupee currency string
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Calculate discounted price
 */
export const calculateDiscountPrice = (originalPrice, discountPercentage) => {
  const price = Number(originalPrice) || 0;
  const discount = Number(discountPercentage) || 0;
  if (!discount || discount <= 0) return price;
  const discounted = price - (price * discount) / 100;
  return Math.round(discounted);
};

/**
 * Calculate percentage savings
 */
export const calculateSavings = (originalPrice, discountedPrice) => {
  return Math.max(0, Math.round((originalPrice - discountedPrice)));
};

/**
 * Generate a random Order ID like SM-849201
 */
export const generateOrderID = () => {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SM-${randomDigits}`;
};

/**
 * Truncate string with ellipsis
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Debounce helper function for performance optimization
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

/**
 * Sort products array
 */
export const sortProducts = (products = [], sortBy = 'featured') => {
  const list = [...products];
  switch (sortBy) {
    case 'price_low_high':
      return list.sort((a, b) => a.price - b.price);
    case 'price_high_low':
      return list.sort((a, b) => b.price - a.price);
    case 'rating_high_low':
      return list.sort((a, b) => b.rating - a.rating);
    case 'discount_high_low':
      return list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    case 'name_asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
};
