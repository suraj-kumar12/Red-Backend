// Product Service - Business logic for product management & inventory listing
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { calculateStockStatus } from '../utils/stockStatus.js';

// Escape regex special characters to prevent regex injection
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  const { name, sku, category, description, quantity, unitPrice, supplierName } = productData;

  // Validate category existence
  if (!category) {
    const error = new Error('Category is required');
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    const error = new Error('Invalid Category ID');
    error.statusCode = 400;
    throw error;
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const cleanSku = sku ? sku.toUpperCase().trim() : '';
  const existingProduct = await Product.findOne({ sku: cleanSku });
  if (existingProduct) {
    const error = new Error(`Product with SKU "${cleanSku}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const parsedQuantity = Math.max(0, Number(quantity) || 0);
  const status = calculateStockStatus(parsedQuantity);

  const product = await Product.create({
    name: name.trim(),
    sku: cleanSku,
    category,
    description: description ? description.trim() : '',
    quantity: parsedQuantity,
    unitPrice: Number(unitPrice),
    supplierName: supplierName ? supplierName.trim() : '',
    status,
  });

  return await product.populate('category', 'name description');
};

/**
 * Get products with server-side Search, Category Filter, Status Filter, Sorting, and Pagination
 */
export const getProducts = async (queryParams = {}) => {
  const {
    search = '',
    category = '',
    status = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = queryParams;

  const filter = {};

  // 1. Partial & Case-insensitive search on name OR SKU
  if (search && typeof search === 'string' && search.trim() !== '') {
    const safeSearch = escapeRegex(search.trim());
    const searchRegex = new RegExp(safeSearch, 'i');
    filter.$or = [{ name: searchRegex }, { sku: searchRegex }];
  }

  // 2. Filter by Category (Validate MongoDB ObjectId)
  if (category && typeof category === 'string' && category.trim() !== '' && category !== 'All') {
    if (mongoose.Types.ObjectId.isValid(category.trim())) {
      filter.category = new mongoose.Types.ObjectId(category.trim());
    }
  }

  // 3. Filter by Stock Status
  const allowedStatuses = ['In Stock', 'Low Stock', 'Out of Stock'];
  if (status && allowedStatuses.includes(status.trim())) {
    filter.status = status.trim();
  }

  // 4. Safe Sorting Whitelist
  const sort = {};
  const allowedSortFields = {
    name: 'name',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    price: 'unitPrice',
    sku: 'sku',
    createdAt: 'createdAt',
  };

  const selectedField = allowedSortFields[sortBy] || 'createdAt';
  const selectedOrder = sortOrder === 'asc' ? 1 : -1;
  sort[selectedField] = selectedOrder;

  // 5. Server-side Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage: pageNum,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      totalProducts: total,
      total,
      limit: limitNum,
    },
  };
};

/**
 * Get a single product by ID
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate('category', 'name description');
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};

/**
 * Update product information
 */
export const updateProduct = async (productId, updateData) => {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // If category is being updated, validate existence
  if (updateData.category !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
      const error = new Error('Invalid Category ID');
      error.statusCode = 400;
      throw error;
    }
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    product.category = updateData.category;
  }

  // If SKU is being updated, verify uniqueness
  if (updateData.sku && updateData.sku.toUpperCase().trim() !== product.sku) {
    const cleanSku = updateData.sku.toUpperCase().trim();
    const existingSku = await Product.findOne({
      sku: cleanSku,
      _id: { $ne: productId },
    });
    if (existingSku) {
      const error = new Error(`Product with SKU "${cleanSku}" already exists`);
      error.statusCode = 409;
      throw error;
    }
    product.sku = cleanSku;
  }

  if (updateData.name !== undefined) product.name = updateData.name.trim();
  if (updateData.description !== undefined) product.description = updateData.description.trim();
  if (updateData.unitPrice !== undefined) product.unitPrice = Number(updateData.unitPrice);
  if (updateData.supplierName !== undefined) product.supplierName = updateData.supplierName.trim();

  // If quantity is updated, automatically calculate stock status
  if (updateData.quantity !== undefined) {
    product.quantity = Math.max(0, Number(updateData.quantity));
    product.status = calculateStockStatus(product.quantity);
  }

  await product.save();
  return await product.populate('category', 'name description');
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return { message: 'Product deleted successfully', id: productId };
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
