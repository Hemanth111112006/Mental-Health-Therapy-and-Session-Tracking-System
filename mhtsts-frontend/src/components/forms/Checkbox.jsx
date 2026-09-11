import React from 'react';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mc-form-group" style={{ marginBottom: 'var(--space-3)' }}>
      <label className="mc-form-checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="mc-form-checkbox"
          style={{ marginRight: '8px', width: '16px', height: '16px', cursor: disabled ? 'not-allowed' : 'pointer' }}
          {...props}
        />
        <span style={{ fontWeight: 400, color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </span>
      </label>
      {error && <div className="mc-form-error" style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Checkbox;

