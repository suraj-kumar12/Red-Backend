import React from 'react';
import { STOCK_STATUS_COLORS } from '../../utils/constants.js';

const StatusBadge = ({ status }) => {
  const colors = STOCK_STATUS_COLORS[status] || {
    bg: '#f3f4f6',
    text: '#374151',
    border: '#e5e7eb',
  };

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      <span className="status-dot" style={{ backgroundColor: colors.text }}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
