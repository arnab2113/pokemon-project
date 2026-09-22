import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoAdd, IoPencil, IoTrashOutline, IoSearch, IoChevronBack } from 'react-icons/io5';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { useProducts } from '../../hooks/useProducts';
import { productSchema } from '../../utils/validators';
import { formatCurrency } from '../../utils/helpers';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';

export const ManageProducts = () => {
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    reset({
      name: '',
      category: categories[0]?.slug || 'vegetables',
      brand: 'Farm Fresh',
      price: 99,
      originalPrice: 129,
      discount: 20,
      unit: '500 g',
      stock: 50,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
      description: 'Fresh organic product delivered straight from farms.',
      isOrganic: true,
      inStock: true,
      featured: false,
      trending: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    Object.keys(prod).forEach((key) => {
      setValue(key, prod[key]);
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...data });
      toast.success('Product updated successfully!');
    } else {
      const newProd = {
        id: `prod-${uuidv4().substring(0, 6)}`,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        reviewsCount: 1,
        ...data,
      };
      addProduct(newProd);
      toast.success('New product added to catalog!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2">
      
      {/* Admin Header with Nav Bar */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-500/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest">
              👑 ADMIN WORKSPACE
            </span>
            <span className="text-xs text-purple-400 font-semibold">Product Catalog Suite</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Manage Products ({products.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="glass-panel">
              📊 Overview
            </Button>
          </Link>
          <Link to="/admin/products">
            <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700">
              📦 Products ({products.length})
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="ghost" size="sm" className="glass-panel">
              🏷️ Categories ({categories.length})
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="ghost" size="sm" className="glass-panel">
              📋 Orders
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handleOpenAddModal} icon={IoAdd} className="bg-emerald-500 hover:bg-emerald-600">
            Add Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <IoSearch className="absolute left-3.5 top-3.5 text-slate-400 text-base" />
        <input
          type="text"
          placeholder="Filter by product title or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs font-bold"
        />
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">{prod.brand} • {prod.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 uppercase font-bold text-slate-500">{prod.category}</td>
                  <td className="p-4 font-black text-slate-900 dark:text-white">{formatCurrency(prod.price)}</td>
                  <td className="p-4 font-bold text-emerald-600">{prod.discount}%</td>
                  <td className="p-4 font-bold">{prod.stock} pcs</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(prod)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <IoPencil />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                    >
                      <IoTrashOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input label="Product Title" {...register('name')} error={errors.name?.message} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
            <select {...register('category')} className="w-full py-2.5 px-3 rounded-xl glass-input text-xs font-bold">
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <Input label="Brand Name" {...register('brand')} error={errors.brand?.message} />
          <Input label="Selling Price (₹)" type="number" {...register('price')} error={errors.price?.message} />
          <Input label="Original Price (₹)" type="number" {...register('originalPrice')} error={errors.originalPrice?.message} />
          <Input label="Discount (%)" type="number" {...register('discount')} error={errors.discount?.message} />
          <Input label="Unit (e.g. 500g, 1L)" {...register('unit')} error={errors.unit?.message} />
          <Input label="Available Stock" type="number" {...register('stock')} error={errors.stock?.message} />

          <div className="col-span-2">
            <Input label="Image URL" {...register('image')} error={errors.image?.message} />
          </div>

          <div className="col-span-2">
            <Input label="Description" {...register('description')} error={errors.description?.message} />
          </div>

          <div className="col-span-2 flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" {...register('isOrganic')} className="accent-brand-500" />
              <span>Organic Product</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
              <input type="checkbox" {...register('inStock')} className="accent-brand-500" />
              <span>In Stock</span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="col-span-2 mt-4 py-3 bg-purple-600 hover:bg-purple-700">
            {editingProduct ? 'Update Product' : 'Save Product'}
          </Button>
        </form>
      </Modal>

    </div>
  );
};

export default ManageProducts;
