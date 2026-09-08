import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || (pagination.totalPages <= 1 && (pagination.totalProducts ?? pagination.total ?? 0) <= (pagination.limit || 10))) {
    return null;
  }

  const page = pagination.currentPage || pagination.page || 1;
  const totalPages = pagination.totalPages || 1;
  const total = pagination.totalProducts ?? pagination.total ?? 0;

  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing page <strong>{page}</strong> of <strong>{totalPages}</strong> ({total} total products)
      </div>
      <div className="pagination-controls">
        <button
          className="btn btn-outline btn-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Previous
        </button>

        <div className="pagination-numbers">
          {pages.map((p, index) =>
            p === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`pagination-number-btn ${p === page ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
