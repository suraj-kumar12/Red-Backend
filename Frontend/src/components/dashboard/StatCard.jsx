import React from 'react';

const StatCard = ({ title, value, icon, subtitle, colorScheme = 'blue' }) => {
  return (
    <div className={`stat-card stat-card-${colorScheme}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon">{icon}</div>
      </div>
      <div className="stat-card-value">{value}</div>
      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
