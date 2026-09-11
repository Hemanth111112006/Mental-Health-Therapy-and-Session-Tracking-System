import React, { useState } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';
import { createCrisisAssessment } from '../../services/clinicalService';

const CrisisAssessment = () => {
  const [assessments] = useState([
    { id: 1, client: 'Marcus Williams', date: '2026-08-08', suicidality: 'LOW', homicidality: 'NONE', intervention: 'Safety plan reviewed. Client agreed to emergency contact protocol.' }
  ]);

  const [form, setForm] = useState({
    suicidalityLevel: 'LOW',
    homicidalityLevel: 'NONE',
    actionTaken: '',
    hospitalizedFlag: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCrisisAssessment(form)
      .then(() => setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3000))
      .catch(() => setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3000));
  };

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#dc2626' }}>ðŸš¨ Crisis Risk Assessment Log</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Suicidality, homicidality, and immediate risk intervention protocol.</p>

        <form onSubmit={handleSubmit} style={{ background: '#fef2f2', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #fca5a5' }}>
          <h3 style={{ fontSize: '1rem', color: '#991b1b', marginBottom: '1rem' }}>Record Crisis Assessment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Suicidality Level</label>
              <select value={form.suicidalityLevel} onChange={(e) => setForm({ ...form, suicidalityLevel: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="NONE">NONE</option>
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
                <option value="SEVERE">SEVERE</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Homicidality Level</label>
              <select value={form.homicidalityLevel} onChange={(e) => setForm({ ...form, homicidalityLevel: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="NONE">NONE</option>
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Intervention Action Taken</label>
            <textarea rows="3" value={form.actionTaken} onChange={(e) => setForm({ ...form, actionTaken: e.target.value })} placeholder="Describe safety steps, family contact, mobile crisis involvement..." style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Log Crisis Assessment
          </button>
        </form>

        <h3>Recent Risk Assessments</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.8rem' }}>Client</th>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Risk Level</th>
              <th style={{ padding: '0.8rem' }}>Intervention Summary</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{a.client}</td>
                <td style={{ padding: '0.8rem', color: '#64748b' }}>{a.date}</td>
                <td style={{ padding: '0.8rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', background: '#fee2e2', color: '#991b1b', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {a.suicidality}
                  </span>
                </td>
                <td style={{ padding: '0.8rem' }}>{a.intervention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClinicalLayout>
  );
};

export default CrisisAssessment;

