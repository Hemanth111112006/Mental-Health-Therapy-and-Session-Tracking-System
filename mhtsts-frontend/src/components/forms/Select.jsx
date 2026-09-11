import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
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
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mc-form-select ${error ? 'mc-form-select-error' : ''}`}
        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: `1px solid ${error ? 'var(--color-danger)' : 'var(--border-primary)'}`, outline: 'none', backgroundColor: 'var(--bg-primary)' }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="mc-form-error" style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Select;
