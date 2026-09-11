import React from 'react';
import ClientLayout from '../../layouts/ClientLayout';

const ClientCalendar = () => {
  const events = [
    { date: 'Aug 15, 2026', event: 'Telehealth Therapy Session with Dr. Smith', type: 'APPOINTMENT' },
    { date: 'Aug 22, 2026', event: 'PHQ-9 Weekly Self-Assessment Due', type: 'REMINDER' }
  ];

  return (
    <ClientLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>Personal Care Calendar</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Upcoming therapy appointments, assessment reminders, and session logs.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {events.map((e, idx) => (
            <div key={idx} style={{ padding: '1.2rem', borderRadius: '8px', borderLeft: '4px solid #2563eb', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 'bold' }}>{e.date}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', marginTop: '0.4rem' }}>{e.event}</div>
              <span style={{ display: 'inline-block', marginTop: '0.8rem', padding: '0.2rem 0.5rem', background: '#eff6ff', color: '#2563eb', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>{e.type}</span>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientCalendar;
