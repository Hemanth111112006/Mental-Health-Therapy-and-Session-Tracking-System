import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

const IconUsers = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconCalendar = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const IconClipboard = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
);
const IconMail = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const IconActivity = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const IconShield = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconAlertTriangle = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);
const IconNote = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
);
const IconPlus = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconCheckCircle = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const IconClock = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconVideo = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
);
const IconTrendingUp = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
);

// ─── Shared Components ───────────────────────────────────────────────────────

const SectionCard = ({ title, icon: Icon, children, badge }) => (
  <div className="mc-card" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', background: 'var(--bg-card)', border: '1px solid var(--border-primary)', overflow: 'hidden', marginBottom: 24 }}>
    <div className="mc-card-header" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(30,58,138,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color="var(--color-primary, #1e3a8a)" />
      </div>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      {badge && <span style={{ marginLeft: 'auto', padding: '2px 8px', borderRadius: 12, background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 700 }}>{badge.text}</span>}
    </div>
    <div className="mc-card-content" style={{ padding: 0 }}>
      {children}
    </div>
  </div>
);

const Badge = ({ text, type = 'default' }) => {
  const colors = {
    default: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
    active: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    warning: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    critical: { bg: 'rgba(220,38,38,0.1)', color: '#dc2626' },
    primary: { bg: 'rgba(30,58,138,0.1)', color: '#1e3a8a' },
  };
  const c = colors[type] || colors.default;
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>
      {text}
    </span>
  );
};

