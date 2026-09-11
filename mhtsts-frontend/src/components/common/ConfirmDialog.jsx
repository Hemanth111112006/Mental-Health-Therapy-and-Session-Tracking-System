import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmVariant={confirmVariant}
      size="sm"
    >
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        {message}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
