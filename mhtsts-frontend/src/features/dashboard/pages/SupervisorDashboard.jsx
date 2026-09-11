import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  Users, FileText, AlertTriangle, Clock, CheckCircle2,
  X, PenTool, Award, ShieldAlert, Check
} from 'lucide-react';
import { toast } from '../../../utils/toast';

const SupervisorDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [supervisees, setSupervisees] = useState([
    { id: 4, name: 'Michael Thompson, ACSW', type: 'Associate LCSW', clientCount: 18, pendingNotes: 3, hoursLogged: 780, hoursRequired: 3000 },
    { id: 11, name: 'Jessica Vance, AMFT', type: 'Associate LMFT', clientCount: 12, pendingNotes: 4, hoursLogged: 1240, hoursRequired: 3000 }
  ]);

  const [pendingCoSignatures, setPendingCoSignatures] = useState([
    { 
      id: 201, 
      client: 'Alex Morgan', 
      supervisee: 'Michael Thompson, ACSW', 
      type: 'CBT SOAP Note', 
      date: 'Today, 09:00 AM',
      content: 'Subjective: Client reports improved sleep routine and reduced intrusive anxiety symptoms.\nObjective: Affect congruent with mood. Completed 7-column thought record assignment.\nAssessment: Mild generalized anxiety (GAD-7: 8). Good progress on cognitive restructuring.\nPlan: Continue weekly CBT. Supervisee reviewed exposure hierarchy with supervisor.'
    },
    { 
      id: 202, 
      client: 'David Wilson', 
      supervisee: 'Michael Thompson, ACSW', 
      type: 'Intake Assessment DAP', 
      date: 'Yesterday',
      content: 'Data: Initial clinical interview conducted with client presenting with depressive episode.\nAssessment: Major Depressive Disorder, Single Episode, Moderate (PHQ-9: 15).\nPlan: Initiate bi-weekly psychotherapy. Safety plan established and verified.'
    },
    { 
      id: 203, 
      client: 'John Smith', 
      supervisee: 'Jessica Vance, AMFT', 
      type: 'Family Session Note', 
      date: '2 days ago',
      content: 'Data: Conjoint session with spouse focused on communication barriers and boundary setting.\nAssessment: Progress observed in active listening techniques.\nPlan: Scheduled follow-up couples session next Tuesday.'
    }
  ]);

  const [crisisConsults, setCrisisConsults] = useState([
    { 
      id: 102, 
      client: 'David Wilson', 
      supervisee: 'Michael Thompson, ACSW', 
      severity: 'HIGH', 
      date: 'July 11, 2026', 
      details: 'Client reported suicidal ideation with passive plans. Safety plan updated. Lethal means restriction verified with spouse.',
      consultationNotes: ''
    }
  ]);

  const [weeklySupervisionHours, setWeeklySupervisionHours] = useState([
    { week: 'W1', hours: 4.5 },
    { week: 'W2', hours: 6.0 },
    { week: 'W3', hours: 5.5 },
    { week: 'W4', hours: 7.0 },
    { week: 'W5', hours: 5.0 },
  ]);

  // Modals state
  const [selectedNote, setSelectedNote] = useState(null);
  const [supervisorFeedback, setSupervisorFeedback] = useState('');
  const [selectedCrisis, setSelectedCrisis] = useState(null);
  const [consultNotesInput, setConsultNotesInput] = useState('');

  const handleOpenReviewModal = (note) => {
    setSelectedNote(note);
    setSupervisorFeedback('Documentation verified compliant with BBS supervision standards and clinical guidelines.');
  };

  const handleApplyCoSignature = (e) => {
    e.preventDefault();
    if (!selectedNote) return;

    setPendingCoSignatures(prev => prev.filter(n => n.id !== selectedNote.id));
    toast.success(`Co-signature applied for ${selectedNote.client}'s note (${selectedNote.type})`);
    setSelectedNote(null);
  };

  const handleOpenCrisisModal = (consult) => {
    setSelectedCrisis(consult);
    setConsultNotesInput(consult.consultationNotes || 'Reviewed safety plan and emergency contact protocols with supervisee. Agreed on 48-hour check-in frequency and psychiatrist consultation.');
  };

  const handleSaveCrisisConsult = (e) => {
    e.preventDefault();
    if (!selectedCrisis) return;

    setCrisisConsults(prev => prev.map(c => 
      c.id === selectedCrisis.id 
        ? { ...c, consultationNotes: consultNotesInput, documentedAt: new Date().toLocaleDateString() } 
        : c
    ));
    toast.success(`Crisis supervision consultation documented for client ${selectedCrisis.client}`);
    setSelectedCrisis(null);
  };

  return (
    <div className="mc-dashboard" style={{ padding: '0 8px 24px 8px' }}>
      <div className="mc-dashboard-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Supervisor Dashboard</h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Oversight for clinical supervisees, documentation compliance, and crisis escalations.
          </p>
        </div>
      </div>

      {/* Stats Cards - Responsive 4-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="mc-stat-card primary" style={{ margin: 0 }}>
          <div className="mc-stat-icon primary"><Users size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-value">{supervisees.length}</div>
            <div className="mc-stat-label">Supervisees Managed</div>
          </div>
        </div>

        <div className="mc-stat-card success" style={{ margin: 0 }}>
          <div className="mc-stat-icon success"><FileText size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-value">{pendingCoSignatures.length + 4}</div>
            <div className="mc-stat-label">Pending Co-Signatures</div>
          </div>
        </div>

        <div className="mc-stat-card warning" style={{ margin: 0 }}>
          <div className="mc-stat-icon warning"><AlertTriangle size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-value">{crisisConsults.length}</div>
            <div className="mc-stat-label">Active Crisis Consults</div>
          </div>
        </div>

        <div className="mc-stat-card accent" style={{ margin: 0 }}>
          <div className="mc-stat-icon accent"><Clock size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-value">5.6h</div>
            <div className="mc-stat-label">Avg. Weekly Supervision</div>
          </div>
        </div>
      </div>

      {/* Middle Row: Supervisees and Co-Signatures */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Supervisee Caseload Overview */}
        <div className="mc-card">
          <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>My Supervisees</h3>
            <button 
              className="mc-btn mc-btn-ghost mc-btn-sm" 
              onClick={() => navigate('/supervisees')}
              style={{ fontSize: 11 }}
            >
              View All Supervisees →
            </button>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {supervisees.map((sup, i) => {
              const progressPct = ((sup.hoursLogged / sup.hoursRequired) * 100).toFixed(0);
              return (
                <div key={sup.id} style={{ 
                  padding: '16px', 
                  borderBottom: i < supervisees.length - 1 ? '1px solid var(--border-primary)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{sup.name}</strong>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {sup.type} · {sup.clientCount} Active Clients
                      </div>
                    </div>
                    <span className="mc-badge mc-badge-warning" style={{ fontSize: 10 }}>
                      {sup.pendingNotes} Pending Notes
                    </span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 5 }}>
                      <span>Licensure Hours: <strong>{sup.hoursLogged}</strong> / {sup.hoursRequired} hrs</span>
                      <span><strong>{progressPct}%</strong> Completed</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: 'var(--border-primary)' }}>
                      <div style={{ width: `${progressPct}%`, background: 'var(--color-primary, #2563eb)', height: '100%', borderRadius: 4 }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Co-Signatures List */}
        <div className="mc-card" style={{ borderTop: '4px solid var(--color-warning)' }}>
          <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Pending Co-Signatures</h3>
            <span className="mc-badge mc-badge-warning" style={{ fontSize: 11 }}>
              {pendingCoSignatures.length} Awaiting Review
            </span>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {pendingCoSignatures.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', display: 'block', margin: '0 auto 8px' }} />
                All supervisee notes have been co-signed!
              </div>
            ) : (
              pendingCoSignatures.map((note, i) => (
                <div key={note.id} style={{ 
                  padding: '14px 16px', 
                  borderBottom: i < pendingCoSignatures.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{note.client}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Written by: <strong style={{ color: 'var(--text-primary)' }}>{note.supervisee}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                      {note.type} · {note.date}
                    </div>
                  </div>
                  <button 
                    className="mc-btn mc-btn-primary mc-btn-sm" 
                    onClick={() => handleOpenReviewModal(note)}
                    style={{ whiteSpace: 'nowrap', fontSize: 11, padding: '6px 12px' }}
                  >
                    Review & Sign
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Crisis Supervision Log */}
      <div className="mc-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--color-danger, #ef4444)' }}>
        <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="mc-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', margin: 0, fontSize: 16 }}>
            <AlertTriangle size={18} /> Crisis Escalation Alerts (Supervisee Caseloads)
          </h3>
        </div>
        <div className="mc-card-content" style={{ padding: 0 }}>
          {crisisConsults.map((consult) => (
            <div key={consult.id} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>Client: {consult.client}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Supervised Clinician: {consult.supervisee} · Flagged on {consult.date}</div>
                </div>
                <span className="mc-badge mc-badge-critical" style={{ fontSize: 10, fontWeight: 800 }}>
                  {consult.severity} RISK
                </span>
              </div>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8 }}>
                {consult.details}
              </p>
              {consult.consultationNotes && (
                <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: 12, color: '#065f46', borderLeft: '3px solid #10b981' }}>
                  <strong>Supervisor Consultation Notes:</strong> {consult.consultationNotes}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  className="mc-btn mc-btn-outline mc-btn-sm" 
                  onClick={() => handleOpenCrisisModal(consult)}
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  Document Supervision Consultation
                </button>
                <button 
                  className="mc-btn mc-btn-ghost mc-btn-sm"
                  onClick={() => navigate('/crisis-assessments')}
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  View Crisis Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hour tracker progress chart */}
      <div className="mc-card">
        <div className="mc-card-header">
          <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            Accumulated Supervision Hours (Weekly Trends)
          </h3>
        </div>
        <div className="mc-card-content" style={{ height: 240, paddingTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklySupervisionHours} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="var(--color-primary, #2563eb)" fill="rgba(37,99,235,0.15)" name="Supervision Hours Logged" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── MODAL: Review & Co-Sign Note ── */}
      {selectedNote && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', padding: 28, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border-primary)', paddingBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Clinical Note Review & Co-Signature
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {selectedNote.type} · Supervisee: <strong style={{ color: 'var(--text-primary)' }}>{selectedNote.supervisee}</strong>
                </div>
              </div>
              <button onClick={() => setSelectedNote(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyCoSignature} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><strong>Client:</strong> {selectedNote.client}</div>
                <div><strong>Session Date:</strong> {selectedNote.date}</div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  Supervisee Documentation Content
                </label>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line', borderLeft: '3px solid var(--color-primary)' }}>
                  {selectedNote.content}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Supervisor Clinical Comments & Compliance Attestation <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={supervisorFeedback}
                  onChange={e => setSupervisorFeedback(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ background: 'rgba(16,185,129,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: '#065f46' }}>
                  By clicking Co-Sign, you electronically affix your clinical supervision endorsement in accordance with state licensing board requirements.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setSelectedNote(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PenTool size={14} /> Sign & Co-Sign Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Document Crisis Supervision Consultation ── */}
      {selectedCrisis && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', padding: 28, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border-primary)', paddingBottom: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Document Crisis Consultation
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Client: <strong style={{ color: 'var(--text-primary)' }}>{selectedCrisis.client}</strong> · Supervisee: {selectedCrisis.supervisee}
                </div>
              </div>
              <button onClick={() => setSelectedCrisis(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCrisisConsult} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                <strong style={{ color: '#ef4444' }}>Flagged Escalation:</strong>
                <div style={{ color: 'var(--text-primary)', marginTop: 4 }}>{selectedCrisis.details}</div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Supervision Clinical Directives & Recommendations <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  value={consultNotesInput}
                  onChange={e => setConsultNotesInput(e.target.value)}
                  required
                  placeholder="Enter specific risk mitigation directions, emergency consultation requirements, and follow-up frequency..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setSelectedCrisis(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary">
                  Save Consultation Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorDashboard;
