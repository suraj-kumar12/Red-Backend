// Category Controller - Handles HTTP requests for categories
import categoryService from '../services/category.service.js';
import { sendSuccess } from '../utils/response.js';

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return sendSuccess(res, 201, 'Category created successfully', category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    return sendSuccess(res, 200, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return sendSuccess(res, 200, 'Category details fetched successfully', category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    return sendSuccess(res, 200, 'Category updated successfully', category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return sendSuccess(res, 200, 'Category deleted successfully', result);
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
