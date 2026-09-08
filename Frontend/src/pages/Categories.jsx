import React, { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/category.service.js';
import CategoryModal from '../components/categories/CategoryModal.jsx';
import Modal from '../components/common/Modal.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { SkeletonTable } from '../components/common/Skeleton.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useNotification } from '../hooks/useNotification.js';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useNotification();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to load categories';
      showError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await categoryService.deleteCategory(categoryToDelete._id);
      showSuccess(`Category "${categoryToDelete.name}" deleted successfully.`);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete category';
      showError(errMsg);
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="categories-page">
      {/* Header bar */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Category Management</h2>
          <p className="section-subtitle">Organize products into structured groupings</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            + Create Category
          </button>
          <button
            className="btn btn-outline"
            onClick={fetchCategories}
            disabled={loading}
            title="Refresh categories"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" inline={true} />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search and summary card */}
      <div className="card filter-card">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category List / Grid */}
      <div className="card table-card">
        {loading ? (
          <SkeletonTable rows={5} columns={5} />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            icon="🏷️"
            title="No Categories Found"
            message={
              searchTerm
                ? 'No categories match your search term.'
                : 'No categories have been created yet.'
            }
            actionLabel={searchTerm ? 'Clear Search' : '+ Create First Category'}
            onAction={searchTerm ? () => setSearchTerm('') : handleOpenCreate}
          />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Associated Products</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <strong className="category-title-text">{cat.name}</strong>
                    </td>
                    <td>
                      <span className="text-muted text-sm">
                        {cat.description || 'No description'}
                      </span>
                    </td>
                    <td>
                      <span className="count-pill">
                        {cat.productCount ?? 0} {cat.productCount === 1 ? 'Product' : 'Products'}
                      </span>
                    </td>
                    <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                    <td className="text-right table-actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOpenEdit(cat)}
                        title="Edit Category"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => setCategoryToDelete(cat)}
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal (Create / Edit) */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={categoryToEdit}
        onCategorySaved={fetchCategories}
      />

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <Modal
          isOpen={Boolean(categoryToDelete)}
          onClose={() => !deleting && setCategoryToDelete(null)}
          title="Confirm Category Deletion"
          maxWidth="440px"
        >
          <div className="delete-confirm-body">
            <p>
              Are you sure you want to delete category <strong>"{categoryToDelete?.name}"</strong>?
            </p>
            <p className="text-muted text-sm mt-1">
              Note: Categories with assigned products cannot be deleted.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCategoryToDelete(null)}
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
                  'Delete Category'
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Categories;
