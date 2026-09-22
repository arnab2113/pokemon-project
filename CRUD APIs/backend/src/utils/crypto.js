const crypto = require('crypto');

/**
 * Computes a secure SHA-256 hash of a string (such as a refresh token)
 * before persisting to the database.
 * @param {string} token 
 * @returns {string} Hex encoded hash
 */
const hashToken = (token) => {
  if (!token) return '';
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  hashToken,
};
