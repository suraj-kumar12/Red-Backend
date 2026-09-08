import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/product.service.js';
import categoryService from '../services/category.service.js';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useNotification } from '../hooks/useNotification.js';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    quantity: '0',
    unitPrice: '',
    supplierName: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProductById(id),
        ]);

        setCategories(categoriesRes.data || []);

        const product = productRes.data;
        if (product) {
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            category: product.category?._id || product.category || '',
            description: product.description || '',
            quantity: String(product.quantity ?? 0),
            unitPrice: String(product.unitPrice ?? ''),
            supplierName: product.supplierName || '',
          });
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Failed to load product details';
        showError(errMsg);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, showError, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.quantity === '' || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number or 0';
    }
    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await productService.updateProduct(id, {
        ...formData,
        sku: formData.sku.toUpperCase().trim(),
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      });

      showSuccess(`Product "${formData.name}" updated successfully!`);
      navigate(`/products/${id}`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update product';
      showError(errMsg);
      setErrors((prev) => ({ ...prev, general: errMsg }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading-wrapper">
        <LoadingSpinner text="Loading product information..." />
      </div>
    );
  }

  const previewQuantity = Number(formData.quantity) || 0;
  const computedStatus =
    previewQuantity <= 0 ? 'Out of Stock' : previewQuantity <= 10 ? 'Low Stock' : 'In Stock';

  return (
    <div className="form-page-container">
      <div className="form-page-header">
        <Link to={`/products/${id}`} className="back-link">
          ← Back to Product Details
        </Link>
        <h2 className="section-title">Edit Product</h2>
        <p className="section-subtitle">Update catalog details and inventory specification</p>
      </div>

      <div className="card form-card">
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-row">
            {/* Product Name */}
            <div className="form-group flex-2">
              <label className="form-label" htmlFor="prod-name">
                Product Name *
              </label>
              <input
                id="prod-name"
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                disabled={submitting}
                autoFocus
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* SKU */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="prod-sku">
                SKU (Unique Code) *
              </label>
              <input
                id="prod-sku"
                type="text"
                name="sku"
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                value={formData.sku}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.sku && <span className="field-error">{errors.sku}</span>}
            </div>
          </div>

          <div className="form-row">
            {/* Category */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="prod-cat">
                Category *
              </label>
              <select
                id="prod-cat"
                name="category"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
              >
                {categories.length === 0 && (
                  <option value="">No categories found. Create one first.</option>
                )}
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            {/* Supplier Name */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="prod-supplier">
                Supplier Name
              </label>
              <input
                id="prod-supplier"
                type="text"
                name="supplierName"
                className="form-control"
                placeholder="e.g. Acme Supplies Ltd."
                value={formData.supplierName}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="form-row">
            {/* Unit Price */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="prod-price">
                Unit Price ($) *
              </label>
              <input
                id="prod-price"
                type="number"
                step="0.01"
                min="0.01"
                name="unitPrice"
                className={`form-control ${errors.unitPrice ? 'is-invalid' : ''}`}
                value={formData.unitPrice}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.unitPrice && <span className="field-error">{errors.unitPrice}</span>}
            </div>

            {/* Quantity */}
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="prod-quantity">
                Stock Quantity *
              </label>
              <input
                id="prod-quantity"
                type="number"
                min="0"
                name="quantity"
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                value={formData.quantity}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>

            {/* Calculated Status Badge */}
            <div className="form-group flex-1">
              <label className="form-label">Auto-Calculated Status</label>
              <div className="status-preview-box">
                <span className={`status-preview-tag status-${computedStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {computedStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="prod-desc">
              Description
            </label>
            <textarea
              id="prod-desc"
              name="description"
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <Link to={`/products/${id}`} className="btn btn-outline" tabIndex={submitting ? -1 : 0}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" inline={true} />
                  <span>Updating Product...</span>
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
