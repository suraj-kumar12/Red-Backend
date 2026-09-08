import React from 'react';

/**
 * Universal Empty State component for datasets, tables, search results, and history logs
 */
export const EmptyState = ({
  icon = '📦',
  title = 'No items found',
  message = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'card', // 'card', 'compact', 'inline'
}) => {
  return (
    <div className={`empty-state-container empty-state-${variant}`} role="region" aria-label={title}>
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="empty-state-actions">
          {actionLabel && onAction && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
