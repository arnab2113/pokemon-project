const { sendError } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  return sendError(res, 404, `Route not found: ${req.originalUrl}`);
};

module.exports = notFound;
