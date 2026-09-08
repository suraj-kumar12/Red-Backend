import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';

const Header = ({ onToggleSidebar, title }) => {
  const { user } = useAuth();

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        {title && <h1 className="header-title">{title}</h1>}
      </div>

      <div className="header-right">
        <div className="header-user-badge">
          <span className="welcome-text">Signed in as</span>
          <strong className="user-email">{user?.email}</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
