import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import ProductForm from '../components/ProductForm';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    const res = await productService.createProduct(formData);
    if (res.success) {
      navigate('/products');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-sky-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Products
      </Link>

      <div className="mb-6 flex items-center space-x-3">
        <div className="p-2.5 bg-sky-100 text-sky-600 rounded-lg">
          <PackagePlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-sm text-gray-600">Add a new item to the store catalog</p>
        </div>
      </div>

      <ProductForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateProduct;
