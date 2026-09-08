import React from 'react';

/**
 * Universal Loading Spinner component
 */
export const LoadingSpinner = ({ size = 'medium', text = 'Loading...', inline = false }) => {
  if (inline) {
    return <span className={`btn-spinner btn-spinner-${size}`} aria-hidden="true" />;
  }

  return (
    <div className={`spinner-wrapper spinner-${size}`} role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
