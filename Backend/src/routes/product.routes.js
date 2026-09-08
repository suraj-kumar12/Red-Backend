import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createProductValidator,
  updateProductValidator,
  validateProductId,
} from '../validators/product.validator.js';

const router = express.Router();

// Product CRUD routes
// Read operations: Accessible by authenticated users
router.get('/', protect, getProducts);
router.get('/:id', protect, validateProductId, getProductById);

// Mutating operations: Restricted to Admin role with input validation
router.post('/', protect, authorize('admin'), createProductValidator, createProduct);
router.put('/:id', protect, authorize('admin'), updateProductValidator, updateProduct);
router.delete('/:id', protect, authorize('admin'), validateProductId, deleteProduct);

export default router;
