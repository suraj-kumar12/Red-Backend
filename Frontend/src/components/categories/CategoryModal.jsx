import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import categoryService from '../../services/category.service.js';
import { LoadingSpinner } from '../common/LoadingSpinner.jsx';
import { useNotification } from '../../hooks/useNotification.js';

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onCategorySaved }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setDescription(categoryToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (categoryToEdit) {
        await categoryService.updateCategory(categoryToEdit._id, {
          name: name.trim(),
          description: description.trim(),
        });
        showSuccess(`Category "${name}" updated successfully`);
      } else {
        await categoryService.createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        showSuccess(`Category "${name}" created successfully`);
      }

      onClose();
      if (onCategorySaved) onCategorySaved();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save category';
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
      title={categoryToEdit ? 'Edit Category' : 'Add New Category'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} className="category-modal-form">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="cat-name">
            Category Name *
          </label>
          <input
            id="cat-name"
            type="text"
            className="form-control"
            placeholder="e.g., Electronics, Hardware, Furniture"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cat-desc">
            Description
          </label>
          <textarea
            id="cat-desc"
            className="form-control"
            rows="3"
            placeholder="Brief description of this category..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <LoadingSpinner size="sm" inline={true} />
                <span>Saving...</span>
              </>
            ) : categoryToEdit ? (
              'Update Category'
            ) : (
              'Create Category'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
