const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * Express middleware to validate incoming request data using express-validator.
 * Returns HTTP 400 Bad Request with field-level errors if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return sendError(res, 400, 'Validation failed', formattedErrors);
  }
  next();
};

module.exports = validate;
