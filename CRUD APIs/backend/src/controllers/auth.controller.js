const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { hashToken } = require('../utils/crypto');
const { setRefreshTokenCookie, clearRefreshTokenCookie, REFRESH_TOKEN_COOKIE_NAME } = require('../utils/cookies');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Register User
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email address already exists.');
    }

    // Create user (password is automatically hashed via Mongoose pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    return sendSuccess(
      res,
      201,
      'User registered successfully',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password.');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Hash refresh token for server-side persistence
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      createdByIp: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    // Set Refresh Token in HTTP-Only cookie
    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(
      res,
      200,
      'Login successful',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        accessToken,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Access Token
 * POST /api/auth/refresh-token
 */
const refreshToken = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!rawRefreshToken) {
      return sendError(res, 401, 'Refresh token cookie missing.');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch (err) {
      clearRefreshTokenCookie(res);
      return sendError(res, 401, 'Invalid or expired refresh token.');
    }

    if (!decoded || decoded.type !== 'refresh' || !decoded.userId) {
      clearRefreshTokenCookie(res);
      return sendError(res, 401, 'Invalid refresh token payload.');
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash });

    if (!storedToken || !storedToken.isActive()) {
      clearRefreshTokenCookie(res);
      return sendError(res, 401, 'Refresh token is invalid or revoked. Please log in again.');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    // Optional Token Rotation: Revoke old token and issue new refresh token
    storedToken.revokedAt = new Date();
    await storedToken.save();

    const newRefreshToken = generateRefreshToken(decoded.userId);
    const newHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: decoded.userId,
      tokenHash: newHash,
      expiresAt,
      createdByIp: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
    });

    setRefreshTokenCookie(res, newRefreshToken);

    return sendSuccess(
      res,
      200,
      'Access token refreshed successfully',
      {
        accessToken: newAccessToken,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout User
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await RefreshToken.updateMany(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date() }
      );
    }

    clearRefreshTokenCookie(res);

    return sendSuccess(res, 200, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Get Authenticated User Profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return sendError(res, 404, 'User account not found.');
    }

    return sendSuccess(
      res,
      200,
      'Current user fetched successfully',
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
