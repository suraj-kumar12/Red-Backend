import express from 'express';
import {
  updateStock,
  increaseStock,
  reduceStock,
  getStockHistory,
  getAllStockHistory,
} from '../controllers/inventory.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  validateStockAdjustment,
  validateStockOperation,
  validateHistoryProductId,
} from '../validators/inventory.validator.js';

const router = express.Router();

// Inventory / Stock Management routes (Protected)
router.patch('/stock', protect, validateStockAdjustment, updateStock);
router.patch('/:productId/increase', protect, validateStockOperation, increaseStock);
router.patch('/:productId/reduce', protect, validateStockOperation, reduceStock);
router.get('/history', protect, getAllStockHistory);
router.get('/history/:productId', protect, validateHistoryProductId, getStockHistory);

export default router;
