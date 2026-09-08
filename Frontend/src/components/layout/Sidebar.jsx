import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useNotification } from '../../hooks/useNotification.js';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Products', path: '/products', icon: '📦' },
    { label: 'Categories', path: '/categories', icon: '🏷️' },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span className="logo-icon">🔴</span>
            <span className="logo-text">RED Inventory</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN MENU</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User profile & Logout footer */}
        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-meta">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role?.toUpperCase() || 'USER'}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Log out">
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
