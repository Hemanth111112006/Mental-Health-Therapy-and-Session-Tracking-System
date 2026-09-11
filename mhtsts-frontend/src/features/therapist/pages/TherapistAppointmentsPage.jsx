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
  Plus
} from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';

const TherapistAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getAllAppointments();
      const sorted = Array.isArray(data) ? [...data].sort((a, b) => {
        const dateA = new Date((a.date || '') + 'T' + (a.startTime || '00:00'));
        const dateB = new Date((b.date || '') + 'T' + (b.startTime || '00:00'));
        return dateB - dateA;
      }) : [];
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
    try {
      await appointmentApi.scheduleAppointment({ date, startTime: time, endTime: time, type: 'THERAPY', telehealth: false, clientId: Number(clientId) });
      await fetchAppointments();
      toast.success('Session scheduled successfully!');
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
    if (appt.clientName && appt.clientName !== 'Unknown') return appt.clientName;
    const c = appt.participants?.[0]?.client;
    if (!c) return 'Unknown Client';
    return (c.firstName && c.lastName) ? `${c.firstName} ${c.lastName}` : (c.username || 'Unknown Client');
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
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your therapy sessions. ({appointments.length} total)</p>
          </div>
        </div>
        <button onClick={handleNewSession} className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> New Session
        </button>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search clients or session types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box', fontSize: '13px' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                padding: '6px 12px',
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
            <p>No appointments found.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Client</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Session Type</th>
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
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `${statusColor}15`, color: statusColor, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }}></span>
                        {appt.status ? appt.status.replace('_', ' ') : 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        
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
                            {appt.telehealth && (
                              <button 
                                onClick={() => toast.info('Telehealth link will be provided by your administrator.')} 
                                title="Join Telehealth Video Call"
                                style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                              >
                                <Video size={14} /> Join Call
                              </button>
                            )}
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



