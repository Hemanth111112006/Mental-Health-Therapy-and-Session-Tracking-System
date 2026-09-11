import React from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`mc-form-group ${className}`} style={{ marginBottom: 'var(--space-3)' }}>
      {label && (
        <label htmlFor={name} className="mc-form-label" style={{ display: 'block', marginBottom: 'var(--space-1)', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label} {required && <span className="mc-text-danger" style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`mc-form-input ${error ? 'mc-form-input-error' : ''}`}
        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: error ? '1px solid var(--color-danger)' : '1px solid var(--border-primary)', outline: 'none', resize: 'vertical' }}
        {...props}
      />
      {error && <div className="mc-form-error" style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Textarea;

