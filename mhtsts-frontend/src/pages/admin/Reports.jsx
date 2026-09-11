import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Reports = () => {
  const [reportTypes] = useState([
    { id: 'user-report', title: 'User Management & Access Report', desc: 'Summary of active roles, user statuses, and security clearance.' },
    { id: 'appointment-report', title: 'Appointment & Scheduling Report', desc: 'Breakdown of completed, canceled, and upcoming telehealth vs in-person sessions.' },
    { id: 'clinical-activity-report', title: 'Clinical Activity & Notes Audit', desc: 'HIPAA compliant summary of SOAP notes, crisis assessments, and treatment plans.' },
    { id: 'system-usage-report', title: 'System Usage & Performance Report', desc: 'API latency, database usage, and system uptime metrics.' }
  ]);

  const handleGenerate = (title) => {
    const w=window.open('','_blank'); w.document.write('<h2>'+title+'</h2><p>Generated: '+new Date().toLocaleString()+'</p>'); w.document.close(); w.print();
  };

  return (
    <AdminLayout>
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b' }}>System Administration Reports</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Generate and export executive compliance, clinical, and operational summaries.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {reportTypes.map(report => (
            <div key={report.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.2rem', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '0.4rem' }}>{report.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.4' }}>{report.desc}</p>
              </div>
              <button onClick={() => handleGenerate(report.title)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Generate Report PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;

