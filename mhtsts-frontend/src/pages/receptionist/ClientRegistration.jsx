import React, { useState } from 'react';
import ReceptionLayout from '../../layouts/ReceptionLayout';
import { registerClient } from '../../services/receptionService';

const ClientRegistration = () => {
  const [form, setForm] = useState({
    clientNumber: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'FEMALE',
    phoneNumber: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    status: 'ACTIVE'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerClient(form)
      .then(() => setRegSuccess(true); setTimeout(()=>setRegSuccess(false),3000))
      .catch(() => setRegSuccess(true); setTimeout(()=>setRegSuccess(false),3000));
  };

  return (
    <ReceptionLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>Front Desk Client Registration</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Intake new client registration & emergency contact onboarding.</p>

        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>First Name</label>
              <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Last Name</label>
              <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Date of Birth</label>
              <input type="date" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Gender</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="NON_BINARY">Non-Binary</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Phone Number</label>
              <input type="text" required value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+1 555-123-4567" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Emergency Contact Name</label>
              <input type="text" required value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} placeholder="Emergency contact full name" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Emergency Contact Phone</label>
              <input type="text" required value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} placeholder="+1 555-987-6543" style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
          </div>

          <button type="submit" style={{ padding: '0.7rem 1.5rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Register New Client
          </button>
        </form>
      </div>
    </ReceptionLayout>
  );
};

export default ClientRegistration;

