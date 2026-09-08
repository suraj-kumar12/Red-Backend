import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Category CRUD routes (Enforce authentication on protected routes)
router.post('/', protect, createCategory);
router.get('/', protect, getCategories);
router.get('/:id', protect, getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router;
