import React, { useState } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';

const TreatmentPlans = () => {
  const [plans] = useState([
    { id: 1, client: 'Emma Johnson', goal: 'Reduce panic attack frequency', approach: 'Cognitive Behavioral Therapy (CBT)', startDate: '2026-06-01', reviewDate: '2026-09-01', status: 'IN_PROGRESS' },
    { id: 2, client: 'Marcus Williams', goal: 'Improve mood regulation & sleep hygiene', approach: 'Dialectical Behavior Therapy (DBT)', startDate: '2026-07-15', reviewDate: '2026-10-15', status: 'IN_PROGRESS' }
  ]);

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b' }}>Individualized Treatment Plans</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Therapeutic goals, behavioral objectives, and evidence-based interventions.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {plans.map(p => (
            <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.2rem', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#1e293b' }}>{p.client}</h3>
                <span style={{ padding: '0.2rem 0.6rem', background: '#dcfce7', color: '#15803d', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>{p.status}</span>
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Primary Goal:</strong> {p.goal}</div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Therapy Approach:</strong> {p.approach}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Start: {p.startDate}</span>
                <span>Next Review: {p.reviewDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClinicalLayout>
  );
};

export default TreatmentPlans;
