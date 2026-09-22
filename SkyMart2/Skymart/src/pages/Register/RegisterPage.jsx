import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCallOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoArrowForward,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../utils/validators';
import { ROLES } from '../../utils/constants';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    clearError();
    const newUser = {
      id: `usr-${uuidv4().substring(0, 8)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: ROLES.USER,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      addresses: [],
      createdAt: new Date().toISOString(),
    };

    registerUser(newUser);

    const storedUser = JSON.parse(localStorage.getItem('skymart_current_user'));
    if (storedUser) {
      toast.success('Welcome to SkyMart, ' + storedUser.name + '!');
      navigate('/');
    }
  };

  const InputField = ({ icon: Icon, type = 'text', placeholder, registerProps, error, showToggle, isVisible, onToggle }) => (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Icon className="text-lg" />
        </div>
        <input
          type={showToggle ? (isVisible ? 'text' : 'password') : type}
          placeholder={placeholder}
          {...registerProps}
          className="w-full h-[52px] pl-11 pr-12 rounded-2xl bg-slate-800/60 border border-slate-700/70 text-sm text-white placeholder-slate-500 outline-none focus:border-[#c8ff00]/60 focus:ring-1 focus:ring-[#c8ff00]/30 transition-all duration-200"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {isVisible ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-400 pl-1">{error}</span>
      )}
    </div>
  );

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

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-[420px] rounded-3xl border border-slate-700/60 bg-slate-900/80 dark:bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/30"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Create account</h1>
          <p className="text-sm text-slate-400 mt-1.5">Join SkyMart and start shopping</p>
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          
          <InputField
            icon={IoPersonOutline}
            placeholder="Full name"
            registerProps={register('name')}
            error={errors.name?.message}
          />

          <InputField
            icon={IoMailOutline}
            type="email"
            placeholder="Email address"
            registerProps={register('email')}
            error={errors.email?.message}
          />

          <InputField
            icon={IoCallOutline}
            type="tel"
            placeholder="Phone number"
            registerProps={register('phone')}
            error={errors.phone?.message}
          />

          <InputField
            icon={IoLockClosedOutline}
            placeholder="Password (min 6 chars)"
            registerProps={register('password')}
            error={errors.password?.message}
            showToggle
            isVisible={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />

          <InputField
            icon={IoLockClosedOutline}
            placeholder="Confirm password"
            registerProps={register('confirmPassword')}
            error={errors.confirmPassword?.message}
            showToggle
            isVisible={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />

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
                Create Account <IoArrowForward className="text-lg" />
              </>
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-slate-400 mt-7">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#c8ff00] hover:text-[#d4ff33] transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
