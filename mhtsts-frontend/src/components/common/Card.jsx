import React from 'react';

const Card = ({
  title,
  subtitle,
  actions,
  children,
  className = '',
  bodyStyle = {},
  headerStyle = {},
}) => {
  return (
    <div className={`mc-card ${className}`} style={{ borderRadius: '12px', backgroundColor: 'var(--bg-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
      {(title || subtitle || actions) && (
        <div className="mc-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...headerStyle }}>
          <div>
            {title && <h3 className="mc-card-title" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{title}</h3>}
            {subtitle && <p className="mc-card-subtitle" style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</p>}
          </div>
          {actions && <div className="mc-card-actions">{actions}</div>}
        </div>
      )}
      <div className="mc-card-content" style={{ padding: '20px', ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
};

export default Card;
