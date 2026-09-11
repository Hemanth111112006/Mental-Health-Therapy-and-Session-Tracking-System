import React from 'react';

const Alert = ({
  type = 'info', // info, success, warning, error
  title,
  children,
  onClose,
  className = '',
}) => {
  const typeStyles = {
    info: { bg: '#3b82f610', border: '#3b82f630', text: '#3b82f6' },
    success: { bg: '#22c55e10', border: '#22c55e30', text: '#22c55e' },
    warning: { bg: '#f59e0b10', border: '#f59e0b30', text: '#f59e0b' },
    error: { bg: '#ef444410', border: '#ef444430', text: '#ef4444' }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div 
      className={`mc-alert mc-alert-${type} ${className}`}
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative'
      }}
    >
      <div style={{ flex: 1 }}>
        {title && <h4 style={{ margin: '0 0 4px 0', color: style.text, fontSize: '14px', fontWeight: 600 }}>{title}</h4>}
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          {children}
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: style.text, cursor: 'pointer', fontSize: '18px', padding: '0 4px', marginLeft: '12px' }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
