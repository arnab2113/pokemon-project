import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/product.service';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { User, Mail, Calendar, Package, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await productService.getProducts({ limit: 100 });
      if (res.success) {
        const myProducts = (res.data.products || []).filter((p) => {
          const creatorId = typeof p.createdBy === 'object' ? p.createdBy?.id || p.createdBy?._id : p.createdBy;
          return creatorId === user?.id;
        });
        setUserProducts(myProducts);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user products.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user, fetchUserProducts]);

  const handleDeleteProduct = async (id) => {
    await productService.deleteProduct(id);
    fetchUserProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {user?.email}
                </span>
                {user?.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-100 rounded-lg px-4 py-3 flex items-center space-x-2 text-sky-700">
            <Package className="w-5 h-5 text-sky-600" />
            <span className="text-sm font-semibold">{userProducts.length} Products Listed</span>
          </div>
        </div>
      </div>

      {/* User Created Products Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Your Listed Products</h2>
        <Link
          to="/products/new"
          className="inline-flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : userProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm mb-4">You haven't added any products yet.</p>
          <Link
            to="/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Product</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
