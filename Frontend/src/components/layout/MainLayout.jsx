import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path === '/products/add') return 'Add New Product';
    if (path.includes('/products/edit/')) return 'Edit Product';
    if (path.includes('/products/')) return 'Product Details';
    if (path.startsWith('/products')) return 'Product Management';
    if (path.startsWith('/categories')) return 'Category Management';
    return 'Inventory Management';
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main-wrapper">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle(location.pathname)}
        />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
