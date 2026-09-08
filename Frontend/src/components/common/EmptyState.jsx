import React from 'react';

const EmptyState = ({
  icon = '📦',
  title = 'No items found',
  message = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
