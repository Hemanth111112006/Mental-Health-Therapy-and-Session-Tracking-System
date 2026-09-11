import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getUsers } from '../../services/adminService';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'dr_smith', email: 'smith@mindcare.com', role: 'THERAPIST', status: 'ACTIVE' },
    { id: 2, username: 'dr_miller', email: 'miller@mindcare.com', role: 'PSYCHIATRIST', status: 'ACTIVE' },
    { id: 3, username: 'john_doe', email: 'john.doe@example.com', role: 'CLIENT', status: 'ACTIVE' },
    { id: 4, username: 'sarah_frontdesk', email: 'sarah@mindcare.com', role: 'RECEPTIONIST', status: 'ACTIVE' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
  };

  return (
    <AdminLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ color: '#1e293b' }}>User Management</h2>
            <p style={{ color: '#64748b' }}>Manage EHR system users, credentials, roles, and status.</p>
          </div>
          <button style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add New User
          </button>
        </div>

        <ErrorMessage message={error} />
        {loading ? <Loading /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem' }}>User ID</th>
                <th style={{ padding: '0.8rem' }}>Username</th>
                <th style={{ padding: '0.8rem' }}>Email</th>
                <th style={{ padding: '0.8rem' }}>Role</th>
                <th style={{ padding: '0.8rem' }}>Status</th>
                <th style={{ padding: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>#{u.id}</td>
                  <td style={{ padding: '0.8rem' }}>{u.username}</td>
                  <td style={{ padding: '0.8rem' }}>{u.email}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#eff6ff', color: '#2563eb', fontSize: '0.8rem', fontWeight: '600' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: u.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: u.status === 'ACTIVE' ? '#15803d' : '#b91c1c', fontSize: '0.8rem', fontWeight: '600' }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <button onClick={() => toggleStatus(u.id)} style={{ padding: '0.3rem 0.8rem', background: u.status === 'ACTIVE' ? '#f3f4f6' : '#dcfce7', color: u.status === 'ACTIVE' ? '#374151' : '#15803d', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;


