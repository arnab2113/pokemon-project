const env = require('../config/env');

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

/**
 * Set HTTP-Only Refresh Token Cookie on Response
 * @param {Object} res Express response object
 * @param {string} token Raw refresh token
 */
const setRefreshTokenCookie = (res, token) => {
  const isProduction = env.nodeEnv === 'production';

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

/**
 * Clear HTTP-Only Refresh Token Cookie from Response
 * @param {Object} res Express response object
 */
const clearRefreshTokenCookie = (res) => {
  const isProduction = env.nodeEnv === 'production';

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};

module.exports = {
  REFRESH_TOKEN_COOKIE_NAME,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
