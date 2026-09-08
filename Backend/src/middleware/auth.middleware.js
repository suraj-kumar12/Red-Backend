import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware: Verifies JWT token and attaches user to req.user
 * Enforces authentication on all protected routes.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token is required',
        });
      }

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_for_development'
      );

      // Extract userId and find user in MongoDB (exclude password)
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Please log in again.',
        });
      }

      // Attach authenticated user to request
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
      });
    }
  }

  // Token missing
  return res.status(401).json({
    success: false,
    message: 'Access denied. Authentication token is required.',
  });
};

/**
 * Role authorization middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }
    next();
  };
};

export default {
  protect,
  authorize,
};
