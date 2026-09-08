import api from './api.js';

export const increaseStock = async (productId, amount, reason = '') => {
  const response = await api.patch(`/inventory/${productId}/increase`, {
    amount,
    reason,
  });
  return response.data;
};

export const reduceStock = async (productId, amount, reason = '') => {
  const response = await api.patch(`/inventory/${productId}/reduce`, {
    amount,
    reason,
  });
  return response.data;
};

export const adjustStock = async (stockData) => {
  const response = await api.patch('/inventory/stock', stockData);
  return response.data;
};

export const getStockHistory = async (productId) => {
  const response = await api.get(`/inventory/history/${productId}`);
  return response.data;
};

export default {
  increaseStock,
  reduceStock,
  adjustStock,
  getStockHistory,
};
