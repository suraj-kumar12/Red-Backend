// Application Constants & Enums

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const STOCK_STATUS = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

export const TRANSACTION_TYPES = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  ADJUSTMENT: 'ADJUSTMENT',
};

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};

export default {
  ROLES,
  STOCK_STATUS,
  TRANSACTION_TYPES,
  DEFAULT_PAGINATION,
};
