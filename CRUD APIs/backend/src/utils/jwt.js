const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate Access Token (short-lived, 15m)
 * @param {string|Object} userId 
 * @returns {string} Signed JWT Access Token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString(), type: 'access' },
    env.accessTokenSecret,
    { expiresIn: env.accessTokenExpiresIn }
  );
};

/**
 * Generate Refresh Token (long-lived, 7d)
 * @param {string|Object} userId 
 * @returns {string} Signed JWT Refresh Token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString(), type: 'refresh' },
    env.refreshTokenSecret,
    { expiresIn: env.refreshTokenExpiresIn }
  );
};

/**
 * Verify Access Token
 * @param {string} token 
 * @returns {Object} Decoded payload
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.accessTokenSecret);
};

/**
 * Verify Refresh Token
 * @param {string} token 
 * @returns {Object} Decoded payload
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.refreshTokenSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
