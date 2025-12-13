import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

/**
 * Toast Notification System
 * Beautiful, customizable toast notifications
 */

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  const loading = useCallback((message) => {
    return addToast(message, 'loading', 0);
  }, [addToast]);

  const value = {
    success,
    error,
    warning,
    info,
    loading,
    remove: removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'loading':
        return '⟳';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-message">
        {toast.message}
      </div>
      {toast.duration > 0 && (
        <button className="toast-close" onClick={onRemove}>
          ×
        </button>
      )}
      {toast.duration > 0 && (
        <div 
          className="toast-progress" 
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      )}
    </div>
  );
};

// Standalone toast functions (for use without provider)
let toastQueue = [];
let toastContainer = null;

const ensureContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const showToast = (message, type = 'info', duration = 3000) => {
  const container = ensureContainer();
  const id = Date.now() + Math.random();
  
  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type}`;
  toastEl.innerHTML = `
    <div class="toast-icon">${getIconForType(type)}</div>
    <div class="toast-message">${message}</div>
    ${duration > 0 ? '<button class="toast-close">×</button>' : ''}
    ${duration > 0 ? `<div class="toast-progress" style="animation-duration: ${duration}ms"></div>` : ''}
  `;

  const closeBtn = toastEl.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toastEl.classList.add('toast-exit');
      setTimeout(() => toastEl.remove(), 300);
    });
  }

  container.appendChild(toastEl);

  if (duration > 0) {
    setTimeout(() => {
      toastEl.classList.add('toast-exit');
      setTimeout(() => toastEl.remove(), 300);
    }, duration);
  }

  return id;
};

const getIconForType = (type) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
    case 'loading': return '⟳';
    default: return 'ℹ';
  }
};

export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration),
  loading: (message) => showToast(message, 'loading', 0)
};

export default toast;
