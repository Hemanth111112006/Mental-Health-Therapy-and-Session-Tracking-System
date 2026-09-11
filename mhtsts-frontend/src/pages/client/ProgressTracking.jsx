import React from 'react';
import ClientLayout from '../../layouts/ClientLayout';

const ProgressTracking = () => {
  const progressData = [
    { metric: 'PHQ-9 (Depression Scale)', initial: 16, current: 6, status: 'Mild Severity (-10 pts)' },
    { metric: 'GAD-7 (Anxiety Scale)', initial: 14, current: 5, status: 'Mild Anxiety (-9 pts)' },
    { metric: 'Treatment Plan Goals Achieved', initial: '0/4 Goals', current: '3/4 Goals', status: '75% Completed' }
  ];

  return (
    <ClientLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#16a34a', marginBottom: '0.3rem' }}>My Treatment Progress Tracker</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Track your clinical outcome scores and therapeutic milestone progress over time.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {progressData.map((p, idx) => (
            <div key={idx} style={{ padding: '1.2rem', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #16a34a', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 'bold' }}>{p.metric}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.8rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Initial: {p.initial}</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#15803d' }}>Current: {p.current}</span>
              </div>
              <div style={{ marginTop: '0.6rem', padding: '0.3rem 0.6rem', background: '#dcfce7', color: '#15803d', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block' }}>
                {p.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProgressTracking;
