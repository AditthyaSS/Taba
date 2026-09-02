import { createContext, useContext, useState, useCallback } from 'react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur || 4500),
    info: (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  };

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#CCFF00', color: '#000', border: '#000', icon: Check };
      case 'error':
        return { bg: '#FF1B6B', color: '#fff', border: '#000', icon: AlertTriangle };
      case 'warning':
        return { bg: '#FF8A00', color: '#000', border: '#000', icon: AlertTriangle };
      default:
        return { bg: '#4400FF', color: '#fff', border: '#000', icon: Info };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Render Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          zIndex: 9999,
          pointerEvents: 'none',
          maxWidth: 'calc(100vw - 48px)',
        }}
      >
        {toasts.map(t => {
          const style = getStyle(t.type);
          const Icon = style.icon;
          return (
            <div
              key={t.id}
              className="card-enter"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                background: style.bg,
                color: style.color,
                border: `3px solid ${style.border}`,
                boxShadow: '4px 4px 0 #000',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                maxWidth: '420px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  background: t.type === 'success' || t.type === 'warning' ? '#000' : '#fff',
                  color: t.type === 'success' ? '#CCFF00' : t.type === 'warning' ? '#FF8A00' : style.color === '#fff' ? '#4400FF' : '#000',
                  border: '2px solid #000',
                  flexShrink: 0,
                }}
              >
                <Icon size={14} strokeWidth={3} />
              </div>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: style.color,
                  cursor: 'pointer',
                  padding: '2px',
                  opacity: 0.7,
                  display: 'flex',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      success: (m) => console.log('Toast [success]:', m),
      error: (m) => console.error('Toast [error]:', m),
      info: (m) => console.log('Toast [info]:', m),
      warning: (m) => console.warn('Toast [warning]:', m),
    };
  }
  return ctx;
}
