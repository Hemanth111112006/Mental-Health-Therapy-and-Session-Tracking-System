import { appointmentApi } from '../../../api/appointmentApi';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────

const CalendarIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MessageIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ClipboardIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const HeartIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ShieldIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ChartIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

const CreditCardIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const UserIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ClockIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const MapPinIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckCircleIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ArrowRightIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const PhoneIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l1.06-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const TargetIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

// ─── Sub-Components ───────────────────────────────────────────────────────────

const KpiCard = ({ icon, label, value, accent, sublabel }) => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-primary)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'default',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.12)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
    }}
  >
    {/* Accent glow */}
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: '80px', height: '80px',
      background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
      borderRadius: '0 16px 0 80px',
    }} />
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: `${accent}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid ${accent}30`,
    }}>
      {React.cloneElement(icon, { color: accent, size: 22 })}
    </div>
    <div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500' }}>{label}</div>
      {sublabel && <div style={{ fontSize: '11px', color: accent, marginTop: '2px', fontWeight: '600' }}>{sublabel}</div>}
    </div>
  </div>
);

const SectionCard = ({ title, icon, accent = 'var(--color-primary)', children, style = {} }) => (
  <div className="mc-card" style={{
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    transition: 'box-shadow 0.2s ease',
    backdropFilter: 'blur(12px)',
    ...style,
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'}
  >
    <div className="mc-card-header" style={{
      borderBottom: '1px solid var(--border-primary)',
      background: `linear-gradient(135deg, ${accent}08 0%, transparent 60%)`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: `${accent}18`, border: `1px solid ${accent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {React.cloneElement(icon, { color: accent, size: 16 })}
        </div>
        <h3 className="mc-card-title">{title}</h3>
      </div>
    </div>
    <div className="mc-card-content">{children}</div>
  </div>
);

const ProgressBar = ({ percent, color = 'var(--color-primary)', height = 8 }) => (
  <div style={{ background: 'var(--border-primary)', borderRadius: '99px', height, overflow: 'hidden' }}>
    <div style={{
      width: `${percent}%`, height: '100%',
      background: `linear-gradient(90deg, ${color}, ${color}cc)`,
      borderRadius: '99px',
      transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
    }} />
  </div>
);

const InfoRow = ({ label, value, valueColor }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: '13px', fontWeight: '600', color: valueColor || 'var(--text-primary)' }}>{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const clientDisplayName = (currentUser?.firstName && currentUser.firstName.toLowerCase() !== 'client')
    ? currentUser.firstName
    : (currentUser?.lastName || 'Alex');

  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);

  useEffect(() => {
    const fetchDashboardAppts = async () => {
      try {
        const data = await appointmentApi.getAllAppointments();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Appointments fetch notice:', err);
      } finally {
        setLoadingAppts(false);
      }
    };
    fetchDashboardAppts();
  }, []);

  const upcomingList = appointments.filter(a => a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
  upcomingList.sort((a, b) => new Date(a.date || a.startTime) - new Date(b.date || b.startTime));
  const nextAppt = upcomingList[0];

  const apptDateObj = nextAppt ? new Date(nextAppt.date || nextAppt.startTime) : null;
  const daysDiff = apptDateObj 
    ? Math.max(0, Math.ceil((apptDateObj - new Date()) / (1000 * 60 * 60 * 24)))
    : 5;

  const apptDateFormatted = apptDateObj 
    ? apptDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Thursday, July 17, 2026';

  const apptTimeFormatted = nextAppt?.startTime && String(nextAppt.startTime).includes('T')
    ? `${new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${nextAppt.endTime ? new Date(nextAppt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}`
    : (nextAppt?.startTime ? `${nextAppt.startTime} – ${nextAppt.endTime || ''}` : '10:00 AM – 10:50 AM');

  const therapistName = nextAppt?.therapist 
    ? (`Dr. ${nextAppt.therapist.firstName || ''} ${nextAppt.therapist.lastName || ''}`.trim() || nextAppt.therapist.username)
    : 'Dr. Sarah Chen, LCSW';

  const modalityText = nextAppt?.modality === 'TELEHEALTH' 
    ? 'Telehealth · Video Session' 
    : 'In-Person · Room 204';

  const apptTypeText = nextAppt?.appointmentType ? nextAppt.appointmentType.replace(/_/g, ' ') : 'Individual Therapy Session';

  const [activeQuickAction, setActiveQuickAction] = useState(null);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const styles = {
    pageContainer: {
      padding: '0',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: '16px',
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '24px',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    tripleGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    quickActionsGrid: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
  };

  // ── KPI Data ────────────────────────────────────────────────────────────────
  const kpiCards = [
    {
      icon: <CalendarIcon />, label: 'Upcoming Appointments', value: String(upcomingList.length || 2),
      accent: '#6366f1', sublabel: apptDateObj ? `Next: ${apptDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Next: Jul 17',
      onClick: () => navigate('/client/appointments'),
    },
    {
      icon: <MessageIcon />, label: 'New Messages', value: '3',
      accent: '#3b82f6', sublabel: '3 unread',
      onClick: () => navigate('/messaging'),
    },
    {
      icon: <ClipboardIcon />, label: 'Assessments Due', value: '1',
      accent: '#f59e0b', sublabel: 'PHQ-9 overdue',
      onClick: () => navigate('/outcome-measures'),
    },
    {
      icon: <HeartIcon />, label: 'Active Treatment Plan', value: 'Yes',
      accent: '#22c55e', sublabel: '65% complete',
      onClick: () => navigate('/treatment-plans'),
    },
  ];

  // ── Messages ────────────────────────────────────────────────────────────────
  const messages = [
    {
      sender: 'Dr. Sarah Chen',
      initials: 'SC',
      text: 'See you Thursday! Please complete your PHQ-9 before the session.',
      time: '2h ago',
      unread: true,
    },
    {
      sender: 'Dr. Sarah Chen',
      initials: 'SC',
      text: 'Your treatment plan has been updated for review.',
      time: 'Yesterday',
      unread: false,
    },
    {
      sender: 'Reception',
      initials: 'RX',
      text: 'Your appointment on Jul 17 is confirmed. See you then!',
      time: '2 days ago',
      unread: false,
    },
  ];

  // ── Outcome Measures trend data ─────────────────────────────────────────────
  const phq9Trend = [18, 16, 15, 14, 12];
  const gad7Trend = [14, 12, 11, 10, 9];

  const TrendBars = ({ data, color }) => {
    const max = Math.max(...data) + 2;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px' }}>
        {data.map((val, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: '3px 3px 0 0',
            height: `${(val / max) * 100}%`,
            background: i === data.length - 1
              ? color
              : `${color}60`,
            transition: 'height 0.5s ease',
            minHeight: '4px',
          }} />
        ))}
      </div>
    );
  };

  // ── Quick Action Button ────────────────────────────────────────────────────
  const QuickAction = ({ label, icon, primary, onClick, accent }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
          fontWeight: '600', fontSize: '14px', transition: 'all 0.2s ease',
          border: primary ? 'none' : '1.5px solid var(--border-primary)',
          background: primary
            ? (hovered ? `${accent || 'var(--btn-primary-bg)'}dd` : (accent || 'var(--btn-primary-bg)'))
            : (hovered ? 'var(--border-primary)' : 'var(--bg-card)'),
          color: primary ? '#fff' : 'var(--text-primary)',
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered ? (primary ? `0 6px 20px ${accent || 'var(--color-primary)'}44` : '0 4px 12px rgba(0,0,0,0.08)') : 'none',
        }}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <div className="mc-page-container" style={styles.pageContainer}>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mc-page-header" style={styles.header}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: '28px', marginBottom: '6px' }}>
            My Care Portal
          </h1>
          <p className="mc-page-subtitle" style={{ fontSize: '15px' }}>
            Welcome back, <strong style={{ color: 'var(--color-primary)' }}>{clientDisplayName}</strong>! Here is a summary of your care journey.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mc-badge mc-badge-active" style={{ fontSize: '12px', padding: '6px 14px' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', marginRight: 6 }} />
            Portal Active
          </span>
          <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => navigate('/messaging')}>
            <MessageIcon size={14} color="#fff" />
            &nbsp; Messages
            <span style={{
              marginLeft: '6px', background: 'rgba(255,255,255,0.3)',
              borderRadius: '99px', padding: '1px 7px', fontSize: '11px', fontWeight: '700',
            }}>3</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div style={styles.kpiGrid}>
        {kpiCards.map((card, i) => (
          <KpiCard key={i} {...card} />
        ))}
      </div>

      {/* ── Next Appointment (Full Width Prominent) ──────────────────────────── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          borderRadius: '20px',
          background: 'var(--bg-card)', border: '1px solid var(--border-primary)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-30px', right: '180px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '80px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CalendarIcon size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Next Appointment
              </span>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>
              {apptDateFormatted}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <ClockIcon color="var(--color-primary)" />
                {apptTimeFormatted}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <UserIcon size={16} color="var(--color-primary)" />
                {therapistName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <HeartIcon size={16} color="var(--color-primary)" />
                {apptTypeText}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                <MapPinIcon color="var(--color-primary)" />
                {modalityText}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/client/appointments')}
                style={{
                padding: '10px 22px', borderRadius: '10px', border: '1px solid var(--border-primary)',
                background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px',
                cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              >
                Reschedule
              </button>
              <button 
                onClick={() => navigate('/telehealth/1')}
                style={{
                padding: '10px 22px', borderRadius: '10px', border: 'none',
                background: 'var(--color-primary)', color: '#fff', fontWeight: '700', fontSize: '14px',
                cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
              >
                Join Telehealth
              </button>
            </div>
          </div>

          {/* Countdown badge */}
          <div style={{
            position: 'relative', zIndex: 1, textAlign: 'center',
            background: 'var(--bg-secondary)', backdropFilter: 'blur(12px)',
            borderRadius: '16px', border: '1px solid var(--border-primary)',
            padding: '24px 32px', minWidth: '140px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '40px', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{daysDiff}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '600' }}>
              {daysDiff === 1 ? 'day away' : daysDiff === 0 ? 'today' : 'days away'}
            </div>
          </div>
        </div>
      </div>



      {/* ── Row: Outcome Measures + Messages + Billing ─────────────────────────── */}
      <div style={styles.tripleGrid}>

        {/* Outcome Measures */}
        <SectionCard title="Outcome Measures" icon={<ChartIcon />} accent="#f59e0b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* PHQ-9 */}
            <div style={{ borderRadius: '12px', border: '1px solid #f59e0b25', overflow: 'hidden' }}>
              <div style={{
                padding: '12px 14px', background: '#f59e0b10',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #f59e0b20',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>PHQ-9</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Depression Scale</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', lineHeight: 1 }}>12<span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '400' }}>/27</span></div>
                  <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600' }}>Moderate</div>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trend (last 5 sessions)</div>
                <TrendBars data={phq9Trend} color="#f59e0b" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Mar</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Now</span>
                </div>
              </div>
              <div style={{ padding: '0 14px 12px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: '600', color: '#ef4444',
                  background: '#ef444410', borderRadius: '6px', padding: '3px 8px',
                }}>
                  <AlertTriangleIcon size={11} color="#ef4444" /> Due for reassessment
                </span>
              </div>
            </div>

            {/* GAD-7 */}
            <div style={{ borderRadius: '12px', border: '1px solid #6366f125', overflow: 'hidden' }}>
              <div style={{
                padding: '12px 14px', background: '#6366f108',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #6366f120',
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>GAD-7</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Anxiety Scale</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#6366f1', lineHeight: 1 }}>9<span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '400' }}>/21</span></div>
                  <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>Moderate</div>
                </div>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Trend (last 5 sessions)</div>
                <TrendBars data={gad7Trend} color="#6366f1" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Mar</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Now</span>
                </div>
              </div>
              <div style={{ padding: '0 14px 12px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: '600', color: '#22c55e',
                  background: '#22c55e10', borderRadius: '6px', padding: '3px 8px',
                }}>
                  <CheckCircleIcon size={11} color="#22c55e" /> Up to date
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/outcome-measures')}
              style={{
              width: '100%', padding: '10px', borderRadius: '10px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none', color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px',
              boxShadow: '0 4px 16px #f59e0b44', transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px #f59e0b55'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px #f59e0b44'; }}
            >
              Complete PHQ-9 Now
            </button>
          </div>
        </SectionCard>

        {/* Secure Messages */}
        <SectionCard title="Secure Messages" icon={<MessageIcon />} accent="#3b82f6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, i) => (
              <div key={i} 
                onClick={() => navigate('/messaging')}
                style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '12px 14px', borderRadius: '12px',
                background: msg.unread ? '#3b82f608' : 'transparent',
                border: msg.unread ? '1px solid #3b82f620' : '1px solid transparent',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#3b82f610'; e.currentTarget.style.borderColor = '#3b82f630'; }}
                onMouseLeave={e => { e.currentTarget.style.background = msg.unread ? '#3b82f608' : 'transparent'; e.currentTarget.style.borderColor = msg.unread ? '#3b82f620' : 'transparent'; }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                  background: msg.sender === 'Reception' ? '#6366f118' : '#3b82f618',
                  border: `2px solid ${msg.sender === 'Reception' ? '#6366f130' : '#3b82f630'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700',
                  color: msg.sender === 'Reception' ? '#6366f1' : '#3b82f6',
                }}>
                  {msg.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{msg.sender}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', flexShrink: 0 }}>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {msg.text}
                  </p>
                  {msg.unread && (
                    <span style={{
                      display: 'inline-block', width: '6px', height: '6px',
                      borderRadius: '50%', background: '#3b82f6',
                      marginTop: '6px',
                    }} />
                  )}
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: '12px' }}>
              <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/messaging')}>
                View All Messages <ArrowRightIcon size={14} />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Billing Summary */}
        <SectionCard title="Billing Summary" icon={<CreditCardIcon />} accent="#8b5cf6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Outstanding Balance Hero */}
            <div style={{
              borderRadius: '12px', padding: '18px',
              background: 'linear-gradient(135deg, #22c55e10 0%, #22c55e05 100%)',
              border: '1px solid #22c55e25', textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Outstanding Balance</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e', lineHeight: 1 }}>$0.00</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px', fontWeight: '600' }}>✓ Account in good standing</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: '8px', background: 'var(--border-primary)20',
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Last Invoice</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>$150.00 · Jun 30, 2026</div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '700', color: '#22c55e',
                  background: '#22c55e15', borderRadius: '6px', padding: '3px 8px',
                }}>PAID</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <InfoRow label="Insurance" value="Blue Cross Blue Shield" />
              <InfoRow label="Coverage Status" value="Active" valueColor="#22c55e" />
              <div style={{ height: '1px', background: 'var(--border-primary)', margin: '4px 0' }} />
              <InfoRow label="Copay per Session" value="$30.00" />
            </div>

            <div style={{ borderRadius: '10px', background: '#8b5cf610', border: '1px solid #8b5cf620', padding: '12px 14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#8b5cf6', marginBottom: '2px' }}>Insurance Verified</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Next verification: Sep 1, 2026</div>
            </div>

            <button 
              onClick={() => navigate('/billing')}
              className="mc-btn mc-btn-outline mc-btn-sm" 
              style={{ width: '100%', justifyContent: 'center' }}
            >
              View Billing History <ArrowRightIcon size={14} />
            </button>
          </div>
        </SectionCard>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────────── */}
      <div className="mc-card" style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div className="mc-card-header">
          <h3 className="mc-card-title">Quick Actions</h3>
        </div>
        <div className="mc-card-content">
          <div style={styles.quickActionsGrid}>
            <QuickAction
              primary
              label="Book Appointment"
              icon={<CalendarIcon size={16} color="#fff" />}
              accent="var(--btn-primary-bg)"
              onClick={() => navigate('/client/appointments?action=request')}
            />

            <QuickAction
              label="Complete Assessment"
              icon={<ClipboardIcon size={16} color="#f59e0b" />}
              accent="#f59e0b"
              onClick={() => navigate('/outcome-measures')}
            />
            <QuickAction
              label="Send Message"
              icon={<MessageIcon size={16} color="var(--text-primary)" />}
              onClick={() => navigate('/messaging')}
            />
            <QuickAction
              label="Update Profile"
              icon={<UserIcon size={16} color="var(--text-primary)" />}
              onClick={() => navigate('/profile')}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
