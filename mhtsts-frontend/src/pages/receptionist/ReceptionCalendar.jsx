import React from 'react';
import ReceptionLayout from '../../layouts/ReceptionLayout';

const ReceptionCalendar = () => {
  const scheduleSlots = [
    { time: '09:00 AM', therapist: 'Dr. Sarah Smith', client: 'Emma Johnson', modality: 'Telehealth', status: 'BOOKED' },
    { time: '10:00 AM', therapist: 'Dr. Sarah Smith', client: 'Marcus Williams', modality: 'In-Person', status: 'BOOKED' },
    { time: '11:00 AM', therapist: 'Dr. Sarah Smith', client: 'OPEN SLOT', modality: 'N/A', status: 'AVAILABLE' },
    { time: '01:30 PM', therapist: 'Dr. James Miller', client: 'Sofia Garcia', modality: 'In-Person', status: 'BOOKED' }
  ];

  return (
    <ReceptionLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>Reception Master Calendar & Provider Availability</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Daily provider schedules, available intake slots, and session management.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.8rem' }}>Time Slot</th>
              <th style={{ padding: '0.8rem' }}>Clinical Provider</th>
              <th style={{ padding: '0.8rem' }}>Client</th>
              <th style={{ padding: '0.8rem' }}>Modality</th>
              <th style={{ padding: '0.8rem' }}>Availability Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduleSlots.map((s, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{s.time}</td>
                <td style={{ padding: '0.8rem' }}>{s.therapist}</td>
                <td style={{ padding: '0.8rem' }}>{s.client}</td>
                <td style={{ padding: '0.8rem' }}>{s.modality}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', background: s.status === 'AVAILABLE' ? '#dcfce7' : '#eff6ff', color: s.status === 'AVAILABLE' ? '#15803d' : '#2563eb', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ReceptionLayout>
  );
};

export default ReceptionCalendar;
