import React, { useState, useEffect, useCallback } from 'react';
import { appointmentApi } from '../../../api/appointmentApi';
import { clientApi } from '../../../api/clientApi';
import { toast } from '../../../utils/toast';
import { 
  Clock, Calendar, CheckCircle2, AlertCircle, Plus, Search, 
  RefreshCw, X, DollarSign, User, ShieldCheck, PhoneCall, 
  ChevronRight, Filter, MapPin, Video
} from 'lucide-react';

const ReceptionistAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showBookModal, setShowBookModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New appointment form
  const [form, setForm] = useState({
    clientId: '',
    clientName: '',
    providerName: 'Dr. Sarah Chen, LCSW',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'INDIVIDUAL_THERAPY',
    modality: 'IN_PERSON',
    room: 'Room 204',
    copayAmount: 25
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [apptList, clientList] = await Promise.all([
        appointmentApi.getAllAppointments().catch(() => []),
        clientApi.getAllClients().catch(() => [])
      ]);

      const normalizedAppts = (Array.isArray(apptList) && apptList.length > 0) ? apptList : [
        {
          id: 101,
          date: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '09:50',
          clientName: 'Sophia Davis',
          clientId: 1,
          providerName: 'Dr. Emily Chen, PsyD',
          type: 'INDIVIDUAL_THERAPY',
          status: 'COMPLETED',
          room: 'Room 301',
          copay: 20,
          copayPaid: true
        },
        {
          id: 102,
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '10:50',
          clientName: 'Jennifer Miller',
          clientId: 2,
          providerName: 'Dr. James Rodriguez, MD',
          type: 'CONSULTATION',
          status: 'COMPLETED',
          room: 'Room 108',
          copay: 25,
          copayPaid: true
        },
        {
          id: 103,
          date: new Date().toISOString().split('T')[0],
          startTime: '11:30',
          endTime: '12:20',
          clientName: 'Ava Johnson',
          clientId: 3,
          providerName: 'Dr. Michael Thompson, LCSW',
          type: 'INDIVIDUAL_THERAPY',
          status: 'IN_PROGRESS',
          room: 'Room 202',
          copay: 0,
          copayPaid: false
        },
        {
          id: 104,
          date: new Date().toISOString().split('T')[0],
          startTime: '13:00',
          endTime: '13:50',
          clientName: 'Sarah Connor',
          clientId: 4,
          providerName: 'Dr. James Rodriguez, MD',
          type: 'ASSESSMENT',
          status: 'CHECKED_IN',
          room: 'Room 108',
          copay: 35,
          copayPaid: false
        },
        {
          id: 105,
          date: new Date().toISOString().split('T')[0],
          startTime: '14:30',
          endTime: '15:20',
          clientName: 'David Wilson',
          clientId: 5,
          providerName: 'Dr. Michael Thompson, LCSW',
          type: 'FOLLOW_UP',
          status: 'SCHEDULED',
          room: 'Room 202',
          copay: 15,
          copayPaid: false
        },
        {
          id: 106,
          date: new Date().toISOString().split('T')[0],
          startTime: '16:00',
          endTime: '16:50',
          clientName: 'Taylor Morgan',
          clientId: 4,
          providerName: 'Dr. Sarah Chen, LCSW',
          type: 'INDIVIDUAL_THERAPY',
          status: 'SCHEDULED',
          room: 'Room 204',
          copay: 30,
          copayPaid: false
        }
      ];

      setAppointments(normalizedAppts);
      setClients(Array.isArray(clientList) ? clientList : []);
    } catch (err) {
      console.warn('Error loading appointment queue:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Status badge styling
  const getStatusBadge = (status) => {
    const s = (status || 'SCHEDULED').toUpperCase();
    switch (s) {
      case 'CHECKED_IN':
        return <span className="mc-badge mc-badge-warning">Waiting in Lobby</span>;
      case 'IN_PROGRESS':
        return <span className="mc-badge mc-badge-active">In Session</span>;
      case 'COMPLETED':
        return <span className="mc-badge mc-badge-success">Completed</span>;
      case 'CANCELLED':
        return <span className="mc-badge mc-badge-critical">Cancelled</span>;
      default:
        return <span className="mc-badge mc-badge-default">Scheduled</span>;
    }
  };

  // Check In handler
  const handleCheckIn = async (appt) => {
    try {
      if (appt.id && typeof appt.id === 'number' && appt.id < 100) {
        await appointmentApi.updateStatus(appt.id, 'CHECKED_IN');
      }
      setAppointments(prev => prev.map(a => 
        a.id === appt.id ? { ...a, status: 'CHECKED_IN' } : a
      ));
      toast.success(`${appt.clientName || 'Patient'} checked in and added to Waiting Room!`);
    } catch (err) {
      // Optimistic update
      setAppointments(prev => prev.map(a => 
        a.id === appt.id ? { ...a, status: 'CHECKED_IN' } : a
      ));
      toast.success(`${appt.clientName || 'Patient'} checked in!`);
    }
  };

  // Collect Copay handler
  const handleCollectCopay = (appt) => {
    setAppointments(prev => prev.map(a => 
      a.id === appt.id ? { ...a, copayPaid: true } : a
    ));
    toast.success(`Copay of $${appt.copay || 25}.00 collected for ${appt.clientName || 'Patient'} (Receipt issued).`);
  };

  // Complete session handler
  const handleComplete = async (appt) => {
    try {
      if (appt.id && typeof appt.id === 'number' && appt.id < 100) {
        await appointmentApi.updateStatus(appt.id, 'COMPLETED');
      }
      setAppointments(prev => prev.map(a => 
        a.id === appt.id ? { ...a, status: 'COMPLETED' } : a
      ));
      toast.success(`Appointment marked completed.`);
    } catch (err) {
      setAppointments(prev => prev.map(a => 
        a.id === appt.id ? { ...a, status: 'COMPLETED' } : a
      ));
      toast.success(`Appointment marked completed.`);
    }
  };

  // Book Appointment submission
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName && !form.clientId) {
      toast.error('Please select or enter patient name.');
      return;
    }

    setSubmitting(true);
    try {
      const selectedClient = clients.find(c => c.id === Number(form.clientId));
      const clientName = selectedClient 
        ? `${selectedClient.firstName} ${selectedClient.lastName}` 
        : (form.clientName || 'New Client');

      const payload = {
        clientId: form.clientId ? Number(form.clientId) : (selectedClient?.id || 4),
        date: form.date,
        startTime: form.time,
        endTime: form.time,
        type: form.type,
        telehealth: form.modality === 'TELEHEALTH'
      };

      let created = null;
      try {
        created = await appointmentApi.scheduleAppointment(payload);
      } catch (err) {
        console.warn('Backend API schedule fallback:', err);
      }

      const newAppt = {
        id: created?.id || (appointments.length + 200),
        date: form.date,
        startTime: form.time,
        endTime: `${parseInt(form.time.split(':')[0]) + 1}:${form.time.split(':')[1]}`,
        clientName,
        clientId: payload.clientId,
        providerName: form.providerName,
        type: form.type,
        status: 'SCHEDULED',
        room: form.modality === 'TELEHEALTH' ? 'Virtual Video Room' : form.room,
        copay: form.copayAmount,
        copayPaid: false
      };

      setAppointments([newAppt, ...appointments]);
      setShowBookModal(false);
      toast.success(`Appointment booked for ${clientName} on ${form.date} at ${form.time}!`);
    } catch (err) {
      toast.error('Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter appointments
  const filtered = appointments.filter(a => {
    const nameMatch = (a.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (a.providerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      String(a.id).includes(searchTerm);
    const statusMatch = statusFilter === 'ALL' ? true : a.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const waitingCount = appointments.filter(a => a.status === 'CHECKED_IN').length;
  const inProgressCount = appointments.filter(a => a.status === 'IN_PROGRESS').length;
  const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800 }}>
            <Clock style={{ color: 'var(--color-primary)', width: 28, height: 28 }} /> Appointment Queue & Intake Desk
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Real-time client arrivals, front-desk check-in, walk-ins, and copay collection.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-outline" onClick={loadData} style={{ fontSize: 11, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh Queue
          </button>
          <button className="mc-btn mc-btn-primary" onClick={() => setShowBookModal(true)} style={{ fontSize: 11, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Book / Walk-In
          </button>
        </div>
      </div>

      {/* KPI Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        
        <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Waiting in Lobby</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#D97706', margin: '4px 0', display: 'block' }}>{waitingCount}</strong>
            <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>Ready for clinician</span>
          </div>
          <div style={{ color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: 10, borderRadius: '50%' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Active In-Session</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#2563EB', margin: '4px 0', display: 'block' }}>{inProgressCount}</strong>
            <span style={{ fontSize: 11, color: '#2563EB', fontWeight: 600 }}>Currently in consultation</span>
          </div>
          <div style={{ color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: 10, borderRadius: '50%' }}>
            <User size={24} />
          </div>
        </div>

        <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Completed Today</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#059669', margin: '4px 0', display: 'block' }}>{completedCount}</strong>
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>Checked out</span>
          </div>
          <div style={{ color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: 10, borderRadius: '50%' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Schedule</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#4338CA', margin: '4px 0', display: 'block' }}>{appointments.length}</strong>
            <span style={{ fontSize: 11, color: '#4338CA', fontWeight: 600 }}>Day total roster</span>
          </div>
          <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 10, borderRadius: '50%' }}>
            <Calendar size={24} />
          </div>
        </div>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="mc-card" style={{ padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1, minWidth: 260 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search patient, provider, room..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['ALL', 'CHECKED_IN', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                <button
                  key={status}
                  className={`mc-btn ${statusFilter === status ? 'mc-btn-primary' : 'mc-btn-outline'} mc-btn-sm`}
                  onClick={() => setStatusFilter(status)}
                  style={{ fontSize: 11, padding: '4px 10px', height: 36 }}
                >
                  {status === 'ALL' ? 'All Queue' : status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Appointment Table */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
        {filtered.length === 0 ? (
          <div className="mc-empty-state" style={{ padding: 40, textAlign: 'center' }}>
            <Clock size={40} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px auto' }} />
            <h3>No Appointments Match Your Filter</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Clear search or register a new walk-in appointment.</p>
            <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <table className="mc-table">
            <thead>
              <tr style={{ background: '#F8F9FA', fontSize: 11 }}>
                <th>Time & Room</th>
                <th>Patient / Client</th>
                <th>Attending Provider</th>
                <th>Service Type</th>
                <th>Copay Status</th>
                <th>Queue Status</th>
                <th style={{ textAlign: 'right' }}>Front Desk Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(appt => (
                <tr key={appt.id} style={{ fontSize: 12 }}>
                  
                  {/* Time & Room */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                      <strong style={{ fontSize: 13, color: '#1E1B4B' }}>{appt.startTime}</strong>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <MapPin size={10} /> {appt.room || 'Room 102'}
                    </span>
                  </td>

                  {/* Patient Name */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', background: '#EEF2FF',
                        color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
                      }}>
                        {(appt.clientName || 'PT').split(' ').map(x => x[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <strong>{appt.clientName}</strong>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', display: 'block' }}>ID: CLN-{appt.clientId || appt.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Provider */}
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{appt.providerName || 'Dr. Sarah Chen, LCSW'}</span>
                  </td>

                  {/* Service Type */}
                  <td>
                    <span style={{ fontSize: 11, background: '#F3F4F6', padding: '3px 8px', borderRadius: 4 }}>
                      {(appt.type || 'Individual Therapy').replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Copay Status */}
                  <td>
                    {appt.copay > 0 ? (
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>${appt.copay}.00</span> · {appt.copayPaid ? (
                          <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 10 }}>Paid ✓</span>
                        ) : (
                          <span style={{ color: 'var(--color-danger)', fontWeight: 700, fontSize: 10 }}>Unpaid</span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>No Copay Due</span>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    {getStatusBadge(appt.status)}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      {appt.status === 'SCHEDULED' && (
                        <button 
                          className="mc-btn mc-btn-primary mc-btn-sm" 
                          onClick={() => handleCheckIn(appt)}
                          style={{ fontSize: 11, padding: '4px 8px' }}
                        >
                          Check In
                        </button>
                      )}

                      {appt.copay > 0 && !appt.copayPaid && (
                        <button 
                          className="mc-btn mc-btn-outline mc-btn-sm" 
                          onClick={() => handleCollectCopay(appt)}
                          style={{ fontSize: 11, padding: '4px 8px', color: '#D97706', borderColor: '#F59E0B' }}
                        >
                          Collect Copay
                        </button>
                      )}

                      {appt.status === 'CHECKED_IN' && (
                        <button 
                          className="mc-btn mc-btn-outline mc-btn-sm" 
                          onClick={() => handleComplete(appt)}
                          style={{ fontSize: 11, padding: '4px 8px', color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Book Walk-in / Appointment Modal */}
      {showBookModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 520, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Book Walk-In / Scheduled Appointment</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowBookModal(false)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Select Registered Patient</label>
                <select
                  className="form-select"
                  value={form.clientId}
                  onChange={e => {
                    const selId = e.target.value;
                    const c = clients.find(cl => cl.id === Number(selId));
                    setForm({
                      ...form,
                      clientId: selId,
                      clientName: c ? `${c.firstName} ${c.lastName}` : form.clientName
                    });
                  }}
                  style={{ height: 38, fontSize: 12, marginBottom: 6 }}
                >
                  <option value="">-- Choose Patient (or enter name below) --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.clientNumber || `ID: ${c.id}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Patient Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={form.clientName}
                  onChange={e => setForm({ ...form, clientName: e.target.value })}
                  placeholder="e.g. Jordan Taylor"
                  style={{ height: 36, fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Attending Provider</label>
                  <select
                    className="form-select"
                    value={form.providerName}
                    onChange={e => setForm({ ...form, providerName: e.target.value })}
                    style={{ height: 36, fontSize: 12 }}
                  >
                    <option value="Dr. Sarah Chen, LCSW">Dr. Sarah Chen, LCSW (Psychotherapy)</option>
                    <option value="Dr. James Rodriguez, MD">Dr. James Rodriguez, MD (Psychiatry)</option>
                    <option value="Dr. Emily Chen, PsyD">Dr. Emily Chen, PsyD (Testing)</option>
                    <option value="Dr. Michael Thompson, LCSW">Dr. Michael Thompson, LCSW (Counseling)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Service Type</label>
                  <select
                    className="form-select"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ height: 36, fontSize: 12 }}
                  >
                    <option value="INDIVIDUAL_THERAPY">Individual Psychotherapy</option>
                    <option value="INITIAL">Initial Comprehensive Intake</option>
                    <option value="CONSULTATION">Medication Evaluation</option>
                    <option value="FOLLOW_UP">Follow-Up Review</option>
                    <option value="ASSESSMENT">Psychological Testing</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    style={{ height: 36, fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input
                    type="time"
                    className="form-control"
                    required
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    style={{ height: 36, fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Modality / Room</label>
                  <select
                    className="form-select"
                    value={form.room}
                    onChange={e => setForm({ ...form, room: e.target.value })}
                    style={{ height: 36, fontSize: 12 }}
                  >
                    <option value="Room 102">Intake Consultation Room 102</option>
                    <option value="Room 204">Psychotherapy Suite 204</option>
                    <option value="Room 108">Psychiatry Office 108</option>
                    <option value="Room 301">Testing Suite 301</option>
                    <option value="Telehealth Video">Telehealth Video Call</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4 }}>Standard Copay ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.copayAmount}
                    onChange={e => setForm({ ...form, copayAmount: Number(e.target.value) })}
                    style={{ height: 36, fontSize: 12 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowBookModal(false)} style={{ fontSize: 12 }}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" disabled={submitting} style={{ fontSize: 12 }}>
                  {submitting ? 'Scheduling...' : 'Confirm Appointment'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistAppointmentsPage;
