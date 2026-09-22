const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');

/**
 * Authentication Middleware
 * Expects header: Authorization: Bearer <accessToken>
 * Verifies JWT token and attaches req.user
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Access denied. No access token provided.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Access denied. Token missing.');
    }

    const decoded = verifyAccessToken(token);

    if (!decoded || decoded.type !== 'access' || !decoded.userId) {
      return sendError(res, 401, 'Invalid access token payload.');
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Access token has expired.');
    }
    return sendError(res, 401, 'Invalid access token.');
  }
};

module.exports = authenticate;
