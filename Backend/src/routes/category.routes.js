import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
  validateCategoryId,
} from '../validators/category.validator.js';

const router = express.Router();

// Category CRUD routes
// Read operations: Accessible by authenticated users
router.get('/', protect, getCategories);
router.get('/:id', protect, validateCategoryId, getCategoryById);

// Mutating operations: Restricted to Admin role with input validation
router.post('/', protect, authorize('admin'), createCategoryValidator, createCategory);
router.put('/:id', protect, authorize('admin'), updateCategoryValidator, updateCategory);
router.delete('/:id', protect, authorize('admin'), validateCategoryId, deleteCategory);

export default router;
