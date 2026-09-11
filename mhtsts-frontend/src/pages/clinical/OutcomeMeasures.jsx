import React, { useState } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';

const OutcomeMeasures = () => {
  const [measures] = useState([
    { id: 1, client: 'Emma Johnson', scale: 'PHQ-9 (Depression)', initialScore: 16, currentScore: 6, trend: 'IMPROVED (-10 pts)', interpretation: 'Mild Severity' },
    { id: 2, client: 'Emma Johnson', scale: 'GAD-7 (Anxiety)', initialScore: 14, currentScore: 5, trend: 'IMPROVED (-9 pts)', interpretation: 'Mild Anxiety' },
    { id: 3, client: 'Marcus Williams', scale: 'PHQ-9 (Depression)', initialScore: 21, currentScore: 18, trend: 'STABLE (-3 pts)', interpretation: 'Moderately Severe' }
  ]);

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#7c3aed' }}>📈 Clinical Outcome Measurements (PHQ-9 & GAD-7)</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Standardized assessment instrument scoring & therapeutic efficacy tracking.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.8rem' }}>Client</th>
              <th style={{ padding: '0.8rem' }}>Assessment Instrument</th>
              <th style={{ padding: '0.8rem' }}>Initial Score</th>
              <th style={{ padding: '0.8rem' }}>Current Score</th>
              <th style={{ padding: '0.8rem' }}>Clinical Severity</th>
              <th style={{ padding: '0.8rem' }}>Progress Trend</th>
            </tr>
          </thead>
          <tbody>
            {measures.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{m.client}</td>
                <td style={{ padding: '0.8rem' }}><span style={{ padding: '0.2rem 0.5rem', background: '#f5f3ff', color: '#7c3aed', borderRadius: '4px', fontWeight: 'bold' }}>{m.scale}</span></td>
                <td style={{ padding: '0.8rem', color: '#64748b' }}>{m.initialScore}</td>
                <td style={{ padding: '0.8rem', fontWeight: 'bold', fontSize: '1.1rem', color: '#1e293b' }}>{m.currentScore}</td>
                <td style={{ padding: '0.8rem' }}>{m.interpretation}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: m.trend.includes('IMPROVED') ? '#dcfce7' : '#fef3c7', color: m.trend.includes('IMPROVED') ? '#15803d' : '#d97706', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {m.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClinicalLayout>
  );
};

export default OutcomeMeasures;
