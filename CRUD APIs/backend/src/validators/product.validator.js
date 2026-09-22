const { body, param, query } = require('express-validator');

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ max: 1000 })
    .withMessage('Product description cannot exceed 1000 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),

  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer greater than or equal to 0'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('image')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

const updateProductValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Product description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a number greater than or equal to 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be an integer greater than or equal to 0'),

  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),

  body('image')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL'),
];

const productIdParamValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID format'),
];

const paginationQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),

  query('search')
    .optional()
    .trim(),

  query('category')
    .optional()
    .trim(),
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdParamValidation,
  paginationQueryValidation,
};
