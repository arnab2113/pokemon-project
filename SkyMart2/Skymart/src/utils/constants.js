// Application Constants & Configuration

export const APP_NAME = 'SkyMart';
export const APP_TAGLINE = 'Superfast Grocery Delivery in Minutes';

// LocalStorage DB Keys
export const STORAGE_KEYS = {
  USERS: 'skymart_users',
  CURRENT_USER: 'skymart_current_user',
  PRODUCTS: 'skymart_products',
  CATEGORIES: 'skymart_categories',
  CART: 'skymart_cart',
  WISHLIST: 'skymart_wishlist',
  ORDERS: 'skymart_orders',
  OFFERS: 'skymart_offers',
  NOTIFICATIONS: 'skymart_notifications',
  SETTINGS: 'skymart_settings',
};

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Financial Defaults
export const DELIVERY_FEE = 29;
export const FREE_DELIVERY_THRESHOLD = 499;
export const GST_PERCENTAGE = 5;

// User Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Available Categories
export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Fresh Vegetables', slug: 'vegetables', icon: '🥦', description: 'Farm fresh organic vegetables delivered daily' },
  { id: 'cat-2', name: 'Fresh Fruits', slug: 'fruits', icon: '🍎', description: 'Handpicked fresh and juicy seasonal fruits' },
  { id: 'cat-3', name: 'Dairy & Eggs', slug: 'dairy-eggs', icon: '🥛', description: 'Fresh milk, butter, cheese, paneer & eggs' },
  { id: 'cat-4', name: 'Bakery & Snacks', slug: 'bakery-snacks', icon: '🍞', description: 'Artisanal breads, cookies, chips & munchies' },
  { id: 'cat-5', name: 'Beverages', slug: 'beverages', icon: '🥤', description: 'Fresh juices, cold drinks, tea & coffee' },
  { id: 'cat-6', name: 'Instant & Frozen', slug: 'instant-frozen', icon: '🍕', description: 'Quick 2-min noodles, frozen snacks & ready meals' },
  { id: 'cat-7', name: 'Personal Care', slug: 'personal-care', icon: '🧼', description: 'Soaps, shampoos, skincare & hygiene essentials' },
  { id: 'cat-8', name: 'Household Essentials', slug: 'household', icon: '🧹', description: 'Detergents, cleaners, tissue papers & utility items' },
];

// Coupons / Offers Database
export const DEFAULT_OFFERS = [
  { code: 'FRESH50', discountType: 'percentage', discountValue: 15, maxDiscount: 100, minOrder: 299, description: '15% off on orders above ₹299 (Max ₹100)' },
  { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, maxDiscount: 150, minOrder: 199, description: '20% off for new shoppers! (Max ₹150)' },
  { code: 'SKY100', discountType: 'fixed', discountValue: 100, minOrder: 699, description: 'Flat ₹100 OFF on mega orders above ₹699' },
  { code: 'FREEDEL', discountType: 'free_delivery', discountValue: DELIVERY_FEE, minOrder: 0, description: 'Free delivery on your next order!' },
];
