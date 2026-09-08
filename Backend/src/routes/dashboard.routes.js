import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Dashboard routes (Enforce authentication on dashboard metrics)
router.get('/stats', protect, getDashboardStats);

export default router;
