// Product Controller - Handles HTTP requests for products
import productService from '../services/product.service.js';
import { sendSuccess } from '../utils/response.js';

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    return sendSuccess(res, 200, 'Products fetched successfully', {
      products: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return sendSuccess(res, 200, 'Product details fetched successfully', product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return sendSuccess(res, 200, 'Product deleted successfully', result);
  } catch (error) {
    next(error);
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
