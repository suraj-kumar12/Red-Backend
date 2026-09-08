// Helper to determine stock status based on threshold and quantity

export const calculateStockStatus = (quantity, lowStockThreshold = 10) => {
  if (quantity <= 0) {
    return 'Out of Stock';
  }
  if (quantity <= lowStockThreshold) {
    return 'Low Stock';
  }
  return 'In Stock';
};

export default {
  calculateStockStatus,
};
