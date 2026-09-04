import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toasts, removeToast } = useCart();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let className = 'toast toast-success';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          className = 'toast toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          className = 'toast toast-info';
        }

        return (
          <div key={toast.id} className={className}>
            <Icon size={20} />
            <span style={{ flex: 1, fontSize: '0.9rem' }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
