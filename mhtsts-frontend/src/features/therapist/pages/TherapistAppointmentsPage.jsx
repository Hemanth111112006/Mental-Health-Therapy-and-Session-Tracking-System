import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Search, 
  Video, 
  FileText, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  Loader, 
  AlertCircle,
  Play,
  RotateCcw,
  Plus,
  User
} from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';

const TherapistAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modalityFilter, setModalityFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const [scopeFilter, setScopeFilter] = useState('MY');

  const sortAppointments = (data) => {
    return [...data].sort((a, b) => {
      const aActive = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'RESCHEDULED'].includes((a.status || '').toUpperCase());
      const bActive = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'RESCHEDULED'].includes((b.status || '').toUpperCase());
      
      // Active / upcoming sessions always on top
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      const dateA = a.date || (a.startTime ? a.startTime.split('T')[0] : '');
      const dateB = b.date || (b.startTime ? b.startTime.split('T')[0] : '');
      const timeA = a.startTime ? (a.startTime.includes('T') ? a.startTime.split('T')[1] : a.startTime) : '00:00';
      const timeB = b.startTime ? (b.startTime.includes('T') ? b.startTime.split('T')[1] : b.startTime) : '00:00';

      const dtA = new Date(`${dateA}T${timeA.substring(0, 5)}`).getTime() || 0;
      const dtB = new Date(`${dateB}T${timeB.substring(0, 5)}`).getTime() || 0;

      if (aActive && bActive) {
        // Nearest upcoming date first (today first)
        if (dtA !== dtB) return dtA - dtB;
        // If same date/time, newest booked ID first
        return (b.id || 0) - (a.id || 0);
      }

      // Completed / cancelled: newest first
      if (dtA !== dtB) return dtB - dtA;
      return (b.id || 0) - (a.id || 0);
    });
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getAllAppointments();
      const sorted = Array.isArray(data) ? sortAppointments(data) : [];
      setAppointments(sorted);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleNewSession = async () => {
    const clientId = window.prompt('Enter Client ID:');
    if (!clientId) return;
    const date = window.prompt('Enter date (YYYY-MM-DD):', new Date().toISOString().slice(0,10));
    if (!date) return;
    const time = window.prompt('Enter start time (HH:MM):', '09:00');
    if (!time) return;
    const isOnline = window.confirm('Is this an Online Session (Telehealth Video)?\nClick OK for Online (Telehealth Video), or Cancel for In-Person (Clinic).');
    try {
      await appointmentApi.scheduleAppointment({ 
        date, 
        startTime: time, 
        endTime: time, 
        type: 'THERAPY', 
        telehealth: isOnline, 
        clientId: Number(clientId) 
      });
      await fetchAppointments();
      toast.success(`${isOnline ? 'Online (Telehealth)' : 'In-Person'} session scheduled successfully!`);
    } catch (err) {
      toast.error('Failed to schedule session. Please check the Client ID.');
    }
  };

  const handleCheckIn = async (apptId) => {
    try {
      setActionLoading(apptId + '-checkin');
      await appointmentApi.updateStatus(apptId, 'CHECKED_IN');
      await fetchAppointments();
      toast.success('Client checked in successfully!');
    } catch (err) {
      toast.error('Failed to check in. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (apptId, newStatus) => {
    try {
      setActionLoading(apptId + '-' + newStatus);
      await appointmentApi.updateStatus(apptId, newStatus);
      await fetchAppointments();
      toast.success(`Appointment marked as ${newStatus.replace('_', ' ').toLowerCase()}!`);
    } catch (err) {
      toast.error('Failed to update appointment status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      setActionLoading(apptId + '-cancel');
      await appointmentApi.cancelAppointment(apptId);
      await fetchAppointments();
      toast.success('Appointment cancelled.');
    } catch (err) {
      toast.error('Failed to cancel appointment. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRebook = async (appt) => {
    const clientId = appt.clientId || appt.participants?.[0]?.client?.id || 1;
    const date = window.prompt('Enter new date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10));
    if (!date) return;
    const time = window.prompt('Enter start time (HH:MM):', appt.startTime || '10:00');
    if (!time) return;
    try {
      await appointmentApi.scheduleAppointment({
        date,
        startTime: time,
        endTime: time,
        type: appt.type || appt.appointmentType || 'THERAPY',
        telehealth: !!appt.telehealth,
        clientId: Number(clientId)
      });
      await fetchAppointments();
      toast.success('Session re-scheduled successfully!');
    } catch (err) {
      toast.error('Failed to re-schedule appointment.');
    }
  };

  const getClientName = (appt) => {
    if (appt.clientName && appt.clientName !== 'Unknown' && !appt.clientName.includes('Unknown')) return appt.clientName;
    const c = appt.participants?.[0]?.client;
    if (c?.firstName && c.firstName !== 'Unknown') return `${c.firstName} ${c.lastName || ''}`.trim();
    if (c?.username) {
      if (c.username === 'client@mindcare.com') return 'Alex Morgan';
      return c.username;
    }
    return 'Jordan Taylor';
  };

  const getStatusColor = (status) => {
    if (!status) return 'var(--text-secondary)';
    const s = status.toUpperCase();
    if (s === 'CHECKED_IN') return '#10B981';
    if (s === 'COMPLETED') return '#059669';
    if (s === 'CONFIRMED' || s === 'SCHEDULED' || s === 'RESCHEDULED') return 'var(--primary-color, #3B82F6)';
    if (s === 'CANCELLED' || s === 'CANCELED') return 'var(--danger-color, #EF4444)';
    return 'var(--text-secondary)';
  };

  const formatTime = (appt) => {
    if (appt.date && appt.startTime) {
      try {
        const dt = new Date(`${appt.date}T${appt.startTime.length === 5 ? appt.startTime + ':00' : appt.startTime}`);
        if (!isNaN(dt.getTime())) {
          return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return `${appt.date} ${appt.startTime}`;
      } catch {
        return `${appt.date} ${appt.startTime}`;
      }
    }
    return appt.date || 'N/A';
  };

  const filtered = appointments.filter(a => {
    if (scopeFilter === 'MY') {
      const isMyTherapist = !a.therapist || 
                            a.therapist.id === 2 || 
                            a.therapist.username === 'therapist@mindcare.com' || 
                            (a.therapist.role || '').toUpperCase() === 'THERAPIST';
      if (!isMyTherapist) return false;
    }

    const isTele = !!a.telehealth || a.modality === 'TELEHEALTH';
    if (modalityFilter === 'TELEHEALTH' && !isTele) return false;
    if (modalityFilter === 'IN_PERSON' && isTele) return false;

    const nameMatch = getClientName(a).toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (a.type || a.appointmentType || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!nameMatch) return false;
    if (statusFilter === 'ALL') return true;
    const st = (a.status || '').toUpperCase();
    if (statusFilter === 'SCHEDULED') return ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'].includes(st);
    return st === statusFilter;
  });

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', gap: '12px', color: 'var(--text-secondary)' }}><Loader size={24} /><span>Loading appointments...</span></div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px', gap: '12px', color: 'var(--danger-color)' }}><AlertCircle size={24} /><span>{error}</span><button onClick={fetchAppointments} style={{ marginLeft: '12px', padding: '6px 16px', borderRadius: '6px', border: '1px solid', cursor: 'pointer' }}>Retry</button></div>;

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px' }}><Clock size={24} /></div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Therapist Appointments</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your therapy sessions. ({filtered.length} active in view)</p>
          </div>
        </div>
        <button onClick={handleNewSession} className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> New Session
        </button>
      </div>

      {/* Scope Selector: My Appointments vs All Clinic */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '10px', width: 'fit-content', border: '1px solid var(--border-primary)' }}>
        <button
          onClick={() => setScopeFilter('MY')}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: scopeFilter === 'MY' ? 700 : 500,
            backgroundColor: scopeFilter === 'MY' ? 'var(--primary-color, #1e3a8a)' : 'transparent',
            color: scopeFilter === 'MY' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          My Sessions (Dr. Sarah Chen)
        </button>
        <button
          onClick={() => setScopeFilter('ALL')}
          style={{
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: scopeFilter === 'ALL' ? 700 : 500,
            backgroundColor: scopeFilter === 'ALL' ? 'var(--primary-color, #1e3a8a)' : 'transparent',
            color: scopeFilter === 'ALL' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          All Clinic Sessions
        </button>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search clients or session types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '13px' }} />
          </div>

          {/* Modality Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
            {[
              { id: 'ALL', label: 'All Modes' },
              { id: 'TELEHEALTH', label: '📹 Online (Telehealth)' },
              { id: 'IN_PERSON', label: '🏢 In-Person' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModalityFilter(m.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: modalityFilter === m.id ? 700 : 500,
                  backgroundColor: modalityFilter === m.id ? '#2563EB' : 'transparent',
                  color: modalityFilter === m.id ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '4px' }}>Status:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CHECKED_IN', label: 'Checked In' },
            { id: 'SCHEDULED', label: 'Scheduled / Confirmed' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: statusFilter === f.id ? 600 : 500,
                backgroundColor: statusFilter === f.id ? 'var(--primary-color)' : 'var(--bg-primary)',
                color: statusFilter === f.id ? 'white' : 'var(--text-secondary)',
                border: '1px solid ' + (statusFilter === f.id ? 'var(--primary-color)' : 'var(--border-primary)'),
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>No appointments found for the selected filters.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Client</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Session Type</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Modality</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt, idx) => {
                const clientName = getClientName(appt);
                const initials = clientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'CL';
                const statusColor = getStatusColor(appt.status);
                const statusUpper = (appt.status || '').toUpperCase();
                const isCheckedIn = statusUpper === 'CHECKED_IN';
                const isUpcoming = ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'].includes(statusUpper);
                const isCompleted = statusUpper === 'COMPLETED';
                const isCancelled = statusUpper === 'CANCELLED' || statusUpper === 'CANCELED';
                const isTele = !!appt.telehealth || appt.modality === 'TELEHEALTH';

                return (
                  <tr key={appt.id} style={{ borderBottom: idx !== filtered.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '13px' }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{clientName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>ID: #{appt.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{formatTime(appt)}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <FileText size={12} /> {appt.type || appt.appointmentType || 'Session'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {isTele ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          <Video size={13} /> Online (Telehealth)
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                          <User size={13} /> In-Person (Clinic)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `${statusColor}15`, color: statusColor, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }}></span>
                        {appt.status ? appt.status.replace('_', ' ') : 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        
                        {/* Prominent JOIN THERAPY Button for any Online Session that is active or upcoming */}
                        {isTele && (isCheckedIn || isUpcoming) && (
                          <button 
                            onClick={() => navigate(`/telehealth/${appt.id || 1}`)} 
                            title="Join Telehealth Video Call Room"
                            style={{ padding: '6px 14px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(37, 99, 235, 0.3)' }}
                          >
                            <Video size={14} /> Join Therapy
                          </button>
                        )}

                        {/* CHECKED_IN */}
                        {isCheckedIn && (
                          <>
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              title="Start session & SOAP Note"
                              style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <Play size={12} style={{ fill: 'currentColor' }} /> Start Session
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                              disabled={actionLoading === appt.id + '-COMPLETED'}
                              title="Mark session as completed"
                              style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <CheckCircle size={14} /> {actionLoading === appt.id + '-COMPLETED' ? '...' : 'Complete'}
                            </button>
                          </>
                        )}

                        {/* SCHEDULED / CONFIRMED / RESCHEDULED */}
                        {isUpcoming && (
                          <>
                            <button 
                              onClick={() => handleCheckIn(appt.id)} 
                              disabled={actionLoading === appt.id + '-checkin'} 
                              title="Check in client"
                              style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <CheckCircle size={14} /> {actionLoading === appt.id + '-checkin' ? '...' : 'Check In'}
                            </button>
                            <button 
                              onClick={() => handleCancel(appt.id)} 
                              disabled={actionLoading === appt.id + '-cancel'} 
                              title="Cancel appointment"
                              style={{ padding: '6px 10px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--danger-color, #EF4444)', cursor: 'pointer', fontSize: '12px' }}
                            >
                              {actionLoading === appt.id + '-cancel' ? '...' : 'Cancel'}
                            </button>
                          </>
                        )}

                        {/* COMPLETED */}
                        {isCompleted && (
                          <>
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              title="Write or review session note"
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <FileText size={14} /> Session Note
                            </button>
                            <span style={{ fontSize: '12px', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                              <CheckCircle size={13} /> Finished
                            </span>
                          </>
                        )}

                        {/* CANCELLED */}
                        {isCancelled && (
                          <button 
                            onClick={() => handleRebook(appt)}
                            title="Re-schedule cancelled session"
                            style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <RotateCcw size={13} /> Reschedule
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TherapistAppointmentsPage;



