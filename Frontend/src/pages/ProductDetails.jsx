import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/product.service.js';
import inventoryService from '../services/inventory.service.js';
import StatusBadge from '../components/common/StatusBadge.jsx';
import StockModal from '../components/inventory/StockModal.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { SkeletonProductDetails } from '../components/common/Skeleton.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useNotification } from '../hooks/useNotification.js';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [productRes, historyRes] = await Promise.allSettled([
        productService.getProductById(id),
        inventoryService.getStockHistory(id),
      ]);

      if (productRes.status === 'fulfilled') {
        setProduct(productRes.value.data);
      } else {
        throw productRes.reason;
      }

      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.data || []);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch product details';
      showError(errMsg);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, showError, navigate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await productService.deleteProduct(id);
      showSuccess(`Product "${product.name}" was successfully deleted.`);
      navigate('/products');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete product';
      showError(errMsg);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <SkeletonProductDetails />;
  }

  if (!product) return null;

  return (
    <div className="product-details-page">
      {/* Top Header & Breadcrumbs */}
      <div className="page-header-actions">
        <div>
          <Link to="/products" className="back-link">
            ← Back to Product List
          </Link>
          <h2 className="section-title">{product.name}</h2>
          <span className="sku-sub">SKU: {product.sku}</span>
        </div>

        <div className="action-buttons-group">
          <button className="btn btn-success" onClick={() => setShowStockModal(true)}>
            ± Adjust Stock
          </button>
          <Link to={`/products/edit/${product._id}`} className="btn btn-outline">
            ✏️ Edit
          </Link>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}>
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="details-layout-grid">
        {/* Left Column: Product Information */}
        <div className="card product-info-card">
          <div className="card-header">
            <h3>Product Specification</h3>
          </div>
          <div className="card-body">
            <div className="info-fields-grid">
              <div className="info-item">
                <span className="info-label">Product Name</span>
                <span className="info-value">{product.name}</span>
              </div>

              <div className="info-item">
                <span className="info-label">SKU (Stock Keeping Unit)</span>
                <span className="info-value">
                  <span className="sku-badge">{product.sku}</span>
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value">
                  <span className="category-pill">{product.category?.name || 'Unassigned'}</span>
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Unit Price</span>
                <span className="info-value price-highlight">
                  ${Number(product.unitPrice).toFixed(2)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Supplier</span>
                <span className="info-value">{product.supplierName || 'Not specified'}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Date Added</span>
                <span className="info-value">
                  {new Date(product.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">
                  {new Date(product.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="description-section">
              <span className="info-label">Description</span>
              <p className="description-text">
                {product.description || 'No description provided for this product.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Stock Status & Audit */}
        <div className="details-sidebar-cards">
          <div className="card stock-status-card">
            <div className="card-header">
              <h3>Inventory Status</h3>
            </div>
            <div className="card-body text-center">
              <div className="big-quantity-display">
                <span className="quantity-count">{product.quantity}</span>
                <span className="quantity-label">Units Available</span>
              </div>
              <div className="status-badge-wrapper">
                <StatusBadge status={product.status} />
              </div>
              <button
                className="btn btn-primary btn-block mt-3"
                onClick={() => setShowStockModal(true)}
              >
                + / − Update Stock Level
              </button>
            </div>
          </div>

          {/* Transaction Audit History */}
          <div className="card history-card">
            <div className="card-header">
              <h3>Stock Change History</h3>
            </div>
            <div className="card-body">
              {history.length === 0 ? (
                <EmptyState
                  variant="compact"
                  icon="⏱️"
                  title="No Stock History Recorded"
                  message="No stock changes have been made for this item yet."
                  actionLabel="+ Adjust Stock"
                  onAction={() => setShowStockModal(true)}
                />
              ) : (
                <div className="history-timeline">
                  {history.slice(0, 5).map((t) => (
                    <div key={t._id} className="timeline-entry">
                      <div className={`timeline-badge badge-${t.type.toLowerCase()}`}>
                        {t.type === 'INCREASE' ? '+' : '-'}
                      </div>
                      <div className="timeline-info">
                        <div className="timeline-title">
                          <strong>{t.type}</strong> {t.quantityChanged} units
                          <span className="timeline-qty-change">
                            ({t.previousQuantity} → {t.newQuantity})
                          </span>
                        </div>
                        {t.reason && <div className="timeline-reason">{t.reason}</div>}
                        <div className="timeline-time">
                          {new Date(t.createdAt).toLocaleDateString()} at{' '}
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stock Modal */}
      {showStockModal && (
        <StockModal
          isOpen={showStockModal}
          product={product}
          onClose={() => setShowStockModal(false)}
          onStockUpdated={fetchDetails}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => !deleting && setShowDeleteModal(false)}
          title="Confirm Product Deletion"
          maxWidth="440px"
        >
          <div className="delete-confirm-body">
            <p>
              Are you sure you want to delete <strong>"{product.name}"</strong>?
            </p>
            <p className="text-muted text-sm mt-1">
              This will permanently delete this product and its associated stock audit records.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <LoadingSpinner size="sm" inline={true} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete Product'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductDetails;
