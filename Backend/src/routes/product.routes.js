import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Product CRUD routes (Enforce authentication on modifying and data routes)
router.post('/', protect, createProduct);
router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
