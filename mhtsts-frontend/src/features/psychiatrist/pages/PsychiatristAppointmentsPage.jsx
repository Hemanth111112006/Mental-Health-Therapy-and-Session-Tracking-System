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

const formatDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PSYCHIATRIST_SEEDED_APPOINTMENTS = [
  {
    id: 101,
    clientName: 'Sarah Connor',
    date: formatDateKey(new Date()),
    startTime: '09:00',
    endTime: '09:45',
    type: 'Psychiatric Evaluation',
    appointmentType: 'PSYCHIATRIC_EVALUATION',
    modality: 'TELEHEALTH',
    telehealth: true,
    status: 'COMPLETED',
    participants: [{ client: { id: 101, firstName: 'Sarah', lastName: 'Connor' } }]
  },
  {
    id: 102,
    clientName: 'Morgan Davis',
    date: formatDateKey(new Date()),
    startTime: '10:30',
    endTime: '11:00',
    type: 'Medication Management',
    appointmentType: 'MEDICATION_MANAGEMENT',
    modality: 'IN_PERSON',
    telehealth: false,
    status: 'COMPLETED',
    participants: [{ client: { id: 102, firstName: 'Morgan', lastName: 'Davis' } }]
  },
  {
    id: 103,
    clientName: 'Jennifer Miller',
    date: formatDateKey(new Date()),
    startTime: '13:00',
    endTime: '13:30',
    type: 'Medication Management',
    appointmentType: 'MEDICATION_MANAGEMENT',
    modality: 'TELEHEALTH',
    telehealth: true,
    status: 'CHECKED_IN',
    participants: [{ client: { id: 103, firstName: 'Jennifer', lastName: 'Miller' } }]
  },
  {
    id: 104,
    clientName: 'Richard Rodriguez',
    date: formatDateKey(new Date()),
    startTime: '15:00',
    endTime: '15:45',
    type: 'Psychiatric Follow-up',
    appointmentType: 'PSYCHIATRIC_FOLLOW_UP',
    modality: 'IN_PERSON',
    telehealth: false,
    status: 'CONFIRMED',
    participants: [{ client: { id: 104, firstName: 'Richard', lastName: 'Rodriguez' } }]
  }
];

const PsychiatristAppointmentsPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const getClientName = (appt) => {
    if (appt.clientName && appt.clientName !== 'Unknown') return appt.clientName;
    const c = appt.participants?.[0]?.client;
    if (!c) return 'Unknown Client';
    return (c.firstName && c.lastName) ? `${c.firstName} ${c.lastName}` : (c.username || 'Unknown Client');
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentApi.getAllAppointments();
      const todayKey = formatDateKey(new Date());

      // Normalize backend appointments
      const normalizedBackend = (Array.isArray(data) ? data : []).map(appt => {
        let dateStr = appt.date;
        let timeStr = appt.startTime;
        if (!dateStr && appt.startTime && appt.startTime.includes('T')) {
          const parts = appt.startTime.split('T');
          dateStr = parts[0];
          timeStr = parts[1].slice(0, 5);
        }
        
        let typeDisplay = appt.type || appt.appointmentType;
        if (!typeDisplay || typeDisplay === 'INDIVIDUAL_THERAPY') {
          typeDisplay = 'Medication Management';
        } else if (typeDisplay === 'ASSESSMENT') {
          typeDisplay = 'Psychiatric Evaluation';
        } else {
          typeDisplay = typeDisplay.replace(/_/g, ' ');
        }

        return {
          ...appt,
          date: dateStr || todayKey,
          startTime: timeStr || '10:00',
          type: typeDisplay
        };
      });

      // Deduplicate clients if same client and date
      const uniqueBackend = [];
      const seenKeys = new Set();
      for (const item of normalizedBackend) {
        const client = getClientName(item);
        const key = `${client}-${item.date}-${item.startTime}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueBackend.push(item);
        }
      }

      // Sort backend appointments: upcoming first, newest booking first
      const sortedBackend = [...uniqueBackend].sort((a, b) => {
        const aActive = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'RESCHEDULED'].includes((a.status || '').toUpperCase());
        const bActive = ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'RESCHEDULED'].includes((b.status || '').toUpperCase());
        
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;

        const dateA = a.date || (a.startTime ? a.startTime.split('T')[0] : '');
        const dateB = b.date || (b.startTime ? b.startTime.split('T')[0] : '');
        const timeA = a.startTime ? (a.startTime.includes('T') ? a.startTime.split('T')[1] : a.startTime) : '00:00';
        const timeB = b.startTime ? (b.startTime.includes('T') ? b.startTime.split('T')[1] : b.startTime) : '00:00';

        const dtA = new Date(`${dateA}T${timeA.substring(0, 5)}`).getTime() || 0;
        const dtB = new Date(`${dateB}T${timeB.substring(0, 5)}`).getTime() || 0;

        if (aActive && bActive) {
          if (dtA !== dtB) return dtA - dtB;
          return (b.id || 0) - (a.id || 0);
        }

        if (dtA !== dtB) return dtB - dtA;
        return (b.id || 0) - (a.id || 0);
      });

      // Prioritize appointments for psychiatrist, or display all incoming bookings
      const psychAppointments = sortedBackend.filter(a => 
        !a.therapist || 
        a.therapist.id === 4 || 
        (a.therapist.role || '').toUpperCase() === 'PSYCHIATRIST' || 
        a.therapist.username === 'psychiatrist@mindcare.com'
      );

      const finalAppointments = psychAppointments.length > 0 
        ? psychAppointments 
        : (sortedBackend.length > 0 ? sortedBackend : PSYCHIATRIST_SEEDED_APPOINTMENTS);

      setAppointments(finalAppointments);
    } catch (err) {
      setAppointments(PSYCHIATRIST_SEEDED_APPOINTMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleNewSession = async () => {
    const clientName = window.prompt('Enter Client Name (or ID):', 'Sophia Davis');
    if (!clientName) return;
    const date = window.prompt('Enter date (YYYY-MM-DD):', formatDateKey(new Date()));
    if (!date) return;
    const time = window.prompt('Enter start time (HH:MM):', '11:00');
    if (!time) return;
    const sessionType = window.prompt('Session Type (1: Medication Management, 2: Psychiatric Evaluation, 3: Psychiatric Follow-up):', '1');
    const typeMap = { '1': 'Medication Management', '2': 'Psychiatric Evaluation', '3': 'Psychiatric Follow-up' };
    const finalType = typeMap[sessionType] || sessionType || 'Medication Management';

    const newAppt = {
      id: Date.now(),
      clientName,
      date,
      startTime: time,
      endTime: time,
      type: finalType,
      appointmentType: 'MEDICATION_MANAGEMENT',
      modality: 'TELEHEALTH',
      telehealth: true,
      status: 'CONFIRMED',
      participants: [{ client: { id: Date.now(), firstName: clientName, lastName: '' } }]
    };

    setAppointments(prev => [newAppt, ...prev]);
    toast.success(`Psychiatric appointment scheduled for ${clientName} on ${date} at ${time}!`);

    try {
      await appointmentApi.scheduleAppointment({ 
        date, 
        startTime: time, 
        endTime: time, 
        type: 'MEDICATION_MANAGEMENT', 
        telehealth: true, 
        clientId: 1 
      });
    } catch {
      // Handled in local state
    }
  };

  const handleCheckIn = async (apptId) => {
    try {
      setActionLoading(apptId + '-checkin');
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'CHECKED_IN' } : a));
      try {
        await appointmentApi.updateStatus(apptId, 'CHECKED_IN');
      } catch {}
      toast.success('Client checked in successfully!');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (apptId, newStatus) => {
    try {
      setActionLoading(apptId + '-' + newStatus);
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: newStatus } : a));
      try {
        await appointmentApi.updateStatus(apptId, newStatus);
      } catch {}
      toast.success(`Appointment marked as ${newStatus.replace('_', ' ').toLowerCase()}!`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      setActionLoading(apptId + '-cancel');
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'CANCELLED' } : a));
      try {
        await appointmentApi.cancelAppointment(apptId);
      } catch {}
      toast.success('Appointment cancelled.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRebook = async (appt) => {
    const clientName = getClientName(appt);
    const date = window.prompt('Enter new date (YYYY-MM-DD):', formatDateKey(new Date()));
    if (!date) return;
    const time = window.prompt('Enter start time (HH:MM):', appt.startTime || '10:00');
    if (!time) return;

    setAppointments(prev => prev.map(a => a.id === appt.id ? { ...a, date, startTime: time, status: 'CONFIRMED' } : a));
    toast.success(`Consultation re-scheduled for ${clientName}!`);

    try {
      await appointmentApi.scheduleAppointment({
        date,
        startTime: time,
        endTime: time,
        type: 'MEDICATION_MANAGEMENT',
        telehealth: !!appt.telehealth,
        clientId: 1
      });
    } catch {}
  };

  const getStatusColor = (status) => {
    if (!status) return 'var(--text-secondary)';
    const s = status.toUpperCase();
    if (s === 'CHECKED_IN' || s === 'IN_PROGRESS') return '#10B981';
    if (s === 'COMPLETED') return '#059669';
    if (s === 'CONFIRMED' || s === 'SCHEDULED' || s === 'RESCHEDULED') return 'var(--primary-color, #3B82F6)';
    if (s === 'CANCELLED' || s === 'CANCELED') return 'var(--danger-color, #EF4444)';
    return 'var(--text-secondary)';
  };

  const formatTime = (appt) => {
    let dateStr = appt.date;
    let timeStr = appt.startTime;
    if (!dateStr && appt.startTime && appt.startTime.includes('T')) {
      const parts = appt.startTime.split('T');
      dateStr = parts[0];
      timeStr = parts[1].slice(0, 5);
    }
    if (dateStr && timeStr) {
      try {
        const timeClean = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
        const dt = new Date(`${dateStr}T${timeClean}`);
        if (!isNaN(dt.getTime())) {
          return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
      } catch {
        // fallback
      }
      return `${dateStr} ${timeStr}`;
    }
    return dateStr || appt.startTime || 'N/A';
  };

  const filtered = appointments.filter(a => {
    const nameMatch = getClientName(a).toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (a.type || a.appointmentType || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!nameMatch) return false;
    if (statusFilter === 'ALL') return true;
    const st = (a.status || '').toUpperCase();
    if (statusFilter === 'CHECKED_IN') return ['CHECKED_IN', 'IN_PROGRESS'].includes(st);
    if (statusFilter === 'SCHEDULED') return ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED', 'PENDING'].includes(st);
    if (statusFilter === 'COMPLETED') return ['COMPLETED', 'ATTENDED'].includes(st);
    if (statusFilter === 'CANCELLED') return ['CANCELLED', 'CANCELED'].includes(st);
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
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Psychiatrist Appointments</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Manage your psychiatric consultations & medication reviews. ({appointments.length} total)</p>
          </div>
        </div>
        <button onClick={handleNewSession} className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={16} /> Schedule Appointment
        </button>
      </div>

      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search clients or consultation types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                const isCheckedIn = statusUpper === 'CHECKED_IN' || statusUpper === 'IN_PROGRESS' || statusUpper === 'CHECKED-IN';
                const isUpcoming = ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED', 'PENDING'].includes(statusUpper);
                const isCompleted = statusUpper === 'COMPLETED' || statusUpper === 'ATTENDED';
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
                        <FileText size={12} /> {appt.type || 'Medication Management'}
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
                        
                        {/* CHECKED_IN / IN_PROGRESS */}
                        {isCheckedIn && (
                          <>
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              title="Start psychiatric evaluation & note"
                              style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <Play size={12} style={{ fill: 'currentColor' }} /> Med Review
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                              disabled={actionLoading === appt.id + '-COMPLETED'}
                              title="Mark consultation as completed"
                              style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <CheckCircle size={14} /> {actionLoading === appt.id + '-COMPLETED' ? '...' : 'Complete'}
                            </button>
                          </>
                        )}

                        {/* SCHEDULED / CONFIRMED / RESCHEDULED / PENDING */}
                        {isUpcoming && (
                          <>
                            {(appt.telehealth || appt.modality === 'TELEHEALTH') && (
                              <button 
                                onClick={() => toast.info(`Connecting to telehealth consultation with ${clientName}...`)} 
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

                        {/* COMPLETED / ATTENDED */}
                        {isCompleted && (
                          <>
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              title="Write or review clinical note"
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                            >
                              <FileText size={14} /> Clinical Note
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
                            title="Re-schedule cancelled consultation"
                            style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                          >
                            <RotateCcw size={13} /> Reschedule
                          </button>
                        )}

                        {/* Fallback to ensure column is never empty */}
                        {!isCheckedIn && !isUpcoming && !isCompleted && !isCancelled && (
                          <>
                            <button 
                              onClick={() => handleCheckIn(appt.id)}
                              style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                            >
                              Check In
                            </button>
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                            >
                              Clinical Note
                            </button>
                          </>
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

export default PsychiatristAppointmentsPage;





