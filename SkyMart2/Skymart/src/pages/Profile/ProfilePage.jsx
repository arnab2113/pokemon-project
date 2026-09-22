import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoPersonOutline, IoHomeOutline, IoReceiptOutline, IoHeartOutline, IoLogOutOutline, IoAdd, IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '../../hooks/useAuth';
import { addressSchema } from '../../utils/validators';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';

export const ProfilePage = () => {
  const { user, updateProfile, addAddress, removeAddress, logout } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, phone });
    setIsEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  const handleAddAddressSubmit = (data) => {
    const newAddr = {
      id: `addr-${uuidv4().substring(0, 6)}`,
      ...data,
    };
    addAddress(newAddr);
    setIsAddressModalOpen(false);
    reset();
    toast.success('New address saved!');
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      
      {/* Header Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-brand-500 shadow-glow"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              {user?.role === 'admin' ? '👑 Administrator' : ' shopper account'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
            <span className="text-xs text-slate-500">{user?.email} • {user?.phone}</span>
          </div>
        </div>

        <Button variant="danger" size="md" onClick={logout} icon={IoLogOutOutline}>
          Logout
        </Button>
      </div>

      {/* Navigation Quick Tabs */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/orders" className="glass-card p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors">
          <IoReceiptOutline className="text-xl text-amber-500" /> My Orders
        </Link>
        <Link to="/wishlist" className="glass-card p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500 transition-colors">
          <IoHeartOutline className="text-xl text-rose-500" /> Saved Wishlist
        </Link>
        <div className="glass-card p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 border-brand-500">
          <IoPersonOutline className="text-xl" /> Account Info
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Personal Information</h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-bold text-brand-500 hover:underline"
            >
              {isEditingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleUpdateProfileSubmit} className="flex flex-col gap-4">
              <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <Button type="submit" variant="primary" size="sm">Save Changes</Button>
            </form>
          ) : (
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Full Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user?.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email Address</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Phone Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Addresses Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Saved Delivery Addresses</h3>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
            >
              <IoAdd /> Add New
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
            {(!user?.addresses || user.addresses.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center">No saved addresses yet.</p>
            ) : (
              user.addresses.map((addr) => (
                <div key={addr.id} className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 glass-card flex items-start justify-between">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {addr.fullName} <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{addr.addressType}</span>
                    </span>
                    <span className="text-slate-500">{addr.houseNo}, {addr.street}</span>
                    <span className="text-slate-500">{addr.city}, {addr.state} - {addr.pincode}</span>
                  </div>
                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <IoTrashOutline />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Address Modal */}
      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title="Add Delivery Address">
        <form onSubmit={handleSubmit(handleAddAddressSubmit)} className="flex flex-col gap-3">
          <Input label="Full Name" {...register('fullName')} error={errors.fullName?.message} />
          <Input label="Phone Number" {...register('phone')} error={errors.phone?.message} />
          <Input label="House / Flat No" {...register('houseNo')} error={errors.houseNo?.message} />
          <Input label="Street / Area Name" {...register('street')} error={errors.street?.message} />
          <Input label="City" {...register('city')} error={errors.city?.message} />
          <Input label="State" {...register('state')} error={errors.state?.message} />
          <Input label="Pincode" {...register('pincode')} error={errors.pincode?.message} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Address Type</label>
            <select {...register('addressType')} className="py-2.5 px-3 rounded-xl glass-input text-xs font-bold">
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Button type="submit" variant="primary" size="md" className="mt-2">
            Save Address
          </Button>
        </form>
      </Modal>

    </div>
  );
};

export default ProfilePage;
