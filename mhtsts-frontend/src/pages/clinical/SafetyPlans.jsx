import React, { useState } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';
import { createSafetyPlan } from '../../services/clinicalService';

const SafetyPlans = () => {
  const [safetyPlans] = useState([
    {
      id: 1,
      client: 'Marcus Williams',
      warningSigns: 'Increased isolation, racing thoughts, insomnia',
      copingStrategies: 'Deep breathing 4-7-8, listening to calming music, walking',
      supportivePeople: 'Friend Sarah (555-0192), Sister Elena (555-0811)',
      emergencyContacts: 'National Suicide & Crisis Lifeline: 988',
      safePlaces: 'Local Community Library, Sister Elena\'s House',
      followUp: 'Weekly therapy check-in every Tuesday'
    }
  ]);

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#16a34a' }}>ðŸ›¡ï¸ Patient Safety Plans (Stanley-Brown Model)</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Collaborative suicide prevention safety plan & coping strategy protocols.</p>

        {safetyPlans.map(sp => (
          <div key={sp.id} style={{ border: '2px solid #bbf7d0', borderRadius: '8px', padding: '1.5rem', background: '#f0fdf4', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#15803d', marginBottom: '1rem' }}>Active Safety Plan â€” {sp.client}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>1. Warning Signs:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{sp.warningSigns}</p>
              </div>

              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>2. Internal Coping Strategies:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{sp.copingStrategies}</p>
              </div>

              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>3. Social Contacts for Distraction/Support:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{sp.supportivePeople}</p>
              </div>

              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>4. Emergency & Crisis Lines:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#dc2626' }}>{sp.emergencyContacts}</p>
              </div>

              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>5. Safe Environments & Places:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{sp.safePlaces}</p>
              </div>

              <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                <strong style={{ color: '#166534' }}>6. Follow-up & Review Schedule:</strong>
                <p style={{ marginTop: '0.3rem', fontSize: '0.9rem' }}>{sp.followUp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ClinicalLayout>
  );
};

export default SafetyPlans;



