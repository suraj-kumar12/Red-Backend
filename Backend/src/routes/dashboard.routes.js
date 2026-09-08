import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Dashboard routes (Protected: requires valid JWT)
router.get('/', protect, getDashboard);
router.get('/stats', protect, getDashboard);

export default router;
