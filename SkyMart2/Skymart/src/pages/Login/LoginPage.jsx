import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoArrowForward } from 'react-icons/io5';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../utils/validators';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    clearError();
    login(data);
  
    const storedUser = JSON.parse(localStorage.getItem('skymart_current_user'));
    if (storedUser) {
      toast.success('Welcome back, ' + storedUser.name + '!');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-[#c8ff00] flex items-center justify-center shadow-lg shadow-[#c8ff00]/20">
          <span className="text-xl text-slate-900 font-black">⚡</span>
        </div>
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Sky<span className="text-[#c8ff00]">Mart</span>
        </span>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-[420px] rounded-3xl border border-slate-700/60 bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/30"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Sign in</h1>
          <p className="text-sm text-slate-400 mt-1.5">Enter your credentials to continue</p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-sm font-semibold text-rose-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <IoMailOutline className="text-lg" />
              </div>
              <input
                type="email"
                placeholder="Email address"
                {...register('email')}
                className="w-full h-[52px] pl-11 pr-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 text-sm text-white placeholder-slate-500 outline-none focus:border-[#c8ff00]/60 focus:ring-1 focus:ring-[#c8ff00]/30 transition-all duration-200"
              />
            </div>
            {errors.email && (
              <span className="text-xs font-medium text-rose-400 pl-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <IoLockClosedOutline className="text-lg" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className="w-full h-[52px] pl-11 pr-12 rounded-2xl bg-slate-800/60 border border-slate-700/70 text-sm text-white placeholder-slate-500 outline-none focus:border-[#c8ff00]/60 focus:ring-1 focus:ring-[#c8ff00]/30 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-rose-400 pl-1">{errors.password.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[52px] mt-2 rounded-2xl bg-[#c8ff00] hover:bg-[#d4ff33] text-slate-900 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#c8ff00]/20 hover:shadow-[#c8ff00]/40 transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                Sign in <IoArrowForward className="text-lg" />
              </>
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/40">
          <span className="text-xs font-bold text-slate-400 block mb-2">🔑 Quick Demo Logins:</span>
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <span>User: <code className="text-slate-300 font-semibold">user@skymart.com</code> / <code className="text-slate-300 font-semibold">password123</code></span>
            <span>Admin: <code className="text-slate-300 font-semibold">admin@skymart.com</code> / <code className="text-slate-300 font-semibold">password123</code></span>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-slate-400 mt-7">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#c8ff00] hover:text-[#d4ff33] transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
