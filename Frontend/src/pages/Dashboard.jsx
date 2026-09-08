import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboard.service.js';
import StatCard from '../components/dashboard/StatCard.jsx';
import { SkeletonStatCards } from '../components/common/Skeleton.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { useNotification } from '../hooks/useNotification.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { showError, showSuccess } = useNotification();

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');
      const response = await dashboardService.getDashboardStats();
      setStats(response.data);
      if (isRefresh) {
        showSuccess('Dashboard metrics updated');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to load dashboard metrics';
      setError(errMsg);
      showError(errMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Welcome & Quick actions bar */}
      <div className="dashboard-header-actions">
        <div>
          <h2 className="section-title">Overview & Key Metrics</h2>
          <p className="section-subtitle">Real-time status of your products and inventory</p>
        </div>
        <div className="action-buttons-group">
          <Link to="/products/add" className="btn btn-primary">
            + Add Product
          </Link>
          <Link to="/categories" className="btn btn-outline">
            🏷️ Categories
          </Link>
          <button
            className="btn btn-outline"
            onClick={() => fetchStats(true)}
            disabled={loading || refreshing}
            title="Refresh data"
          >
            {refreshing ? (
              <>
                <LoadingSpinner size="sm" inline={true} />
                <span>Refreshing...</span>
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

      {error && (
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h3>Failed to load dashboard</h3>
          <p>{error}</p>
          <button className="btn btn-primary btn-sm" onClick={() => fetchStats(false)}>
            Try Again
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      {loading ? (
        <SkeletonStatCards count={5} />
      ) : (
        <div className="stats-grid">
          <StatCard
            title="Total Products"
            value={stats?.totalProducts ?? 0}
            icon="📦"
            subtitle="Unique catalog items"
            colorScheme="blue"
          />
          <StatCard
            title="Total Categories"
            value={stats?.totalCategories ?? 0}
            icon="🏷️"
            subtitle="Organized product types"
            colorScheme="purple"
          />
          <StatCard
            title="Total Stock Quantity"
            value={stats?.totalStockQuantity ?? 0}
            icon="📊"
            subtitle="Total units across all items"
            colorScheme="teal"
          />
          <StatCard
            title="Low Stock Items"
            value={stats?.lowStockItems ?? 0}
            icon="⚠️"
            subtitle="Quantity ≤ 10 units"
            colorScheme="yellow"
          />
          <StatCard
            title="Out of Stock Items"
            value={stats?.outOfStockItems ?? 0}
            icon="🚫"
            subtitle="Quantity = 0 units"
            colorScheme="red"
          />
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="dashboard-sections-grid">
        <div className="card dashboard-action-card">
          <div className="card-header">
            <h3>📦 Product Catalog</h3>
          </div>
          <div className="card-body">
            <p>
              View, search, filter, and modify products in your inventory. Update prices, quantities, and descriptions.
            </p>
            <div className="card-footer-actions">
              <Link to="/products" className="btn btn-primary btn-sm">
                Manage Products →
              </Link>
            </div>
          </div>
        </div>

        <div className="card dashboard-action-card">
          <div className="card-header">
            <h3>🏷️ Categories</h3>
          </div>
          <div className="card-body">
            <p>
              Organize your items into logical product categories to simplify filtering and catalog organization.
            </p>
            <div className="card-footer-actions">
              <Link to="/categories" className="btn btn-outline btn-sm">
                Manage Categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
