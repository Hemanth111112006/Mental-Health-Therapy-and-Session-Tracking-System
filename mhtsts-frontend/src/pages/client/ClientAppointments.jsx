import React, { useState } from 'react';
import ClientLayout from '../../layouts/ClientLayout';

const ClientAppointments = () => {
  const [appointments] = useState([
    { id: 1, date: '2026-08-15', time: '10:00 AM', therapist: 'Dr. Sarah Smith', type: 'Individual Therapy (Telehealth)', status: 'SCHEDULED' },
    { id: 2, date: '2026-08-01', time: '10:00 AM', therapist: 'Dr. Sarah Smith', type: 'Individual Therapy (In-Person)', status: 'COMPLETED' },
    { id: 3, date: '2026-07-18', time: '10:00 AM', therapist: 'Dr. Sarah Smith', type: 'Individual Therapy (In-Person)', status: 'COMPLETED' }
  ]);

  return (
    <ClientLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>My Therapy Appointments</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Upcoming scheduled sessions and appointment history.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Time</th>
              <th style={{ padding: '0.8rem' }}>Therapist</th>
              <th style={{ padding: '0.8rem' }}>Appointment Type</th>
              <th style={{ padding: '0.8rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{a.date}</td>
                <td style={{ padding: '0.8rem', color: '#64748b' }}>{a.time}</td>
                <td style={{ padding: '0.8rem' }}>{a.therapist}</td>
                <td style={{ padding: '0.8rem' }}>{a.type}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: a.status === 'SCHEDULED' ? '#eff6ff' : '#dcfce7', color: a.status === 'SCHEDULED' ? '#2563eb' : '#15803d', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClientLayout>
  );
};

export default ClientAppointments;
