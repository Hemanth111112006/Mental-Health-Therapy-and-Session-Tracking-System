import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  return (
    <div className={`mc-form-group ${className}`} style={{ marginBottom: 'var(--space-3)' }}>
      {label && (
        <label htmlFor={name} className="mc-form-label" style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label} {required && <span className="mc-text-danger" style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)', pointerEvents: 'none' }}>
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`mc-form-input ${error ? 'mc-form-input-error' : ''}`}
          style={{ width: '100%', padding: '8px 12px', paddingLeft: icon ? 40 : 12, borderRadius: '8px', border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-primary)'}`, outline: 'none' }}
          {...props}
        />
      </div>
      {error && <div className="mc-form-error" style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Input;
