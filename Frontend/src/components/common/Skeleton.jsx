import React from 'react';

/**
 * Skeleton pulse element for text or blocks
 */
export const Skeleton = ({ width, height, borderRadius = 'var(--radius-sm)', className = '', style = {} }) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width: width || '100%',
        height: height || '16px',
        borderRadius,
        ...style,
      }}
    />
  );
};

/**
 * Skeleton placeholder for Dashboard StatCards
 */
export const SkeletonStatCards = ({ count = 5 }) => {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card skeleton-stat-card">
          <div className="stat-card-header">
            <Skeleton width="45%" height="14px" />
            <Skeleton width="28px" height="28px" borderRadius="50%" />
          </div>
          <Skeleton width="60%" height="32px" style={{ margin: '8px 0 6px' }} />
          <Skeleton width="75%" height="12px" />
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton placeholder for Data Tables (prevents layout shift)
 */
export const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="table-responsive">
      <table className="custom-table skeleton-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <Skeleton width="80px" height="14px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIndex) => (
            <tr key={rIndex}>
              {Array.from({ length: columns }).map((_, cIndex) => (
                <td key={cIndex}>
                  <Skeleton
                    width={cIndex === 0 ? '160px' : cIndex === columns - 1 ? '70px' : '90px'}
                    height="18px"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Skeleton placeholder for Product Details Page
 */
export const SkeletonProductDetails = () => {
  return (
    <div className="product-details-page">
      <div className="page-header-actions mb-4">
        <div>
          <Skeleton width="120px" height="14px" className="mb-2" />
          <Skeleton width="240px" height="28px" className="mb-2" />
          <Skeleton width="100px" height="14px" />
        </div>
        <div className="action-buttons-group">
          <Skeleton width="110px" height="38px" />
          <Skeleton width="80px" height="38px" />
          <Skeleton width="80px" height="38px" />
        </div>
      </div>

      <div className="details-layout-grid">
        <div className="card product-info-card">
          <div className="card-header">
            <Skeleton width="160px" height="18px" />
          </div>
          <div className="card-body">
            <div className="info-fields-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="info-item">
                  <Skeleton width="60%" height="12px" />
                  <Skeleton width="85%" height="18px" />
                </div>
              ))}
            </div>
            <Skeleton width="100%" height="70px" />
          </div>
        </div>

        <div className="details-sidebar-cards">
          <div className="card stock-status-card">
            <div className="card-header">
              <Skeleton width="120px" height="18px" />
            </div>
            <div className="card-body text-center">
              <Skeleton width="80px" height="50px" style={{ margin: '0 auto 12px' }} />
              <Skeleton width="100px" height="24px" borderRadius="9999px" style={{ margin: '0 auto 16px' }} />
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  Skeleton,
  SkeletonStatCards,
  SkeletonTable,
  SkeletonProductDetails,
};
