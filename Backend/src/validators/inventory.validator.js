// Inventory Request Validation Middleware
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

/**
 * Validator for general stock adjustment (PATCH /api/inventory/stock)
 */
export const validateStockAdjustment = (req, res, next) => {
  const { productId, type, amount, quantity, reason } = req.body;

  // 1. Validate Product ID
  if (!productId) {
    return res.status(400).json({
      success: false,
      message: 'Product ID is required',
    });
  }

  if (!isValidObjectId(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID format',
    });
  }

  // 2. Validate Action Type (if provided)
  const allowedTypes = ['INCREASE', 'DECREASE', 'REDUCE', 'ADJUSTMENT'];
  if (type !== undefined) {
    if (typeof type !== 'string' || !allowedTypes.includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action type. Must be INCREASE, REDUCE, or ADJUSTMENT',
      });
    }
  }

  // 3. Validate Stock Amount / Quantity
  const rawAmount = amount !== undefined ? amount : quantity;
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    return res.status(400).json({
      success: false,
      message: 'Stock amount is required',
    });
  }

  const numAmount = Number(rawAmount);
  if (isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
    return res.status(400).json({
      success: false,
      message: 'Stock amount must be a positive integer greater than 0',
    });
  }

  // 4. Validate Reason (if provided)
  if (reason !== undefined && typeof reason !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Reason must be a string',
    });
  }

  next();
};

/**
 * Validator for direct stock increment/reduction (PATCH /api/inventory/:productId/increase, PATCH /api/inventory/:productId/reduce)
 */
export const validateStockOperation = (req, res, next) => {
  const { productId } = req.params;
  const { amount, quantity, reason } = req.body;

  // 1. Validate Product ID parameter
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID format',
    });
  }

  // 2. Validate Stock Amount
  const rawAmount = amount !== undefined ? amount : quantity;
  if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
    return res.status(400).json({
      success: false,
      message: 'Stock amount is required',
    });
  }

  const numAmount = Number(rawAmount);
  if (isNaN(numAmount) || numAmount <= 0 || !Number.isInteger(numAmount)) {
    return res.status(400).json({
      success: false,
      message: 'Stock amount must be a positive integer greater than 0',
    });
  }

  // 3. Validate Reason (if provided)
  if (reason !== undefined && typeof reason !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Reason must be a string',
    });
  }

  next();
};

/**
 * Validator for Product ID parameter in Stock History (GET /api/inventory/history/:productId)
 */
export const validateHistoryProductId = (req, res, next) => {
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID format',
    });
  }
  next();
};

export default {
  validateStockAdjustment,
  validateStockOperation,
  validateHistoryProductId,
  isValidObjectId,
};
