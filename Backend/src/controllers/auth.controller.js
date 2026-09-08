// Auth Controller - Thin layer handling HTTP request and response
import authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });
    return sendSuccess(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    return sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 * Note: For stateless Bearer JWT, logout is primarily managed client-side by deleting the token.
 */
export const logout = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      200,
      'Logged out successfully. Please remove your authentication token from client storage.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User profile retrieved successfully', {
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  getMe,
};
