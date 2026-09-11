import React from 'react';

const Spinner = ({ size = 'md', color = 'var(--color-primary)', centered = false }) => {
  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem'
  };

  const spinner = (
    <div
      className="mc-spinner"
      style={{
        display: 'inline-block',
        width: sizeMap[size] || sizeMap.md,
        height: sizeMap[size] || sizeMap.md,
        border: `3px solid ${color}30`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );

  if (centered) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', width: '100%' }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
