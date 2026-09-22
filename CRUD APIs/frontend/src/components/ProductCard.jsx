import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, Tag, Box, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({ product, onDelete }) => {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const creatorId = typeof product.createdBy === 'object' ? product.createdBy?.id || product.createdBy?._id : product.createdBy;
  const isOwner = user && creatorId === user.id;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(product.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-1" />
            <span className="text-xs">No image provided</span>
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {product.category}
        </span>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1" title={product.name}>
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2 mb-3" title={product.description}>
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between my-3 pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>

            <div className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <Box className="w-3 h-3 mr-1" />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          {/* Owner Info & Actions */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              By: {typeof product.createdBy === 'object' ? product.createdBy.name : 'User'}
            </span>

            {isOwner && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="p-1.5 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                  title="Edit product"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-800">"{product.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
