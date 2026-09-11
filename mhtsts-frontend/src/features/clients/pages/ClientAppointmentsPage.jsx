import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Clock, Video, FileText, Calendar as CalendarIcon, X, RefreshCw, 
  AlertCircle, Loader, CheckCircle, Check, User, MapPin 
} from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';
import { userApi } from '../../../api/userApi';
import { useAuth } from '../../../providers/AuthProvider';

const DEFAULT_CLINICIANS = [
  { id: 2, name: 'Dr. Sarah Chen, LCSW', role: 'THERAPIST', email: 'therapist@mindcare.com' },
  { id: 4, name: 'Dr. Mark Rivera, MD', role: 'PSYCHIATRIST', email: 'psychiatrist@mindcare.com' },
  { id: 3, name: 'Dr. Maya Patel, PsyD', role: 'PSYCHOLOGIST', email: 'psychologist@mindcare.com' },
  { id: 9, name: 'Daniel Lee, LPC', role: 'COUNSELOR', email: 'counselor@mindcare.com' }
];

const TIME_SLOTS = [
  { value: '09:00:00', label: '09:00 AM - 10:00 AM' },
  { value: '10:00:00', label: '10:00 AM - 11:00 AM' },
  { value: '11:00:00', label: '11:00 AM - 12:00 PM' },
  { value: '13:00:00', label: '01:00 PM - 02:00 PM' },
  { value: '14:00:00', label: '02:00 PM - 03:00 PM' },
  { value: '15:00:00', label: '03:00 PM - 04:00 PM' },
  { value: '16:00:00', label: '04:00 PM - 05:00 PM' }
];

const APPOINTMENT_TYPES = [
  { value: 'INDIVIDUAL_THERAPY', label: 'Individual Psychotherapy (50 min)' },
  { value: 'CONSULTATION', label: 'Initial Clinical Consultation (50 min)' },
  { value: 'ASSESSMENT', label: 'Psychological Assessment (60 min)' },
  { value: 'FOLLOW_UP', label: 'Routine Follow-Up Session (30 min)' }
];

const getTomorrowDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const ClientAppointmentsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState(DEFAULT_CLINICIANS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modals state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reschedulingAppt, setReschedulingAppt] = useState(null);
  const [cancelingAppt, setCancelingAppt] = useState(null);

  // Request Form state
  const [requestForm, setRequestForm] = useState({
    providerId: 2,
    type: 'INDIVIDUAL_THERAPY',
    date: getTodayDate(),
    startTime: '09:00:00',
    telehealth: true,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reschedule Form state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('09:00:00');
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Check URL query param for instant modal open (?action=request)
  useEffect(() => {
    if (searchParams.get('action') === 'request') {
      setShowRequestModal(true);
    }
  }, [searchParams]);

  // Load providers from backend
  useEffect(() => {
    userApi.getAllUsers()
      .then(users => {
        const clinicians = users.filter(u =>
          ['THERAPIST', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'COUNSELOR'].includes((u.role || '').toUpperCase())
        );
        if (clinicians.length > 0) {
          setProviders(clinicians.map(c => {
            const roleStr = c.role ? c.role.charAt(0) + c.role.slice(1).toLowerCase() : 'Clinician';
            let formattedName = c.username || 'Provider';
            if (c.username === 'therapist@mindcare.com') formattedName = 'Dr. Sarah Chen, LCSW';
            else if (c.username === 'psychiatrist@mindcare.com') formattedName = 'Dr. Mark Rivera, MD';
            else if (c.username === 'psychologist@mindcare.com') formattedName = 'Dr. Maya Patel, PsyD';
            else if (c.username === 'counselor@mindcare.com') formattedName = 'Daniel Lee, LPC';
            else if (c.firstName && c.firstName !== 'Unknown') formattedName = `${c.firstName} ${c.lastName || ''}`.trim();

            return {
              id: c.id,
              name: `${formattedName} (${roleStr})`,
              role: c.role,
              email: c.email || c.username
            };
          }));
        }
      })
      .catch(() => {});
  }, []);

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
      setError(null);
      const allAppts = await appointmentApi.getAllAppointments();
      const sorted = Array.isArray(allAppts) ? sortAppointments(allAppts) : [];
      setAppointments(sorted);
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error('Appointments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Determine active client ID
  const getClientId = () => {
    if (currentUser?.clientId) return Number(currentUser.clientId);
    if (currentUser?.id && typeof currentUser.id === 'number') return currentUser.id;
    const existing = appointments.find(a => a.clientId);
    if (existing?.clientId) return Number(existing.clientId);
    return 1;
  };

  // Submit new appointment request
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const startTimeFormatted = requestForm.startTime.substring(0, 5);
      const hour = parseInt(startTimeFormatted.split(':')[0], 10);
      const endHour = String((hour + 1) % 24).padStart(2, '0');
      const endTimeFormatted = `${endHour}:${startTimeFormatted.split(':')[1]}`;

      const clientFullName = (currentUser?.firstName && currentUser?.lastName)
        ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
        : (currentUser?.title || currentUser?.username || 'Client');
      const clientContact = currentUser?.email || currentUser?.username || '';
      const customNote = requestForm.notes ? ` - ${requestForm.notes}` : '';

      const payload = {
        date: requestForm.date,
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        type: requestForm.type,
        telehealth: requestForm.telehealth,
        providerId: Number(requestForm.providerId),
        clientId: getClientId(),
        status: 'SCHEDULED',
        notes: `Client: ${clientFullName} (${clientContact})${customNote}`
      };

      await appointmentApi.scheduleAppointment(payload);
      const selectedProvider = providers.find(p => String(p.id) === String(requestForm.providerId));
      const providerDisplayName = selectedProvider ? selectedProvider.name : 'your doctor';
      toast.success(`Appointment confirmed with ${providerDisplayName} on ${requestForm.date} at ${startTimeFormatted}! Sent to doctor's schedule.`);
      setShowRequestModal(false);
      setRequestForm({
        providerId: 2,
        type: 'INDIVIDUAL_THERAPY',
        date: getTodayDate(),
        startTime: '09:00:00',
        telehealth: true,
        notes: ''
      });
      // Clear URL parameter if present
      if (searchParams.get('action') === 'request') {
        searchParams.delete('action');
        setSearchParams(searchParams);
      }
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to schedule appointment:', err);
      toast.error('Failed to schedule appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Reschedule Modal
  const openRescheduleModal = (appt) => {
    setReschedulingAppt(appt);
    setRescheduleDate(appt.date || getTomorrowDate());
    setRescheduleTime(appt.startTime ? `${appt.startTime}:00`.substring(0, 8) : '09:00:00');
  };

  // Submit Reschedule
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!reschedulingAppt) return;
    setIsRescheduling(true);
    try {
      const startTimeFormatted = rescheduleTime.substring(0, 5);
      const hour = parseInt(startTimeFormatted.split(':')[0], 10);
      const endHour = String((hour + 1) % 24).padStart(2, '0');
      const endTimeFormatted = `${endHour}:${startTimeFormatted.split(':')[1]}`;

      const updatedStartTime = `${rescheduleDate}T${startTimeFormatted}:00`;
      const updatedEndTime = `${rescheduleDate}T${endTimeFormatted}:00`;

      await appointmentApi.updateAppointment(reschedulingAppt.id, {
        startTime: updatedStartTime,
        endTime: updatedEndTime,
        status: 'RESCHEDULED'
      });

      toast.success('Appointment rescheduled successfully!');
      setReschedulingAppt(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to reschedule:', err);
      toast.error('Failed to reschedule appointment. Please try again.');
    } finally {
      setIsRescheduling(false);
    }
  };

  // Confirm Cancel
  const handleConfirmCancel = async () => {
    if (!cancelingAppt) return;
    setActionLoading(cancelingAppt.id + '-cancel');
    try {
      await appointmentApi.cancelAppointment(cancelingAppt.id);
      toast.success('Appointment cancelled successfully.');
      setCancelingAppt(null);
      await fetchAppointments();
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      toast.error('Failed to cancel appointment. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'var(--text-secondary)';
    switch (status.toUpperCase()) {
      case 'SCHEDULED':
      case 'UPCOMING':
      case 'CONFIRMED': return 'var(--primary-color, #3B82F6)';
      case 'COMPLETED': return 'var(--success-color, #10B981)';
      case 'CANCELLED':
      case 'CANCELED': return 'var(--danger-color, #EF4444)';
      case 'RESCHEDULED': return '#F59E0B';
      default: return 'var(--text-secondary)';
    }
  };

  const formatDateTime = (appt) => {
    if (appt.date && appt.startTime) {
      const d = new Date(`${appt.date}T${appt.startTime}`);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
      }
      return `${appt.date} ${appt.startTime}`;
    }
    return 'N/A';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isUpcoming = (status) =>
    ['SCHEDULED', 'UPCOMING', 'RESCHEDULED', 'CONFIRMED', 'PENDING'].includes((status || '').toUpperCase());

  if (loading && appointments.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', gap: '12px', color: 'var(--text-secondary)' }}>
      <Loader size={24} className="spin" />
      <span>Loading your appointments...</span>
    </div>
  );

  if (error && appointments.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', gap: '12px', color: 'var(--danger-color)' }}>
      <AlertCircle size={24} />
      <span>{error}</span>
      <button onClick={fetchAppointments} style={{ marginLeft: '12px', padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--danger-color)', backgroundColor: 'transparent', color: 'var(--danger-color)', cursor: 'pointer' }}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px' }}>
            <Clock size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>My Appointments</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              View your upcoming sessions and appointment history. ({appointments.length} total)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="mc-btn mc-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <CalendarIcon size={16} /> Request Appointment
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        {appointments.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '16px', margin: 0 }}>No appointments found.</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Schedule your first session using the Request Appointment button above.</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mc-btn mc-btn-primary"
              style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <CalendarIcon size={14} /> Request Appointment
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Provider</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => {
                let providerName = 'Unassigned Provider';
                let providerRole = appt.therapist?.role || 'Clinician';
                let providerInitials = 'PR';

                if (appt.therapist) {
                  const t = appt.therapist;
                  if (t.firstName && t.lastName && t.firstName !== 'Unknown') {
                    const prefix = ['THERAPIST', 'PSYCHIATRIST', 'PSYCHOLOGIST'].includes((t.role || '').toUpperCase()) ? 'Dr. ' : '';
                    providerName = `${prefix}${t.firstName} ${t.lastName}`;
                    providerInitials = `${t.firstName[0]}${t.lastName[0]}`.toUpperCase();
                  } else {
                    const em = (t.email || t.username || '').toLowerCase();
                    if (em.includes('therapist')) {
                      providerName = 'Dr. Sarah Chen, LCSW';
                      providerRole = 'Therapist';
                      providerInitials = 'SC';
                    } else if (em.includes('psychiatrist')) {
                      providerName = 'Dr. Mark Rivera, MD';
                      providerRole = 'Psychiatrist';
                      providerInitials = 'MR';
                    } else if (em.includes('psychologist')) {
                      providerName = 'Dr. Maya Patel, PsyD';
                      providerRole = 'Psychologist';
                      providerInitials = 'MP';
                    } else if (em.includes('counselor')) {
                      providerName = 'Daniel Lee, LPC';
                      providerRole = 'Counselor';
                      providerInitials = 'DL';
                    } else {
                      providerName = t.username || 'Clinical Provider';
                      providerInitials = 'CP';
                    }
                  }
                }

                const statusColor = getStatusColor(appt.status);
                const upcoming = isUpcoming(appt.status);

                return (
                  <tr key={appt.id} style={{ borderBottom: idx !== appointments.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '13px' }}>
                          {providerInitials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{providerName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'capitalize' }}>{providerRole.toLowerCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                      {formatDateTime(appt)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', borderRadius: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <FileText size={12} /> {appt.type || appt.appointmentType || 'Session'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `${statusColor}15`, color: statusColor, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }}></span>
                        {appt.status || 'Unknown'}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {upcoming && appt.telehealth && (
                          <button 
                            onClick={() => navigate(`/telehealth/${appt.id || 1}`)}
                            style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <Video size={14} /> Join Telehealth
                          </button>
                        )}
                        {upcoming && (
                          <>
                            <button
                              onClick={() => openRescheduleModal(appt)}
                              disabled={actionLoading === appt.id + '-reschedule'}
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <RefreshCw size={14} /> Reschedule
                            </button>
                            <button
                              onClick={() => setCancelingAppt(appt)}
                              disabled={actionLoading === appt.id + '-cancel'}
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--danger-color, #EF4444)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <X size={14} /> Cancel
                            </button>
                          </>
                        )}
                        {!upcoming && (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '8px' }}>—</span>
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

      {/* ── Request Appointment Modal ─────────────────────────────────────── */}
      {showRequestModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-primary)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: '540px',
            maxHeight: '92vh', overflowY: 'auto',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-primary)', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={20} color="var(--primary-color)" /> Request New Appointment
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Select your provider, date, time slot, and preferred format.
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Clinician / Provider */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Provider / Clinician *
                </label>
                <select
                  className="form-select"
                  value={requestForm.providerId}
                  onChange={e => setRequestForm({ ...requestForm, providerId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                >
                  {providers.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Appointment Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Session Type *
                </label>
                <select
                  className="form-select"
                  value={requestForm.type}
                  onChange={e => setRequestForm({ ...requestForm, type: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                >
                  {APPOINTMENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    value={requestForm.date}
                    onChange={e => setRequestForm({ ...requestForm, date: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Time Slot *
                  </label>
                  <select
                    className="form-select"
                    value={requestForm.startTime}
                    onChange={e => setRequestForm({ ...requestForm, startTime: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                  >
                    {TIME_SLOTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modality */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Session Modality *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                    borderRadius: '8px', border: requestForm.telehealth ? '2px solid var(--primary-color)' : '1px solid var(--border-primary)',
                    backgroundColor: requestForm.telehealth ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-primary)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="modality"
                      checked={requestForm.telehealth}
                      onChange={() => setRequestForm({ ...requestForm, telehealth: true })}
                      style={{ accentColor: 'var(--primary-color)' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Video size={14} color="var(--primary-color)" /> Telehealth
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Virtual video session</span>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px',
                    borderRadius: '8px', border: !requestForm.telehealth ? '2px solid var(--primary-color)' : '1px solid var(--border-primary)',
                    backgroundColor: !requestForm.telehealth ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-primary)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="modality"
                      checked={!requestForm.telehealth}
                      onChange={() => setRequestForm({ ...requestForm, telehealth: false })}
                      style={{ accentColor: 'var(--primary-color)' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="var(--primary-color)" /> In-Person
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Main clinic office</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Reason for Session / Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Share any specific topics, symptoms, or concerns you want to discuss with your provider..."
                  value={requestForm.notes}
                  onChange={e => setRequestForm({ ...requestForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  disabled={isSubmitting}
                  className="mc-btn mc-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mc-btn mc-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size={14} className="spin" /> Scheduling...
                    </>
                  ) : (
                    <>
                      <Check size={14} /> Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reschedule Appointment Modal ──────────────────────────────────── */}
      {reschedulingAppt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-primary)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: '480px',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-primary)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RefreshCw size={18} color="var(--primary-color)" /> Reschedule Appointment
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Current: {formatDateTime(reschedulingAppt)}
                </p>
              </div>
              <button
                onClick={() => setReschedulingAppt(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  New Date *
                </label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  New Time Slot *
                </label>
                <select
                  className="form-select"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '14px' }}
                >
                  {TIME_SLOTS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', borderTop: '1px solid var(--border-primary)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setReschedulingAppt(null)}
                  disabled={isRescheduling}
                  className="mc-btn mc-btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling}
                  className="mc-btn mc-btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isRescheduling ? <Loader size={14} className="spin" /> : <Check size={14} />} Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Cancel Confirmation Modal ─────────────────────────────────────── */}
      {cancelingAppt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--border-primary)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)',
            width: '100%', maxWidth: '440px',
            padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger-color, #EF4444)' }}>
              <AlertCircle size={28} />
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Cancel Appointment?</h2>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to cancel your session scheduled for <strong>{formatDateTime(cancelingAppt)}</strong>? This slot will be released back to the clinic.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setCancelingAppt(null)}
                disabled={actionLoading}
                className="mc-btn mc-btn-outline"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="mc-btn"
                style={{ backgroundColor: 'var(--danger-color, #EF4444)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {actionLoading ? <Loader size={14} className="spin" /> : <X size={14} />} Yes, Cancel Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientAppointmentsPage;
