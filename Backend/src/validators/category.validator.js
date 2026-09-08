// Category Request Validation Middleware
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

/**
 * Validator for creating a new category (POST /api/categories)
 */
export const createCategoryValidator = (req, res, next) => {
  const { name, description } = req.body;

  // 1. Validate Category Name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Category name is required and must be a non-empty string',
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Category name must be at least 2 characters long',
    });
  }

  // 2. Validate optional description
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Category description must be a string',
    });
  }

  next();
};

/**
 * Validator for updating a category (PUT /api/categories/:id)
 */
export const updateCategoryValidator = (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // 1. Validate Category ID parameter
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Category ID format',
    });
  }

  // 2. Validate Name (if provided)
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name cannot be empty',
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Category name must be at least 2 characters long',
      });
    }
  }

  // 3. Validate Description (if provided)
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Category description must be a string',
    });
  }

  next();
};

/**
 * Validator for Category ID parameter in URL (GET /api/categories/:id, DELETE /api/categories/:id)
 */
export const validateCategoryId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Category ID format',
    });
  }
  next();
};

export default {
  createCategoryValidator,
  updateCategoryValidator,
  validateCategoryId,
  isValidObjectId,
};
