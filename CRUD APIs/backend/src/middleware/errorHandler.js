const { sendError } = require('../utils/apiResponse');
const env = require('../config/env');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log internal error server-side
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (err.stack && env.nodeEnv === 'development') {
    console.error(err.stack);
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, 400, 'Invalid ID format provided');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, `A record with that ${field} already exists.`, [
      { field, message: `Duplicate entry for ${field}` },
    ]);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const formattedErrors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 400, 'Database validation error', formattedErrors);
  }

  // Handle JSON Syntax Error (malformed payload)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'Malformed JSON payload');
  }

  const statusCode = err.statusCode || 500;
  const message = env.nodeEnv === 'production' && statusCode === 500
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
