// Product Request Validation Middleware
import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
};

/**
 * Validator for creating a new product (POST /api/products)
 */
export const createProductValidator = (req, res, next) => {
  const { name, sku, category, unitPrice, price, quantity, description, supplierName } = req.body;

  // 1. Validate Name
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Product name is required and must be a non-empty string',
    });
  }

  // 2. Validate SKU
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'SKU is required and must be a non-empty string',
    });
  }

  // 3. Validate Category (ObjectId)
  if (!category) {
    return res.status(400).json({
      success: false,
      message: 'Category is required',
    });
  }

  if (!isValidObjectId(category)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Category ID format',
    });
  }

  // 4. Validate Unit Price / Price
  const rawPrice = unitPrice !== undefined ? unitPrice : price;
  if (rawPrice === undefined || rawPrice === null || rawPrice === '') {
    return res.status(400).json({
      success: false,
      message: 'Unit price is required',
    });
  }

  const numPrice = Number(rawPrice);
  if (isNaN(numPrice) || numPrice < 0) {
    return res.status(400).json({
      success: false,
      message: 'Unit price must be a non-negative number',
    });
  }

  // 5. Validate Quantity (if provided)
  if (quantity !== undefined && quantity !== null && quantity !== '') {
    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty < 0 || !Number.isInteger(numQty)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative integer',
      });
    }
  }

  // 6. Validate optional string fields
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Description must be a string',
    });
  }

  if (supplierName !== undefined && typeof supplierName !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Supplier name must be a string',
    });
  }

  next();
};

/**
 * Validator for updating a product (PUT /api/products/:id)
 */
export const updateProductValidator = (req, res, next) => {
  const { id } = req.params;
  const { name, sku, category, unitPrice, price, quantity, description, supplierName } = req.body;

  // 1. Validate Product ID parameter
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID format',
    });
  }

  // 2. Validate Name (if provided)
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name cannot be empty',
      });
    }
  }

  // 3. Validate SKU (if provided)
  if (sku !== undefined) {
    if (typeof sku !== 'string' || sku.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'SKU cannot be empty',
      });
    }
  }

  // 4. Validate Category (if provided)
  if (category !== undefined) {
    if (!isValidObjectId(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Category ID format',
      });
    }
  }

  // 5. Validate Unit Price / Price (if provided)
  const rawPrice = unitPrice !== undefined ? unitPrice : price;
  if (rawPrice !== undefined) {
    const numPrice = Number(rawPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Unit price must be a non-negative number',
      });
    }
  }

  // 6. Validate Quantity (if provided)
  if (quantity !== undefined) {
    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty < 0 || !Number.isInteger(numQty)) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative integer',
      });
    }
  }

  // 7. Validate optional string fields
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Description must be a string',
    });
  }

  if (supplierName !== undefined && typeof supplierName !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Supplier name must be a string',
    });
  }

  next();
};

/**
 * Validator for Product ID parameter in URL (GET /api/products/:id, DELETE /api/products/:id)
 */
export const validateProductId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID format',
    });
  }
  next();
};

export default {
  createProductValidator,
  updateProductValidator,
  validateProductId,
  isValidObjectId,
};
