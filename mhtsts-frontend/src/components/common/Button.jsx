import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon,
  style = {},
  ...props 
}) => {
  const baseClass = 'mc-btn';
  const variantClass = `mc-btn-${variant}`;
  const sizeClass = size !== 'md' ? `mc-btn-${size}` : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', ...style }}
      {...props}
    >
      {icon && <span className="mc-btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
