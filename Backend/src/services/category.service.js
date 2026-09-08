// Category Service - Business logic for category management
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

/**
 * Create a new category
 */
export const createCategory = async (categoryData) => {
  const { name, description } = categoryData;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    const error = new Error('Category name is required');
    error.statusCode = 400;
    throw error;
  }

  const trimmedName = name.trim();
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
  });

  if (existingCategory) {
    const error = new Error(`Category "${trimmedName}" already exists`);
    error.statusCode = 409;
    throw error;
  }

  const category = await Category.create({
    name: trimmedName,
    description: description ? description.trim() : '',
  });

  return category;
};

/**
 * Get all categories with dynamic count of associated products
 */
export const getCategories = async () => {
  const categories = await Category.find().sort({ name: 1 });
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id });
      return {
        ...cat.toObject(),
        productCount,
      };
    })
  );
  return categoriesWithCount;
};

/**
 * Get single category by ID
 */
export const getCategoryById = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('Invalid category ID');
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const productCount = await Product.countDocuments({ category: category._id });
  return {
    ...category.toObject(),
    productCount,
  };
};

/**
 * Update category details
 */
export const updateCategory = async (categoryId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('Invalid category ID');
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  if (updateData.name !== undefined) {
    if (typeof updateData.name !== 'string' || updateData.name.trim() === '') {
      const error = new Error('Category name cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    const trimmedName = updateData.name.trim();
    if (trimmedName.toLowerCase() !== category.name.toLowerCase()) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        const error = new Error(`Category "${trimmedName}" already exists`);
        error.statusCode = 409;
        throw error;
      }
    }
    category.name = trimmedName;
  }

  if (updateData.description !== undefined) {
    category.description = updateData.description ? updateData.description.trim() : '';
  }

  await category.save();
  const productCount = await Product.countDocuments({ category: category._id });
  return {
    ...category.toObject(),
    productCount,
  };
};

/**
 * Delete a category (Guards against deleting categories with assigned products)
 */
export const deleteCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('Invalid category ID');
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if any products are currently assigned to this category
  const productCount = await Product.countDocuments({ category: categoryId });
  if (productCount > 0) {
    const error = new Error(
      `Cannot delete category because products are assigned to it. (Currently ${productCount} product(s) assigned)`
    );
    error.statusCode = 400;
    throw error;
  }

  await Category.findByIdAndDelete(categoryId);
  return { message: 'Category deleted successfully', id: categoryId };
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
