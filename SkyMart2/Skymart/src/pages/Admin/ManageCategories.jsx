import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IoChevronBack, IoAdd, IoTrashOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { addCategory, deleteCategory } from '../../redux/slices/categorySlice';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';

export const ManageCategories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🥦');
  const [description, setDescription] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = {
      id: `cat-${uuidv4().substring(0, 6)}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon,
      description,
    };

    dispatch(addCategory(newCat));
    toast.success('Category created!');
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategory(id));
    toast.success('Category removed');
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 rounded-xl glass-panel text-slate-600">
            <IoChevronBack className="text-xl" />
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Manage Categories ({categories.length})
          </h1>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} icon={IoAdd}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5 rounded-3xl flex items-center justify-between border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                {cat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</span>
                <span className="text-xs text-slate-400">/{cat.slug}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id)}
              className="p-2 rounded-xl hover:bg-rose-50 text-rose-500"
            >
              <IoTrashOutline />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Category">
        <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
          <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Category Icon Emoji (e.g. 🍎)" value={icon} onChange={(e) => setIcon(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" variant="primary" size="md" className="mt-2">
            Save Category
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
