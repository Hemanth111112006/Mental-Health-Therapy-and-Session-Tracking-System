import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersRound, Calendar, Award, CheckCircle, Clock,
  FileText, Plus, BookOpen, Send, Check, ShieldCheck, ChevronRight
} from 'lucide-react';
import { toast } from '../../../utils/toast';

const SuperviseesPage = () => {
  const navigate = useNavigate();

  const [supervisees, setSupervisees] = useState([
    {
      id: 4,
      name: 'Michael Thompson, ACSW',
      title: 'Associate Clinical Social Worker',
      registrationNumber: 'ACSW-10892',
      targetLicense: 'Licensed Clinical Social Worker (LCSW)',
      email: 'michael.thompson@mindcare.com',
      phone: '(555) 345-6789',
      hoursLogged: 780,
      hoursRequired: 3000,
      directHours: 520,
      individualSupervisionHours: 120,
      groupSupervisionHours: 140,
      activeClients: 18,
      pendingNotes: 3,
      lastSupervisionDate: '2026-07-08',
      nextSupervisionDate: '2026-07-15'
    },
    {
      id: 11,
      name: 'Jessica Vance, AMFT',
      title: 'Associate Marriage & Family Therapist',
      registrationNumber: 'AMFT-20941',
      targetLicense: 'Licensed Marriage & Family Therapist (LMFT)',
      email: 'jessica.vance@mindcare.com',
      phone: '(555) 456-7890',
      hoursLogged: 1240,
      hoursRequired: 3000,
      directHours: 890,
      individualSupervisionHours: 170,
      groupSupervisionHours: 180,
      activeClients: 12,
      pendingNotes: 4,
      lastSupervisionDate: '2026-07-09',
      nextSupervisionDate: '2026-07-16'
    }
  ]);

  // Modal states
  const [logHoursModalSupervisee, setLogHoursModalSupervisee] = useState(null);
  const [hoursToAdd, setHoursToAdd] = useState('1.5');
  const [supervisionType, setSupervisionType] = useState('Individual (1-on-1)');
  const [sessionNotes, setSessionNotes] = useState('');

  const [scheduleModalSupervisee, setScheduleModalSupervisee] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('2026-07-22');
  const [scheduleTime, setScheduleTime] = useState('10:00 AM');
  const [scheduleAgenda, setScheduleAgenda] = useState('Review complex trauma cases and GAD-7 treatment plan progression.');

  const handleSaveHours = (e) => {
    e.preventDefault();
    if (!logHoursModalSupervisee) return;
    const added = parseFloat(hoursToAdd) || 0;

    setSupervisees(prev => prev.map(s => {
      if (s.id === logHoursModalSupervisee.id) {
        return {
          ...s,
          hoursLogged: s.hoursLogged + added,
          individualSupervisionHours: supervisionType.includes('Individual') 
            ? s.individualSupervisionHours + added 
            : s.individualSupervisionHours,
          groupSupervisionHours: supervisionType.includes('Group') 
            ? s.groupSupervisionHours + added 
            : s.groupSupervisionHours,
          lastSupervisionDate: new Date().toISOString().split('T')[0]
        };
      }
      return s;
    }));

    toast.success(`Logged ${added} hours of supervision for ${logHoursModalSupervisee.name}`);
    setLogHoursModalSupervisee(null);
    setSessionNotes('');
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleModalSupervisee) return;

    setSupervisees(prev => prev.map(s => {
      if (s.id === scheduleModalSupervisee.id) {
        return { ...s, nextSupervisionDate: scheduleDate };
      }
      return s;
    }));

    toast.success(`Supervision scheduled with ${scheduleModalSupervisee.name} for ${scheduleDate} at ${scheduleTime}`);
    setScheduleModalSupervisee(null);
  };

  const totalHoursLogged = supervisees.reduce((sum, s) => sum + s.hoursLogged, 0);
  const totalHoursReq = supervisees.reduce((sum, s) => sum + s.hoursRequired, 0);
  const totalCaseload = supervisees.reduce((sum, s) => sum + s.activeClients, 0);
  const totalPendingNotes = supervisees.reduce((sum, s) => sum + s.pendingNotes, 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Supervisor</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Supervisees</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UsersRound size={24} style={{ color: 'var(--color-primary, #2563eb)' }} /> Clinical Supervisees & Licensure Tracking
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor associate clinicians, audit documentation compliance, verify licensure hours, and conduct case reviews
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Supervisees Managed', value: supervisees.length, icon: <UsersRound size={20} />, color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
          { label: 'Supervised Clients', value: `${totalCaseload} Active`, icon: <BookOpen size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Licensure Progress', value: `${totalHoursLogged} / ${totalHoursReq} hrs`, icon: <Award size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Notes Pending Co-Sign', value: totalPendingNotes, icon: <FileText size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((c, i) => (
          <div key={i} className="mc-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Supervisee Profile Cards */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {supervisees.map(sup => {
          const progressPct = ((sup.hoursLogged / sup.hoursRequired) * 100).toFixed(1);
          return (
            <div 
              key={sup.id} 
              className="mc-card" 
              style={{ padding: '24px', borderRadius: '14px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(37,99,235,0.12)', color: 'var(--color-primary, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800 }}>
                    {sup.name.split(' ')[0][0]}{sup.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{sup.name}</h2>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {sup.title} · <strong style={{ color: 'var(--text-primary)' }}>{sup.registrationNumber}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                      Target: {sup.targetLicense}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="mc-btn mc-btn-outline" 
                    onClick={() => setLogHoursModalSupervisee(sup)}
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <Plus size={13} /> Log Supervision Hours
                  </button>
                  <button 
                    className="mc-btn mc-btn-outline" 
                    onClick={() => setScheduleModalSupervisee(sup)}
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <Calendar size={13} /> Schedule 1-on-1
                  </button>
                  <button 
                    className="mc-btn mc-btn-primary" 
                    onClick={() => navigate('/approvals')}
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <FileText size={13} /> Review Notes ({sup.pendingNotes})
                  </button>
                </div>
              </div>

              {/* Licensure Hours Breakdown */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <span>Total Licensure Hours: {sup.hoursLogged} of {sup.hoursRequired} hrs</span>
                  <span style={{ color: 'var(--color-primary, #2563eb)' }}>{progressPct}% Completed</span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: 'var(--border-primary)', overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${progressPct}%`, background: 'var(--color-primary, #2563eb)', height: '100%', borderRadius: 5 }}></div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>Direct Clinical Client Hours: <strong style={{ color: 'var(--text-primary)' }}>{sup.directHours} hrs</strong></div>
                  <div>Individual Supervision: <strong style={{ color: 'var(--text-primary)' }}>{sup.individualSupervisionHours} hrs</strong></div>
                  <div>Group Supervision: <strong style={{ color: 'var(--text-primary)' }}>{sup.groupSupervisionHours} hrs</strong></div>
                  <div>Active Client Caseload: <strong style={{ color: 'var(--text-primary)' }}>{sup.activeClients} patients</strong></div>
                </div>
              </div>

              {/* Supervision Dates and Contact */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div>Last Supervision Session: <strong style={{ color: 'var(--text-primary)' }}>{sup.lastSupervisionDate}</strong></div>
                <div>Next Scheduled Supervision: <strong style={{ color: '#2563eb' }}>{sup.nextSupervisionDate}</strong></div>
                <div>Email: {sup.email} · Phone: {sup.phone}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: Log Supervision Hours ── */}
      {logHoursModalSupervisee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 520, padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Log Clinical Supervision Hours
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Supervisee: <strong style={{ color: 'var(--text-primary)' }}>{logHoursModalSupervisee.name}</strong>
                </div>
              </div>
              <button onClick={() => setLogHoursModalSupervisee(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHours} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Supervision Type
                  </label>
                  <select 
                    value={supervisionType}
                    onChange={e => setSupervisionType(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Individual (1-on-1)">Individual (1-on-1)</option>
                    <option value="Group Supervision">Group Supervision</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Hours to Log
                  </label>
                  <select 
                    value={hoursToAdd}
                    onChange={e => setHoursToAdd(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="1.0">1.0 Hour</option>
                    <option value="1.5">1.5 Hours</option>
                    <option value="2.0">2.0 Hours</option>
                    <option value="3.0">3.0 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                  Case Discussion & Educational Topics
                </label>
                <textarea 
                  rows={3}
                  value={sessionNotes}
                  onChange={e => setSessionNotes(e.target.value)}
                  placeholder="Caseload audit, countertransference discussion, crisis mitigation..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setLogHoursModalSupervisee(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary">
                  Log Hours to Board Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Schedule Supervision ── */}
      {scheduleModalSupervisee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 500, padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Schedule Supervision Session
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  With: <strong style={{ color: 'var(--text-primary)' }}>{scheduleModalSupervisee.name}</strong>
                </div>
              </div>
              <button onClick={() => setScheduleModalSupervisee(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Date
                  </label>
                  <input 
                    type="date"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Time Slot
                  </label>
                  <input 
                    type="text"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                  Supervision Agenda / Discussion Focus
                </label>
                <textarea 
                  rows={3}
                  value={scheduleAgenda}
                  onChange={e => setScheduleAgenda(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setScheduleModalSupervisee(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary">
                  Confirm Supervision Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperviseesPage;
