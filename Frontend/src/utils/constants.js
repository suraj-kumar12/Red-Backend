// Application Constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

export const calculateStockStatus = (quantity, lowStockThreshold = 10) => {
  const q = Number(quantity) || 0;
  if (q <= 0) return 'Out of Stock';
  if (q <= lowStockThreshold) return 'Low Stock';
  return 'In Stock';
};

export const STOCK_STATUS_COLORS = {
  'In Stock': {
    bg: '#ecfdf5',
    text: '#065f46',
    border: '#a7f3d0',
  },
  'Low Stock': {
    bg: '#fffbeb',
    text: '#92400e',
    border: '#fde68a',
  },
  'Out of Stock': {
    bg: '#fef2f2',
    text: '#991b1b',
    border: '#fecaca',
  },
};

export default {
  API_BASE_URL,
  STOCK_STATUS,
  calculateStockStatus,
  STOCK_STATUS_COLORS,
};
