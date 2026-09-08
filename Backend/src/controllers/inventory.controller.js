// Inventory Controller - Handles HTTP requests for stock management
import inventoryService from '../services/inventory.service.js';
import { sendSuccess } from '../utils/response.js';

export const updateStock = async (req, res, next) => {
  try {
    const { productId, type, amount, reason } = req.body;
    const result = await inventoryService.adjustStock({
      productId,
      type,
      amount,
      reason,
      userId: req.user?._id,
    });
    return sendSuccess(res, 200, 'Stock adjusted successfully', result);
  } catch (error) {
    next(error);
  }
};

export const increaseStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { amount, reason } = req.body;
    const result = await inventoryService.adjustStock({
      productId,
      type: 'INCREASE',
      amount,
      reason,
      userId: req.user?._id,
    });
    return sendSuccess(res, 200, 'Stock increased successfully', result);
  } catch (error) {
    next(error);
  }
};

export const reduceStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { amount, reason } = req.body;
    const result = await inventoryService.adjustStock({
      productId,
      type: 'REDUCE',
      amount,
      reason,
      userId: req.user?._id,
    });
    return sendSuccess(res, 200, 'Stock reduced successfully', result);
  } catch (error) {
    next(error);
  }
};

export const getStockHistory = async (req, res, next) => {
  try {
    const history = await inventoryService.getTransactionHistory(req.params.productId);
    return sendSuccess(res, 200, 'Stock history fetched successfully', history);
  } catch (error) {
    next(error);
  }
};

export const getAllStockHistory = async (req, res, next) => {
  try {
    const history = await inventoryService.getAllTransactionHistory(req.query.limit);
    return sendSuccess(res, 200, 'All stock transactions fetched successfully', history);
  } catch (error) {
    next(error);
  }
};

export default {
  updateStock,
  increaseStock,
  reduceStock,
  getStockHistory,
  getAllStockHistory,
};
