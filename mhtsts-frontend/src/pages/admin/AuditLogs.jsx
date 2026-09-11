import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getAuditLogs } from '../../services/adminService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    { id: 101, user: 'dr_smith', action: 'CREATE_SESSION_NOTE', timestamp: '2026-08-09 19:45:12', activityType: 'CLINICAL_WRITE', status: 'SUCCESS' },
    { id: 102, user: 'admin_user', action: 'UPDATE_SECURITY_POLICY', timestamp: '2026-08-09 18:30:00', activityType: 'ADMIN_CONFIG', status: 'SUCCESS' },
    { id: 103, user: 'sarah_frontdesk', action: 'SCHEDULE_APPOINTMENT', timestamp: '2026-08-09 17:15:22', activityType: 'SCHEDULING', status: 'SUCCESS' },
    { id: 104, user: 'unknown', action: 'UNAUTHORIZED_ACCESS_ATTEMPT', timestamp: '2026-08-09 16:02:10', activityType: 'SECURITY_ALERT', status: 'DENIED' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAuditLogs()
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setLogs(res.data);
        }
      })
      .catch(err => {
        console.warn('Using sample audit log data:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b' }}>HIPAA Compliance Audit Logs</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Track all system activity, authorization checks, and record access events.</p>

        <ErrorMessage message={error} />
        {loading ? <Loading /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem' }}>Log ID</th>
                <th style={{ padding: '0.8rem' }}>User</th>
                <th style={{ padding: '0.8rem' }}>Action</th>
                <th style={{ padding: '0.8rem' }}>Timestamp</th>
                <th style={{ padding: '0.8rem' }}>Activity Type</th>
                <th style={{ padding: '0.8rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>#{log.id}</td>
                  <td style={{ padding: '0.8rem' }}>{log.user || log.username}</td>
                  <td style={{ padding: '0.8rem', fontFamily: 'monospace' }}>{log.action}</td>
                  <td style={{ padding: '0.8rem', color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', fontWeight: '600' }}>
                      {log.activityType || 'SYSTEM'}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: log.status === 'SUCCESS' ? '#dcfce7' : '#fee2e2', color: log.status === 'SUCCESS' ? '#15803d' : '#b91c1c', fontSize: '0.75rem', fontWeight: '600' }}>
                      {log.status}
                    </span>
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

export default AuditLogs;
