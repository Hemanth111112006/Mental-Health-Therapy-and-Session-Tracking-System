import React, { useState } from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';
import { createSessionNote } from '../../services/clinicalService';

const SessionNotes = () => {
  const [notes, setNotes] = useState([
    { id: 1, client: 'Emma Johnson', date: '2026-08-09', type: 'SOAP', summary: 'Client reports improved mood using CBT techniques.', signature: 'Dr. Smith, LCSW' },
    { id: 2, client: 'Marcus Williams', date: '2026-08-08', type: 'DAP', summary: 'Discussed anxiety triggers and sleep hygiene.', signature: 'Dr. Smith, LCSW' }
  ]);

  const [formData, setFormData] = useState({
    client: 'Emma Johnson',
    sessionDate: '2026-08-09',
    noteType: 'SOAP',
    notes: '',
    progressSummary: '',
    therapistSignature: 'Dr. Smith'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createSessionNote(formData)
      .then(() => setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3000))
      .catch(() => setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3000));

    setNotes([...notes, { id: Date.now(), client: formData.client, date: formData.sessionDate, type: formData.noteType, summary: formData.progressSummary || formData.notes, signature: formData.therapistSignature }]);
  };

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#1e293b' }}>Therapy Session Documentation (SOAP / DAP Notes)</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Create progress notes with electronic provider signature.</p>

        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.2rem', borderRadius: '6px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1e293b' }}>New Session Note</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Client</label>
              <select value={formData.client} onChange={(e) => setFormData({ ...formData, client: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="Emma Johnson">Emma Johnson (CLI-1001)</option>
                <option value="Marcus Williams">Marcus Williams (CLI-1002)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Session Date</label>
              <input type="date" value={formData.sessionDate} onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Note Format</label>
              <select value={formData.noteType} onChange={(e) => setFormData({ ...formData, noteType: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}>
                <option value="SOAP">SOAP Note</option>
                <option value="DAP">DAP Note</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Clinical Progress Summary</label>
            <textarea rows="3" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value, progressSummary: e.target.value })} placeholder="Subjective, Objective, Assessment, Plan..." style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem' }}></textarea>
          </div>
          <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sign & Save Session Note
          </button>
        </form>

        <h3>Previous Session History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.8rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569', fontSize: '0.85rem' }}>
              <th style={{ padding: '0.8rem' }}>Client</th>
              <th style={{ padding: '0.8rem' }}>Date</th>
              <th style={{ padding: '0.8rem' }}>Format</th>
              <th style={{ padding: '0.8rem' }}>Summary</th>
              <th style={{ padding: '0.8rem' }}>Provider Signature</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold' }}>{n.client}</td>
                <td style={{ padding: '0.8rem', color: '#64748b' }}>{n.date}</td>
                <td style={{ padding: '0.8rem' }}><span style={{ padding: '0.2rem 0.5rem', background: '#eff6ff', color: '#2563eb', borderRadius: '4px', fontWeight: 'bold' }}>{n.type}</span></td>
                <td style={{ padding: '0.8rem' }}>{n.summary}</td>
                <td style={{ padding: '0.8rem', color: '#16a34a', fontWeight: 'bold' }}>âœï¸ {n.signature}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClinicalLayout>
  );
};

export default SessionNotes;

