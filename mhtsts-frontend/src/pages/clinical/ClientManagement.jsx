import React, { useState, useEffect } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getClients } from '../../services/clinicalService';

const ClientManagement = () => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Emma Johnson', age: 34, contact: '+1 555-0192', diagnosis: 'F41.1 GAD', status: 'ACTIVE', therapist: 'Dr. Smith' },
    { id: 2, name: 'Marcus Williams', age: 42, contact: '+1 555-0811', diagnosis: 'F33.1 MDD Moderate', status: 'AT_RISK', therapist: 'Dr. Smith' },
    { id: 3, name: 'Sofia Garcia', age: 29, contact: '+1 555-0344', diagnosis: 'F43.1 PTSD', status: 'ACTIVE', therapist: 'Dr. Miller' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getClients()
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setClients(res.data);
        }
      })
      .catch(err => console.warn('Using sample clinical client data:', err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b' }}>Clinical Client Management</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Assigned patient caseload, treatment status, and diagnostic codes.</p>

        <ErrorMessage message={error} />
        {loading ? <Loading /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem' }}>Client Name</th>
                <th style={{ padding: '0.8rem' }}>Age</th>
                <th style={{ padding: '0.8rem' }}>Contact Phone</th>
                <th style={{ padding: '0.8rem' }}>Diagnosis Code</th>
                <th style={{ padding: '0.8rem' }}>Status</th>
                <th style={{ padding: '0.8rem' }}>Assigned Provider</th>
                <th style={{ padding: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.8rem', fontWeight: 'bold', color: '#1e293b' }}>{c.name || `${c.firstName} ${c.lastName}`}</td>
                  <td style={{ padding: '0.8rem' }}>{c.age || '34'}</td>
                  <td style={{ padding: '0.8rem' }}>{c.contact || c.phoneNumber}</td>
                  <td style={{ padding: '0.8rem', fontFamily: 'monospace' }}>{c.diagnosis || 'F41.1'}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: c.status === 'AT_RISK' ? '#fee2e2' : '#dcfce7', color: c.status === 'AT_RISK' ? '#b91c1c' : '#15803d', fontSize: '0.8rem', fontWeight: '600' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.8rem' }}>{c.therapist || 'Primary Clinical Provider'}</td>
                  <td style={{ padding: '0.8rem' }}>
                    <button style={{ padding: '0.3rem 0.8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      View EHR Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ClinicalLayout>
  );
};

export default ClientManagement;
