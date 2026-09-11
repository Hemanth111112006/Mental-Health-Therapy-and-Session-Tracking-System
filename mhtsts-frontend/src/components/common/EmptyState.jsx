import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon,
  title = 'No Data Found',
  description = 'There are currently no items to display.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`mc-empty-state ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', borderRadius: '12px', border: '1px dashed var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
      {icon && (
        <div style={{ fontSize: '48px', color: 'var(--text-placeholder)', marginBottom: '16px', opacity: 0.8 }}>
          {icon}
        </div>
      )}
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px' }}>{description}</p>
      
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
