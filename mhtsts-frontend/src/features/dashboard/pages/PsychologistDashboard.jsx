import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { appointmentApi } from '../../../api/appointmentApi';
import { clientApi } from '../../../api/clientApi';
import { toast } from '../../../utils/toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const PsychologistDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      appointmentApi.getAllAppointments().catch(() => []),
      clientApi.getAllClients().catch(() => [])
    ]).then(([apptData, clientData]) => {
      if (mounted) {
        setAppointments(Array.isArray(apptData) ? apptData : []);
        setClients(Array.isArray(clientData) ? clientData : []);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  const psychAppts = useMemo(() => {
    return appointments.filter(a =>
      !a.therapist ||
      a.therapist.id === 3 ||
      a.therapist.id === currentUser?.id ||
      a.therapist.username === 'psychologist@mindcare.com' ||
      (a.therapist.role || '').toUpperCase() === 'PSYCHOLOGIST'
    );
  }, [appointments, currentUser]);

  const todaysSessions = useMemo(() => {
    return psychAppts.filter(a => a.date === todayKey);
  }, [psychAppts, todayKey]);

  const upcomingSessions = useMemo(() => {
    const list = psychAppts.filter(a => (a.date || '') >= todayKey && a.status !== 'CANCELLED' && a.status !== 'COMPLETED');
    list.sort((a, b) => new Date(a.date + 'T' + (a.startTime || '00:00')) - new Date(b.date + 'T' + (b.startTime || '00:00')));
    return list;
  }, [psychAppts, todayKey]);

  const todaysSchedule = useMemo(() => {
    const source = todaysSessions.length > 0 ? todaysSessions : (upcomingSessions.length > 0 ? upcomingSessions : psychAppts);
    if (source.length === 0) {
      return [
        { id: 1, time: '09:30 AM', client: 'Sophia Davis', type: 'Neuropsychological Intake', modality: 'In-Person', status: 'COMPLETED' },
        { id: 2, time: '11:00 AM', client: 'Ava Johnson', type: 'CBT Session', modality: 'Telehealth', status: 'IN_PROGRESS' },
        { id: 3, time: '02:00 PM', client: 'Richard Rodriguez', type: 'PTSD Assessment Review', modality: 'Telehealth', status: 'SCHEDULED' }
      ];
    }
    return source.slice(0, 5).map(s => ({
      id: s.id,
      time: s.startTime ? `${s.startTime}${s.date && s.date !== todayKey ? ' (' + s.date + ')' : ''}` : '09:30 AM',
      client: s.clientName && s.clientName !== 'Unknown'
        ? s.clientName
        : (s.participants?.[0]?.client ? `${s.participants[0].client.firstName || ''} ${s.participants[0].client.lastName || ''}`.trim() : 'Patient'),
      type: s.type || s.appointmentType || 'Psychological Assessment',
      modality: s.telehealth || s.modality === 'TELEHEALTH' ? 'Telehealth' : 'In-Person',
      status: s.status || 'SCHEDULED'
    }));
  }, [todaysSessions, upcomingSessions, psychAppts, todayKey]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDoctorName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `Dr. ${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.lastName) {
      return `Dr. ${currentUser.lastName}`;
    }
    return 'Dr. Maya Patel, PsyD';
  };

  const pendingAssessments = [
    { id: 101, client: 'Richard Rodriguez', measure: 'PCL-5 (PTSD Checklist)', status: 'COMPLETED', date: 'Yesterday' },
    { id: 102, client: 'Sophia Davis', measure: 'AUDIT-C (Substance Screen)', status: 'SENT', date: '2 days ago' },
    { id: 103, client: 'Ava Johnson', measure: 'GAD-7 (Anxiety)', status: 'OVERDUE', date: '3 days ago' }
  ];

  const overallCaseloadImprovement = [
    { name: 'Intake', score: 22 },
    { name: 'Session 2', score: 19 },
    { name: 'Session 4', score: 15 },
    { name: 'Session 6', score: 12 },
    { name: 'Session 8', score: 9 },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'COMPLETED': return <span className="mc-badge mc-badge-success">Completed</span>;
      case 'SENT': return <span className="mc-badge mc-badge-warning">Sent</span>;
      case 'OVERDUE': return <span className="mc-badge mc-badge-critical">Overdue</span>;
      default: return <span className="mc-badge mc-badge-default">{status}</span>;
    }
  };

  const handleScheduleAction = (session) => {
    if (session.status === 'COMPLETED') {
      navigate('/outcome-measures?client=' + encodeURIComponent(session.client));
    } else if (session.status === 'IN_PROGRESS') {
      navigate('/session-notes/new?client=' + encodeURIComponent(session.client));
    } else {
      navigate('/outcome-measures?client=' + encodeURIComponent(session.client));
    }
  };

  const handleAssessmentAction = (item) => {
    if (item.status === 'COMPLETED') {
      navigate('/outcome-measures?client=' + encodeURIComponent(item.client));
    } else {
      toast.success(`Assessment reminder sent to ${item.client} for ${item.measure}`);
    }
  };

  return (
    <div className="mc-dashboard">
      <div className="mc-dashboard-header">
        <div>
          <h1 className="mc-page-title">{getGreeting()}, {getDoctorName()}</h1>
          <p className="mc-page-subtitle">Psychological testing, diagnostics, and outcomes portal.</p>
        </div>
        <div className="mc-dashboard-actions">
          <Link to="/outcome-measures" className="mc-btn mc-btn-primary">
            <ScienceOutlinedIcon style={{ fontSize: 18, marginRight: 6 }} /> Administer Assessment
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mc-grid-4">
        <div className="mc-stat-card primary">
          <div className="mc-stat-card-icon"><PeopleOutlinedIcon /></div>
          <div className="mc-stat-card-value">{clients.length > 0 ? clients.length : 16}</div>
          <div className="mc-stat-card-label">Active Caseload</div>
        </div>
        <div className="mc-stat-card success">
          <div className="mc-stat-card-icon"><EventAvailableOutlinedIcon /></div>
          <div className="mc-stat-card-value">{todaysSessions.length > 0 ? todaysSessions.length : upcomingSessions.length}</div>
          <div className="mc-stat-card-label">{todaysSessions.length > 0 ? "Appointments Today" : "Upcoming Sessions"}</div>
        </div>
        <div className="mc-stat-card warning">
          <div className="mc-stat-card-icon"><AssessmentOutlinedIcon /></div>
          <div className="mc-stat-card-value">3</div>
          <div className="mc-stat-card-label">Outstanding Testing</div>
        </div>
        <div className="mc-stat-card accent">
          <div className="mc-stat-card-icon"><ScienceOutlinedIcon /></div>
          <div className="mc-stat-card-value">94%</div>
          <div className="mc-stat-card-label">Testing Completion Rate</div>
        </div>
      </div>

      <div className="mc-grid-2">
        {/* Today's Schedule */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Today's Testing & Evaluation Schedule</h3>
            <Link to="/psychologist/calendar" className="mc-btn mc-btn-ghost mc-btn-sm">View Schedule</Link>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {todaysSchedule.map((session, i) => (
                <div key={session.id} style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: i < todaysSchedule.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  background: session.status === 'IN_PROGRESS' ? 'var(--color-primary-50)' : 'transparent'
                }}>
                  <div style={{ width: 80, fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)' }}>
                    {session.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {session.client}
                      {session.modality === 'Telehealth' ? 
                        <VideocamOutlinedIcon style={{ fontSize: 16, color: 'var(--color-primary)' }} title="Telehealth" /> : 
                        <PersonOutlinedIcon style={{ fontSize: 16, color: 'var(--color-success)' }} title="In-Person" />
                      }
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{session.type}</div>
                  </div>
                  <div>
                    <span className={`mc-badge mc-badge-${session.status === 'COMPLETED' ? 'success' : (session.status === 'IN_PROGRESS' ? 'active' : 'default')}`}>
                      {session.status}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleScheduleAction(session)}
                      className="mc-btn mc-btn-outline mc-btn-sm"
                    >
                      {session.status === 'COMPLETED' ? 'Review Test' : (session.status === 'IN_PROGRESS' ? 'Resume' : 'Start Assessment')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Assessments Queue */}
        <div className="mc-card" style={{ borderTop: '4px solid var(--color-primary)' }}>
          <div className="mc-card-header">
            <h3 className="mc-card-title">Assessment Administration Logs</h3>
            <span className="mc-badge mc-badge-active">{pendingAssessments.length}</span>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {pendingAssessments.map((item, i) => (
              <div key={item.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < pendingAssessments.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{item.client}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Measure: <strong>{item.measure}</strong>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Sent {item.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getStatusBadge(item.status)}
                  <button 
                    onClick={() => handleAssessmentAction(item)}
                    className="mc-btn mc-btn-outline mc-btn-sm"
                  >
                    {item.status === 'COMPLETED' ? 'Score' : 'Remind'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caseload improvement analytics */}
      <div className="mc-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="mc-card-header">
          <h3 className="mc-card-title">Caseload Symptom Reduction Trajectory</h3>
          <span className="mc-badge mc-badge-success">Avg -59% Severity</span>
        </div>
        <div className="mc-card-content" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overallCaseloadImprovement} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="var(--color-primary)" name="Average Clinical Scale Score" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;
