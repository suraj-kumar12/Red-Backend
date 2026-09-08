import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import inventoryService from '../../services/inventory.service.js';
import { LoadingSpinner } from '../common/LoadingSpinner.jsx';
import { useNotification } from '../../hooks/useNotification.js';

const StockModal = ({ isOpen, onClose, product, onStockUpdated }) => {
  const [actionType, setActionType] = useState('INCREASE'); // 'INCREASE' or 'REDUCE'
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    if (actionType === 'REDUCE' && numericAmount > product.quantity) {
      setError(`Cannot reduce by ${numericAmount}. Current stock is only ${product.quantity}.`);
      return;
    }

    try {
      setSubmitting(true);
      if (actionType === 'INCREASE') {
        await inventoryService.increaseStock(product._id, numericAmount, reason);
        showSuccess(`Successfully added ${numericAmount} units to stock`);
      } else {
        await inventoryService.reduceStock(product._id, numericAmount, reason);
        showSuccess(`Successfully deducted ${numericAmount} units from stock`);
      }

      setAmount('');
      setReason('');
      onClose();
      if (onStockUpdated) onStockUpdated();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update stock';
      setError(errMsg);
      showError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !submitting && onClose()}
      title={`Adjust Stock — ${product.name}`}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} className="stock-modal-form">
        <div className="current-stock-callout">
          <span>Current Available Stock:</span>
          <strong>{product.quantity} units</strong>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label className="form-label">Action Type</label>
          <div className="radio-pill-group">
            <button
              type="button"
              className={`pill-btn ${actionType === 'INCREASE' ? 'active increase' : ''}`}
              onClick={() => {
                if (!submitting) {
                  setActionType('INCREASE');
                  setError('');
                }
              }}
              disabled={submitting}
            >
              + Increase Stock
            </button>
            <button
              type="button"
              className={`pill-btn ${actionType === 'REDUCE' ? 'active reduce' : ''}`}
              onClick={() => {
                if (!submitting) {
                  setActionType('REDUCE');
                  setError('');
                }
              }}
              disabled={submitting}
            >
              − Reduce Stock
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="stock-amount">
            Quantity to {actionType === 'INCREASE' ? 'Add' : 'Deduct'} *
          </label>
          <input
            id="stock-amount"
            type="number"
            min="1"
            className="form-control"
            placeholder="e.g. 10"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="stock-reason">
            Reason / Notes (Optional)
          </label>
          <input
            id="stock-reason"
            type="text"
            className="form-control"
            placeholder="e.g., Supplier shipment, Damaged goods, Sale"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn ${actionType === 'INCREASE' ? 'btn-success' : 'btn-warning'}`}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" inline={true} />
                <span>Updating Stock...</span>
              </>
            ) : (
              `Confirm ${actionType === 'INCREASE' ? 'Increase' : 'Reduction'}`
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StockModal;
