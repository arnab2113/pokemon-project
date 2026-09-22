const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Create a new Product
 * POST /api/products
 * Protected
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image: image || '',
      createdBy: req.user.userId,
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'createdBy',
      'name email'
    );

    return sendSuccess(res, 201, 'Product created successfully', {
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all Products (Paginated & Filtered)
 * GET /api/products
 * Public
 */
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: 'i' };
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return sendSuccess(res, 200, 'Products fetched successfully', {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Single Product by ID
 * GET /api/products/:id
 * Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    return sendSuccess(res, 200, 'Product fetched successfully', { product });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Product
 * PUT /api/products/:id
 * Protected (Ownership required)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    // Authorization check: Verify authenticated user is the owner
    if (product.createdBy.toString() !== req.user.userId.toString()) {
      return sendError(res, 403, 'Forbidden. You are not authorized to update this product.');
    }

    // Extract allowed fields only to prevent unexpected state updates
    const { name, description, price, stock, category, image } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      'createdBy',
      'name email'
    );

    return sendSuccess(res, 200, 'Product updated successfully', {
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Product
 * DELETE /api/products/:id
 * Protected (Ownership required)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    // Authorization check: Verify authenticated user is the owner
    if (product.createdBy.toString() !== req.user.userId.toString()) {
      return sendError(res, 403, 'Forbidden. You are not authorized to delete this product.');
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, 'Product deleted successfully', {
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
