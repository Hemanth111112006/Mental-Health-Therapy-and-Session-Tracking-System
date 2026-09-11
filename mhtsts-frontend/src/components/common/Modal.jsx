import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  showFooter = true,
  size = 'md', // sm, md, lg, xl
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1140px'
  };

  return (
    <div className="mc-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="mc-modal-container mc-card" style={{ width: '100%', maxWidth: maxWidths[size], backgroundColor: 'var(--bg-primary)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {title && (
          <div className="mc-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-secondary)' }}>&times;</button>
          </div>
        )}

        <div className="mc-modal-body" style={{ padding: '20px', overflowY: 'auto' }}>
          {children}
        </div>

        {showFooter && (
          <div className="mc-modal-footer" style={{ padding: '16px 20px', borderTop: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="outline" onClick={onClose}>{cancelText}</Button>
            {onConfirm && <Button variant={confirmVariant} onClick={onConfirm}>{confirmText}</Button>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
