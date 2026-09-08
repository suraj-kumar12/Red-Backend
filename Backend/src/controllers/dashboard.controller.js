// Dashboard Controller - Handles HTTP requests for dashboard metrics
import dashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Get dashboard overview statistics
 * GET /api/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    return sendSuccess(res, 200, 'Dashboard data fetched successfully', stats);
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboard,
};
