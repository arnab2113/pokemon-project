import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register Schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9+ -]+$/, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Checkout Address Schema
export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  houseNo: z.string().min(1, 'House / Flat number is required'),
  street: z.string().min(3, 'Street / Area name is required'),
  city: z.string().min(2, 'City name is required'),
  state: z.string().min(2, 'State name is required'),
  pincode: z.string().length(6, 'Pincode must be exactly 6 digits').regex(/^[0-9]+$/, 'Pincode must be numbers only'),
  addressType: z.enum(['Home', 'Work', 'Other']),
  isDefault: z.boolean().optional(),
});

// Admin Product Schema
export const productSchema = z.object({
  name: z.string().min(3, 'Product title must be at least 3 characters'),
  category: z.string().min(1, 'Category selection is required'),
  brand: z.string().min(2, 'Brand name is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  originalPrice: z.coerce.number().positive('Original price must be greater than 0'),
  discount: z.coerce.number().min(0, 'Discount cannot be negative').max(90, 'Max discount 90%'),
  unit: z.string().min(1, 'Unit (e.g. 500g, 1L, 1 kg, 6 pcs) is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  rating: z.coerce.number().min(1).max(5).default(4.5),
  image: z.string().url('Must be a valid image URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isOrganic: z.boolean().default(false),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
});
