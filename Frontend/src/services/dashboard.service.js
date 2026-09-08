import api from './api.js';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export default {
  getDashboardStats,
};
