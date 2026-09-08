// Inventory Service - Business logic for stock operations & audit history
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import { calculateStockStatus } from '../utils/stockStatus.js';

/**
 * Adjust stock level (Increase / Reduce / Set) with strict negative inventory prevention
 */
export const adjustStock = async ({ productId, type, amount, reason = '', userId = null }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error('Invalid Product ID');
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const numericAmount = Number(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    const error = new Error('Stock adjustment amount must be a positive number greater than 0');
    error.statusCode = 400;
    throw error;
  }

  const previousQuantity = product.quantity;
  let newQuantity = previousQuantity;
  const upperType = type ? type.toUpperCase() : 'INCREASE';

  if (upperType === 'INCREASE') {
    newQuantity = previousQuantity + numericAmount;
  } else if (upperType === 'DECREASE' || upperType === 'REDUCE') {
    if (previousQuantity - numericAmount < 0) {
      const error = new Error(
        `Cannot reduce stock below 0. Current available stock is ${previousQuantity} units.`
      );
      error.statusCode = 400;
      throw error;
    }
    newQuantity = previousQuantity - numericAmount;
  } else if (upperType === 'ADJUSTMENT') {
    newQuantity = numericAmount;
  } else {
    const error = new Error('Invalid action type. Must be INCREASE, REDUCE, or ADJUSTMENT.');
    error.statusCode = 400;
    throw error;
  }

  // Update product quantity and automatically recalculate status
  product.quantity = newQuantity;
  product.status = calculateStockStatus(newQuantity);
  await product.save();

  // Log transaction record for audit history
  const transaction = await InventoryTransaction.create({
    product: product._id,
    type: upperType === 'REDUCE' ? 'DECREASE' : upperType,
    quantityChanged: numericAmount,
    previousQuantity,
    newQuantity,
    reason: reason ? reason.trim() : '',
    performedBy: userId,
  });

  const populatedProduct = await product.populate('category', 'name description');
  const populatedTransaction = await transaction.populate('performedBy', 'name email');

  return {
    product: populatedProduct,
    transaction: populatedTransaction,
  };
};

/**
 * Get stock history for a specific product
 */
export const getTransactionHistory = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error('Invalid Product ID');
    error.statusCode = 400;
    throw error;
  }

  const transactions = await InventoryTransaction.find({ product: productId })
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 });
  return transactions;
};

/**
 * Get recent inventory audit history across all products
 */
export const getAllTransactionHistory = async (limit = 50) => {
  const transactions = await InventoryTransaction.find()
    .populate('product', 'name sku')
    .populate('performedBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(Math.min(100, Number(limit) || 50));
  return transactions;
};

export default {
  adjustStock,
  getTransactionHistory,
  getAllTransactionHistory,
};