const Th = ({ children }) => (
  <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-primary)', whiteSpace: 'nowrap' }}>
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-primary)', fontSize: 13, color: 'var(--text-primary)' }}>
    {children}
  </td>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const TherapistDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const doctorName = currentUser?.name || currentUser?.title || 'Dr. Therapist';
  const role = currentUser?.role === 'Therapist' ? 'Licensed Clinical Social Worker (LCSW)' : 'Clinical Provider';
  const license = currentUser?.licenseNumber || 'LCSW-2022-99187';
  const avatarInitials = currentUser?.avatar || 'TH';

  return (
    <div className="mc-page-container" style={{ padding: '28px 32px', minHeight: '100vh', background: 'var(--bg-main, #f8fafc)' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>My Clinical Workspace</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 15 }}>
            Manage assigned clients, clinical documentation, appointments and treatment activities.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-card)', padding: '12px 20px', borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1px solid var(--border-primary)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, boxShadow: '0 2px 8px rgba(30,58,138,0.3)' }}>
            {avatarInitials}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{doctorName}</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>{role}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>Lic: {license}</p>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        {[
          { label: 'My Clients', value: 24, subtext: 'Assigned active cases', icon: IconUsers, color: '#1e3a8a' },
          { label: "Today's Sessions", value: 6, subtext: '2 completed, 4 upcoming', icon: IconCalendar, color: '#059669' },
          { label: 'Pending Notes', value: 3, subtext: 'Documentation reminders', icon: IconClipboard, color: '#d97706', warning: true },
          { label: 'Active Plans', value: 21, subtext: 'Treatment plans active', icon: IconActivity, color: '#6366f1' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: kpi.warning ? '1.5px solid rgba(217,119,6,0.3)' : '1px solid var(--border-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{kpi.label}</p>
                <p style={{ margin: '8px 0 4px', fontSize: 32, fontWeight: 800, color: kpi.warning ? '#d97706' : 'var(--text-primary)', lineHeight: 1 }}>{kpi.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>{kpi.subtext}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={22} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Crisis Alerts', value: 1, subtext: 'Pending risk assessment', icon: IconAlertTriangle, color: '#dc2626', critical: true },
          { label: 'Outcome Measures', value: 4, subtext: 'Due assessments', icon: IconTrendingUp, color: '#d97706' },
          { label: 'Safety Plans', value: 3, subtext: 'Active monitoring', icon: IconShield, color: '#059669' },
          { label: 'Secure Messages', value: 5, subtext: 'Unread client/team messages', icon: IconMail, color: '#6366f1' },
        ].map(kpi => (
          <div key={kpi.label} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '20px', border: kpi.critical ? '1.5px solid rgba(220,38,38,0.3)' : '1px solid var(--border-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{kpi.label}</p>
                <p style={{ margin: '8px 0 4px', fontSize: 32, fontWeight: 800, color: kpi.critical ? '#dc2626' : 'var(--text-primary)', lineHeight: 1 }}>{kpi.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>{kpi.subtext}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={22} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* ── Today's Schedule ── */}
        <SectionCard title="Today's Schedule" icon={IconCalendar} badge={{ text: '6 Sessions', bg: 'rgba(30,58,138,0.1)', color: '#1e3a8a' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Th>Time & Duration</Th>
                <Th>Client Name</Th>
                <Th>Session Type</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '09:00 AM', dur: '50m', name: 'Emma Johnson', type: 'Individual Therapy', status: 'Completed', tele: false },
                { time: '11:00 AM', dur: '50m', name: 'Sofia Garcia', type: 'Telehealth', status: 'In Progress', tele: true },
                { time: '01:30 PM', dur: '50m', name: 'David Chen', type: 'Individual Therapy', status: 'Upcoming', tele: false },
              ].map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)', opacity: s.status === 'Completed' ? 0.6 : 1 }}>
                  <Td><span style={{ fontWeight: 700 }}>{s.time}</span> <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>({s.dur})</span></Td>
                  <Td><span style={{ fontWeight: 600 }}>{s.name}</span></Td>
                  <Td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: s.tele ? '#6366f1' : '#1e3a8a', background: s.tele ? 'rgba(99,102,241,0.1)' : 'rgba(30,58,138,0.1)', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                      {s.tele && <IconVideo size={11} />} {s.type}
                    </span>
                  </Td>
                  <Td><Badge text={s.status} type={s.status === 'Completed' ? 'active' : s.status === 'In Progress' ? 'primary' : 'default'} /></Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => navigate('/clients/MC-2041')} style={{ fontSize: 11, padding: '4px 8px' }}>Open Client</button>
                      {s.status === 'Upcoming' && <button className="mc-btn mc-btn-primary mc-btn-sm" style={{ fontSize: 11, padding: '4px 8px' }}>Start Session</button>}
                      {s.status !== 'Upcoming' && <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => navigate('/session-notes/new')} style={{ fontSize: 11, padding: '4px 8px' }}>Create Note</button>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* ── Quick Action Panel ── */}
        <SectionCard title="Quick Actions" icon={IconPlus}>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Create Session Note', icon: IconNote, path: '/session-notes/new', primary: true },
              { label: 'Schedule Appointment', icon: IconCalendar, path: '/appointments/new' },
              { label: 'Create Treatment Plan', icon: IconActivity, path: '/treatment-plans/new' },
              { label: 'Create Crisis Assessment', icon: IconAlertTriangle, path: '/crisis-assessments/new', urgent: true },
              { label: 'Create Safety Plan', icon: IconShield, path: '/safety-plans/new' },
              { label: 'Send Secure Message', icon: IconMail, path: '/messaging/new' },
            ].map((action, i) => (
              <button
                key={i} onClick={() => navigate(action.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', borderRadius: 10,
                  border: action.primary ? 'none' : action.urgent ? '1px solid rgba(220,38,38,0.3)' : '1px solid var(--border-primary)',
                  background: action.primary ? 'linear-gradient(135deg, #1e3a8a, #2563eb)' : action.urgent ? 'rgba(220,38,38,0.05)' : 'transparent',
                  color: action.primary ? '#fff' : action.urgent ? '#dc2626' : 'var(--text-primary)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                }}
              >
                <action.icon size={16} color={action.primary ? '#fff' : action.urgent ? '#dc2626' : 'var(--color-primary, #1e3a8a)'} />
                {action.label}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── My Clients Section ── */}
      <SectionCard title="My Clients" icon={IconUsers} badge={{ text: 'Assigned Cases', bg: 'rgba(30,58,138,0.1)', color: '#1e3a8a' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
              <Th>Client ID</Th>
              <Th>Client Name</Th>
              <Th>Age</Th>
              <Th>Next Appointment</Th>
              <Th>Treatment Status</Th>
              <Th>Risk Level</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'MC-2041', name: 'Emma Johnson', age: 34, appt: 'Jul 17, 2026', status: 'Active', risk: 'Low' },
              { id: 'MC-1887', name: 'Marcus Williams', age: 28, appt: 'Jul 14, 2026', status: 'Active', risk: 'High' },
              { id: 'MC-2156', name: 'Sofia Garcia', age: 42, appt: 'Jul 18, 2026', status: 'Maintenance', risk: 'Low' },
            ].map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <Td><span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{c.id}</span></Td>
                <Td><span style={{ fontWeight: 600 }}>{c.name}</span></Td>
                <Td>{c.age}</Td>
                <Td>{c.appt}</Td>
                <Td><Badge text={c.status} type={c.status === 'Active' ? 'active' : 'primary'} /></Td>
                <Td><Badge text={c.risk} type={c.risk === 'High' ? 'critical' : 'active'} /></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => navigate(`/clients/${c.id}`)} style={{ fontSize: 11, padding: '4px 8px' }}>View Profile</button>
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => navigate('/session-notes')} style={{ fontSize: 11, padding: '4px 8px' }}>Open Notes</button>
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => navigate('/treatment-plans')} style={{ fontSize: 11, padding: '4px 8px' }}>Treatment Plan</button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* ── Session Notes ── */}
        <SectionCard title="Recent Session Notes" icon={IconClipboard} badge={{ text: 'Drafts & Completed', bg: 'rgba(245,158,11,0.1)', color: '#d97706' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Th>Client & Appt</Th>
                <Th>Format</Th>
                <Th>Clinical Details</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {[
                { client: 'Emma Johnson', date: 'Jul 10', format: 'SOAP', diag: 'F33.1', cpt: '90837 (60m)', status: 'Signed', auto: false },
                { client: 'Marcus Williams', date: 'Jul 12', format: 'DAP', diag: 'F41.1', cpt: '90834 (45m)', status: 'Draft', auto: true },
              ].map((n, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <Td><span style={{ fontWeight: 600 }}>{n.client}</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{n.date}</span></Td>
                  <Td><Badge text={n.format} type="primary" /></Td>
                  <Td><span style={{ fontSize: 11, fontFamily: 'monospace' }}>Dx: {n.diag} | CPT: {n.cpt}</span></Td>
                  <Td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                      <Badge text={n.status} type={n.status === 'Signed' ? 'active' : 'warning'} />
                      {n.auto && <span style={{ fontSize: 10, color: '#d97706' }}>Auto-saved 2m ago</span>}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>

        {/* ── Crisis Assessments ── */}
        <SectionCard title="Crisis Assessments" icon={IconAlertTriangle} badge={{ text: 'Requires Attention', bg: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Th>Client & Date</Th>
                <Th>Risk Level</Th>
                <Th>Workflow & Actions</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td><span style={{ fontWeight: 600 }}>Marcus Williams</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Jul 12, 2026</span></Td>
                <Td><Badge text="HIGH RISK" type="critical" /></Td>
                <Td>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    Supervisor: <span style={{ color: '#d97706', fontWeight: 600 }}>Notified</span> | Hosp: <span style={{ color: '#059669', fontWeight: 600 }}>Avoided</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}>View Assessment</button>
                    <button className="mc-btn mc-btn-primary mc-btn-sm" style={{ fontSize: 10, padding: '2px 6px' }}>Safety Plan</button>
                  </div>
                </Td>
              </tr>
            </tbody>
          </table>
        </SectionCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* ── Treatment Plans ── */}
        <SectionCard title="Treatment Plans" icon={IconActivity}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Th>Client & Formulation</Th>
                <Th>Goals & Interventions</Th>
                <Th>Review & Status</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td><span style={{ fontWeight: 600 }}>Emma Johnson</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Dx: F33.1 (MDD)</span></Td>
                <Td><span style={{ fontSize: 12 }}>3 Active Goals<br/>CBT, Behavioral Activation</span></Td>
                <Td><span style={{ fontSize: 12 }}>Jul 24, 2026</span><br/><Badge text="Active" type="active" /></Td>
              </tr>
              <tr>
                <Td><span style={{ fontWeight: 600 }}>Sofia Garcia</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Dx: F43.1 (PTSD)</span></Td>
                <Td><span style={{ fontSize: 12 }}>4 Active Goals<br/>EMDR, Trauma-focused</span></Td>
                <Td><span style={{ fontSize: 12, color: '#d97706', fontWeight: 600 }}>Due Today</span><br/><Badge text="Review Due" type="warning" /></Td>
              </tr>
            </tbody>
          </table>
        </SectionCard>

        {/* ── Outcome Measures ── */}
        <SectionCard title="Outcome Measures" icon={IconTrendingUp}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Th>Measure</Th>
                <Th>Score & Interpretation</Th>
                <Th>Trend</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td><span style={{ fontWeight: 600 }}>PHQ-9</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Emma Johnson</span></Td>
                <Td><span style={{ fontWeight: 700, fontSize: 14 }}>14/27</span> <Badge text="Moderate" type="warning" /></Td>
                <Td><span style={{ color: '#059669', fontSize: 12, fontWeight: 600 }}>↓ 2 pts (Improving)</span></Td>
              </tr>
              <tr>
                <Td><span style={{ fontWeight: 600 }}>GAD-7</span><br/><span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Marcus Williams</span></Td>
                <Td><span style={{ fontWeight: 700, fontSize: 14 }}>16/21</span> <Badge text="Severe" type="critical" /></Td>
                <Td><span style={{ color: '#dc2626', fontSize: 12, fontWeight: 600 }}>↑ 4 pts (Worsening)</span></Td>
              </tr>
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* ── Secure Messaging ── */}
      <SectionCard title="Secure Messaging" icon={IconMail} badge={{ text: '2 Unread Urgent', bg: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
              <Th>Sender</Th>
              <Th>Type</Th>
              <Th>Message Preview</Th>
              <Th>Received</Th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(220,38,38,0.03)' }}>
              <Td><span style={{ fontWeight: 700 }}>Marcus Williams</span></Td>
              <Td><Badge text="Urgent Client" type="critical" /></Td>
              <Td><span style={{ fontSize: 13, fontWeight: 600 }}>"I'm feeling really overwhelmed right now..."</span></Td>
              <Td><span style={{ fontSize: 12, fontWeight: 600, color: '#dc2626' }}>10 mins ago</span></Td>
            </tr>
            <tr>
              <Td><span style={{ fontWeight: 600 }}>Dr. James Liu</span></Td>
              <Td><Badge text="Clinical Team" type="primary" /></Td>
              <Td><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>"Consultation notes for Sofia Garcia are ready for review."</span></Td>
              <Td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>2 hours ago</span></Td>
            </tr>
            <tr>
              <Td><span style={{ fontWeight: 600 }}>Emma Johnson</span></Td>
              <Td><Badge text="Client" type="default" /></Td>
              <Td><span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>"Can we reschedule next week's session?"</span></Td>
              <Td><span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Yesterday</span></Td>
            </tr>
          </tbody>
        </table>
      </SectionCard>

    </div>
  );
};

export default TherapistDashboard;
