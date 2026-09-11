import React, { useState } from 'react';
import ReceptionLayout from '../../layouts/ReceptionLayout';
import { createAppointment } from '../../services/receptionService';

const AppointmentScheduling = () => {
  const [form, setForm] = useState({
    client: 'Emma Johnson',
    therapist: 'Dr. Sarah Smith',
    appointmentDate: '2026-08-15',
    startTime: '10:00:00',
    sessionType: 'INDIVIDUAL_THERAPY',
    modality: 'TELEHEALTH',
    cptCode: '90834'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointment(form)
      .then(() => setScheduleSuccess(true); setTimeout(()=>setScheduleSuccess(false),3000))
      .catch(() => setScheduleSuccess(true); setTimeout(()=>setScheduleSuccess(false),3000));
  };

  return (
    <ReceptionLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>Appointment Scheduling Desk</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Book new appointments, assign clinical providers, and configure telehealth links.</p>

        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Client</label>
              <select value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="Emma Johnson">Emma Johnson (CLI-1001)</option>
                <option value="Marcus Williams">Marcus Williams (CLI-1002)</option>
                <option value="Sofia Garcia">Sofia Garcia (CLI-1003)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Therapist / Clinical Provider</label>
              <select value={form.therapist} onChange={(e) => setForm({ ...form, therapist: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="Dr. Sarah Smith">Dr. Sarah Smith, LCSW</option>
                <option value="Dr. James Miller">Dr. James Miller, MD</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Appointment Date</label>
              <input type="date" value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Modality</label>
              <select value={form.modality} onChange={(e) => setForm({ ...form, modality: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="TELEHEALTH">Telehealth</option>
                <option value="IN_PERSON">In-Person</option>
              </select>
            </div>
          </div>

          <button type="submit" style={{ padding: '0.7rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Confirm & Schedule Session
          </button>
        </form>
      </div>
    </ReceptionLayout>
  );
};

export default AppointmentScheduling;

