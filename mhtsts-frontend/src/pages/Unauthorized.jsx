import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ maxWidth: '500px', margin: '5rem auto', textAlign: 'center', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ fontSize: '3rem', color: '#dc2626', marginBottom: '1rem' }}>⛔ Access Denied</div>
      <h2 style={{ color: '#1e293b' }}>Unauthorized Access</h2>
      <p style={{ color: '#64748b', margin: '1rem 0' }}>
        You do not have permission to view this page or resource. Please contact your system administrator if you believe this is an error.
      </p>
      <Link to="/login" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
        Return to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
