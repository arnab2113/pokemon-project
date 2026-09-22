const { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/crypto');
const bcrypt = require('bcryptjs');

describe('Backend Utility & Core Functionality Unit Tests', () => {
  describe('JWT Access & Refresh Tokens', () => {
    const mockUserId = '507f1f77bcf86cd799439011';

    it('should generate valid access token with correct payload structure', () => {
      const token = generateAccessToken(mockUserId);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(20);

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(mockUserId);
      expect(decoded.type).toBe('access');
    });

    it('should generate valid refresh token with correct payload structure', () => {
      const token = generateRefreshToken(mockUserId);
      expect(typeof token).toBe('string');

      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(mockUserId);
      expect(decoded.type).toBe('refresh');
    });
  });

  describe('SHA-256 Token Hashing', () => {
    it('should consistently hash tokens using SHA-256', () => {
      const rawToken = 'sample_refresh_token_string_123';
      const hash1 = hashToken(rawToken);
      const hash2 = hashToken(rawToken);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 produces 64 hex chars
    });

    it('should return empty string for empty token input', () => {
      expect(hashToken('')).toBe('');
    });
  });

  describe('Password Hashing with Bcrypt', () => {
    it('should hash passwords with salt rounds >= 10', async () => {
      const rawPassword = 'StrongPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(rawPassword, salt);

      expect(hash).not.toBe(rawPassword);
      const match = await bcrypt.compare(rawPassword, hash);
      expect(match).toBe(true);
    });
  });
});
