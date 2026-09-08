import express from 'express';
import { updateStock, getStockHistory } from '../controllers/inventory.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Inventory / Stock Management routes (Enforce authentication on protected routes)
router.patch('/stock', protect, updateStock);
router.get('/history/:productId', protect, getStockHistory);

export default router;
