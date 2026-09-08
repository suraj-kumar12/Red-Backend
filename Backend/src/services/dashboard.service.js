// Dashboard Service - Aggregation and metrics calculation for inventory statistics
import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * Calculates dashboard statistics from MongoDB using efficient aggregations and counts.
 * @returns {Promise<Object>} Dashboard overview statistics
 */
export const getDashboardStats = async () => {
  const [
    totalProducts,
    totalCategories,
    stockAggregation,
    lowStockItems,
    outOfStockItems,
  ] = await Promise.all([
    // 1. Total count of all products
    Product.countDocuments(),

    // 2. Total count of all categories
    Category.countDocuments(),

    // 3. Total stock quantity across all products
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockQuantity: { $sum: '$quantity' },
        },
      },
    ]),

    // 4. Low stock items (0 < quantity <= 10)
    Product.countDocuments({ quantity: { $gt: 0, $lte: 10 } }),

    // 5. Out of stock items (quantity <= 0)
    Product.countDocuments({ quantity: { $lte: 0 } }),
  ]);

  const totalStockQuantity =
    stockAggregation.length > 0 ? stockAggregation[0].totalStockQuantity : 0;

  return {
    totalProducts,
    totalCategories,
    totalStockQuantity,
    lowStockItems,
    outOfStockItems,
  };
};

export default {
  getDashboardStats,
};
