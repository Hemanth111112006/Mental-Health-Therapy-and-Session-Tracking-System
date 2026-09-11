import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'mc-btn';
  const variantClass = `mc-btn-${variant}`;
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="mc-spinner mc-spinner-sm" style={{ marginRight: 8, borderColor: variant === 'outline' ? 'var(--color-primary)' : '#fff', borderTopColor: 'transparent' }}></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
