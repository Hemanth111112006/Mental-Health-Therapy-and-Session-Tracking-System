import React, { useState, useEffect } from 'react';
import ClientLayout from '../../layouts/ClientLayout';
import { getProfile } from '../../services/clientService';

const ClientProfile = () => {
  const [profile, setProfile] = useState({
    clientNumber: 'CLI-1001',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: '1992-05-15',
    email: 'emma.j@example.com',
    phoneNumber: '+1 555-0192',
    emergencyContactName: 'Sarah Johnson',
    emergencyContactPhone: '+1 555-0988',
    assignedTherapist: 'Dr. Sarah Smith, LCSW',
    treatmentStatus: 'ACTIVE'
  });

  return (
    <ClientLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>My Patient Profile</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Personal information, emergency contacts, and care team details.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', color: '#2563eb', marginBottom: '1rem' }}>Personal & Contact Details</h3>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Client ID:</strong> {profile.clientNumber}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Full Name:</strong> {profile.firstName} {profile.lastName}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Date of Birth:</strong> {profile.dateOfBirth}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Email Address:</strong> {profile.email}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Phone Number:</strong> {profile.phoneNumber}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1rem', color: '#16a34a', marginBottom: '1rem' }}>Treatment & Emergency Contact</h3>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Assigned Therapist:</strong> {profile.assignedTherapist}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Treatment Status:</strong> <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>{profile.treatmentStatus}</span></div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Emergency Contact Name:</strong> {profile.emergencyContactName}</div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}><strong>Emergency Contact Phone:</strong> {profile.emergencyContactPhone}</div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientProfile;
