import React, { createContext, useContext, useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/errorHandler.js';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const formattedMessage = typeof message === 'string' ? message : getErrorMessage(message);

    const newNotification = {
      id,
      message: formattedMessage,
      type,
      createdAt: Date.now(),
    };

    setNotifications((prev) => {
      // Keep maximum 4 concurrent toasts to avoid clutter
      const filtered = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
      return [...filtered, newNotification];
    });

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 4000) => {
    addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((errorOrMessage, duration = 5000) => {
    const message = typeof errorOrMessage === 'string' ? errorOrMessage : getErrorMessage(errorOrMessage);
    addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration = 4500) => {
    addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration = 4000) => {
    addNotification(message, 'info', duration);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {notifications.map((n) => (
          <div key={n.id} className={`toast toast-${n.type}`} role="alert">
            <span className="toast-icon">
              {n.type === 'success' && '✓'}
              {n.type === 'error' && '✕'}
              {n.type === 'warning' && '⚠'}
              {n.type === 'info' && 'ℹ'}
            </span>
            <div className="toast-content">
              <span className="toast-message">{n.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
