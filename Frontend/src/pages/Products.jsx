import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/product.service.js';
import categoryService from '../services/category.service.js';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Pagination from '../components/common/Pagination.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import StockModal from '../components/inventory/StockModal.jsx';
import { SkeletonTable } from '../components/common/Skeleton.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useNotification } from '../hooks/useNotification.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, limit: 10, totalProducts: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Search, Filters, Sorting, and Pagination state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Load Categories from Backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Fetch products from backend with all query parameters applied
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        status: selectedStatus || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      };

      const res = await productService.getProducts(params);
      const rawData = res.data;

      if (rawData && rawData.products) {
        setProducts(rawData.products || []);
        setPagination(rawData.pagination || { currentPage: page, limit, totalProducts: 0, totalPages: 1 });
      } else if (Array.isArray(rawData)) {
        setProducts(rawData);
        setPagination(res.meta || { currentPage: page, limit, totalProducts: rawData.length, totalPages: 1 });
      } else {
        setProducts([]);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to fetch products';
      showError(errMsg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedStatus, sortBy, sortOrder, page, limit, showError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle filter changes (Reset page to 1 on any search/filter/sort change)
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(':');
    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      await productService.deleteProduct(productToDelete._id);
      showSuccess(`Product "${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to delete product';
      showError(errMsg);
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters = Boolean(search || selectedCategory || selectedStatus || sortBy !== 'createdAt' || sortOrder !== 'desc');

  return (
    <div className="products-page">
      {/* Top Header & Actions Bar */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Product Inventory</h2>
          <p className="section-subtitle">Manage, track stock, filter, and organize your product catalog</p>
        </div>
        <div className="action-buttons-group">
          <Link to="/products/add" className="btn btn-primary">
            + Add New Product
          </Link>
          <button
            className="btn btn-outline"
            onClick={fetchProducts}
            disabled={loading}
            title="Refresh product list"
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

      {/* Filter and Search Card */}
      <div className="card filter-card">
        <div className="filters-grid">
          {/* 1. Search Bar */}
          <div className="filter-item search-box">
            <label className="form-label" htmlFor="search-products">
              Search Products
            </label>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                id="search-products"
                type="text"
                className="form-control"
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* 2. Filter by Category */}
          <div className="filter-item">
            <label className="form-label" htmlFor="category-filter">
              Filter by Category
            </label>
            <select
              id="category-filter"
              className="form-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filter by Stock Status */}
          <div className="filter-item">
            <label className="form-label" htmlFor="status-filter">
              Filter by Stock Status
            </label>
            <select
              id="status-filter"
              className="form-control"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock (&gt; 10)</option>
              <option value="Low Stock">Low Stock (1 – 10)</option>
              <option value="Out of Stock">Out of Stock (0)</option>
            </select>
          </div>

          {/* 4. Sort by Name, Quantity, Price, Date */}
          <div className="filter-item">
            <label className="form-label" htmlFor="sort-control">
              Sort By
            </label>
            <select
              id="sort-control"
              className="form-control"
              value={`${sortBy}:${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="createdAt:desc">Date Added (Newest first)</option>
              <option value="createdAt:asc">Date Added (Oldest first)</option>
              <option value="name:asc">Product Name (A → Z)</option>
              <option value="name:desc">Product Name (Z → A)</option>
              <option value="quantity:desc">Stock Quantity (High → Low)</option>
              <option value="quantity:asc">Stock Quantity (Low → High)</option>
              <option value="unitPrice:asc">Price (Low → High)</option>
              <option value="unitPrice:desc">Price (High → Low)</option>
            </select>
          </div>

          {/* 5. Reset / Clear Filters */}
          <div className="filter-item filter-reset-item">
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              title="Reset all filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="card table-card">
        {loading ? (
          <SkeletonTable rows={limit > 5 ? 6 : limit} columns={7} />
        ) : products.length === 0 ? (
          <EmptyState
            icon="📦"
            title={hasActiveFilters ? 'No products match your search' : 'No products found.'}
            message={
              hasActiveFilters
                ? 'Try adjusting your search keywords, category, or stock status filters.'
                : 'No products have been added yet to your inventory.'
            }
            actionLabel={hasActiveFilters ? 'Clear Filters' : '+ Add First Product'}
            onAction={hasActiveFilters ? handleClearFilters : () => navigate('/products/add')}
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Unit Price</th>
                    <th>Stock Quantity</th>
                    <th>Stock Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <Link to={`/products/${p._id}`} className="product-name-link">
                          <strong>{p.name}</strong>
                        </Link>
                        {p.supplierName && (
                          <div className="product-supplier-sub">Supplier: {p.supplierName}</div>
                        )}
                      </td>
                      <td>
                        <span className="sku-badge">{p.sku}</span>
                      </td>
                      <td>
                        <span className="category-pill">
                          {p.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <strong>${Number(p.unitPrice).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div className="quantity-badge-cell">
                          <span className="quantity-num">{p.quantity} units</span>
                          <button
                            className="btn-stock-adjust"
                            onClick={() => setStockModalProduct(p)}
                            title="Quick Adjust Stock"
                          >
                            ± Adjust
                          </button>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="text-right table-actions-cell">
                        <Link
                          to={`/products/${p._id}`}
                          className="action-btn view-btn"
                          title="View Product Details"
                        >
                          👁
                        </Link>
                        <Link
                          to={`/products/edit/${p._id}`}
                          className="action-btn edit-btn"
                          title="Edit Product"
                        >
                          ✏️
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => setProductToDelete(p)}
                          title="Delete Product"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </>
        )}
      </div>

      {/* Quick Stock Adjustment Modal */}
      {stockModalProduct && (
        <StockModal
          isOpen={Boolean(stockModalProduct)}
          product={stockModalProduct}
          onClose={() => setStockModalProduct(null)}
          onStockUpdated={fetchProducts}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Modal
          isOpen={Boolean(productToDelete)}
          onClose={() => !deleting && setProductToDelete(null)}
          title="Confirm Product Deletion"
          maxWidth="440px"
        >
          <div className="delete-confirm-body">
            <p>
              Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>?
            </p>
            <p className="text-muted text-sm mt-1">
              This will permanently delete this product and its associated stock audit records.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProduct}
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

export default Products;
