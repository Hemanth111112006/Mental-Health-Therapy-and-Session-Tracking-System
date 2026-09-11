import React from 'react';
import Spinner from './Spinner';
import Alert from './Alert';

const Table = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  error = null,
  emptyMessage = 'No records found.',
  onRowClick,
  className = '',
}) => {
  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert type="error" title="Error Loading Data">{error}</Alert>
      </div>
    );
  }

  return (
    <div className={`mc-table-container ${className}`} style={{ width: '100%', overflowX: 'auto' }}>
      <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
            {columns.map((col, index) => (
              <th key={index} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', ...col.headerStyle }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center' }}>
                <Spinner centered />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={row[keyField] || rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                style={{ 
                  borderBottom: '1px solid var(--border-primary)', 
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.2s',
                  backgroundColor: 'var(--bg-primary)'
                }}
                onMouseEnter={e => onRowClick && (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                onMouseLeave={e => onRowClick && (e.currentTarget.style.backgroundColor = 'var(--bg-primary)')}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: '16px', fontSize: '14px', color: 'var(--text-primary)', ...col.style }}>
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
