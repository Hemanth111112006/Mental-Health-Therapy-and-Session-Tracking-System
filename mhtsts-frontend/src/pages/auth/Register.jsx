import React from 'react';

const Register = () => {
  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2>MHTSTS Registration</h2>
      <p style={{ color: '#64748b' }}>Create a new account.</p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label>
          <input type="text" placeholder="Choose username" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type="email" placeholder="Enter email" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Register Account</button>
      </form>
    </div>
  );
};

export default Register;
