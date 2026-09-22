/**
 * Standardized API Success Response
 * @param {Object} res Express response object
 * @param {number} statusCode HTTP status code (e.g. 200, 201)
 * @param {string} message Human readable success message
 * @param {Object} [data={}] Data payload
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized API Error Response
 * @param {Object} res Express response object
 * @param {number} statusCode HTTP status code (e.g. 400, 401, 403, 404, 409, 500)
 * @param {string} message Error message
 * @param {Array} [errors=[]] Array of detailed field errors or specific error objects
 */
const sendError = (res, statusCode = 500, message = 'An unexpected error occurred', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
