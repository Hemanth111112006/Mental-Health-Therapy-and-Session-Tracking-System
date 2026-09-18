import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { useNotification } from '../../../providers/NotificationProvider';
import { appointmentApi } from '../../../api/appointmentApi';
import { clientApi } from '../../../api/clientApi';
import Input from '../../../components/forms/Input';
import Button from '../../../components/forms/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import CalendarViewWeekOutlinedIcon from '@mui/icons-material/CalendarViewWeekOutlined';
import CalendarViewMonthOutlinedIcon from '@mui/icons-material/CalendarViewMonthOutlined';

// ─── Label maps ──────────────────────────────────────────────────────────────
const TYPE_LABELS = {
  INDIVIDUAL_THERAPY: 'Individual Therapy',
  GROUP_THERAPY: 'Group Therapy',
  INITIAL: 'Initial Intake',
  FOLLOW_UP: 'Follow-up Session',
  CONSULTATION: 'Psychiatric Consultation',
  ASSESSMENT: 'Psychological Assessment',
  CRISIS: 'Crisis Intervention',
  DISCHARGE: 'Discharge Review',
  MEDICATION_MANAGEMENT: 'Medication Management',
  PSYCHIATRIC_EVALUATION: 'Psychiatric Evaluation',
  PSYCHIATRIC_FOLLOW_UP: 'Psychiatric Follow-up',
};

const formatType = (raw) =>
  TYPE_LABELS[String(raw || '').toUpperCase().replace(/ /g, '_')] ||
  String(raw || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const STATUS_CONFIG = {
  CHECKED_IN:  { label: 'Checked In',  color: '#0D9488', bg: '#F0FDFA' },
  CONFIRMED:   { label: 'Confirmed',   color: '#2563EB', bg: '#EFF6FF' },
  COMPLETED:   { label: 'Completed',   color: '#059669', bg: '#ECFDF5' },
  SCHEDULED:   { label: 'Scheduled',   color: '#4F46E5', bg: '#EEF2FF' },
  CANCELLED:   { label: 'Cancelled',   color: '#DC2626', bg: '#FEF2F2' },
  NO_SHOW:     { label: 'No Show',     color: '#D97706', bg: '#FFFBEB' },
  IN_PROGRESS: { label: 'In Progress', color: '#0891B2', bg: '#ECFEFF' },
  RESCHEDULED: { label: 'Rescheduled', color: '#7C3AED', bg: '#F5F3FF' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[String(status || '').toUpperCase()] || { label: status, color: '#64748B', bg: '#F1F5F9' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.color}30`,
      whiteSpace: 'nowrap',
    }}>{cfg.label}</span>
  );
};

// ─── Provider map ─────────────────────────────────────────────────────────────
const PROVIDER_MAP = {
  1: 'Sarah Mitchell (Admin)',
  2: 'Dr. Mark Rivera, MD',
  3: 'Dr. Maya Patel, PsyD',
  4: 'Dr. Sarah Chen, LCSW',
  5: 'Dr. Kevin Torres, MD',
  6: 'Marcus Vance, MSW',
  7: 'Jennifer Adams',
  8: 'Alex Morgan',
};

const resolveProvider = (appt) => {
  if (appt.therapistName) return appt.therapistName;
  if (appt.therapist?.firstName) return `Dr. ${appt.therapist.firstName} ${appt.therapist.lastName}`;
  if (appt.providerId && PROVIDER_MAP[appt.providerId]) return PROVIDER_MAP[appt.providerId];
  if (appt.therapistId && PROVIDER_MAP[appt.therapistId]) return PROVIDER_MAP[appt.therapistId];
  return 'Dr. Sarah Chen, LCSW';
};

// ─── Dedup helper ─────────────────────────────────────────────────────────────
const deduplicateAppointments = (appts) => {
  const seen = new Set();
  return appts.filter(a => {
    const key = a.id ? `id:${a.id}` : `${a.date}|${a.startTime}|${a.clientName}|${a.status}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

// ─── Week / Month calendar helpers ────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const addDays = (date, n) => { const d = new Date(date); d.setDate(d.getDate() + n); return d; };
const startOfWeek = (date) => { const d = new Date(date); d.setDate(d.getDate() - d.getDay()); return d; };
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const toYMD = (date) => date.toISOString().split('T')[0];
const today = () => new Date();
const fmtDay = (d) => `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;


const SchedulePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useNotification();

  const isCalendarRoute = location.pathname === '/calendar';

  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // list | week | month
  const [viewMode, setViewMode] = useState(isCalendarRoute ? 'week' : 'list');
  const [navDate, setNavDate] = useState(today());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [apptData, clientData] = await Promise.all([
        appointmentApi.getAllAppointments().catch(() => []),
        clientApi.getAllClients().catch(() => []),
      ]);
      const raw = Array.isArray(apptData) ? apptData : [];
      setAppointments(deduplicateAppointments(raw));
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch {
      addToast('error', 'Error', 'Failed to load scheduling data');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.clientId) errs.clientId = 'Client is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.startTime) errs.startTime = 'Start time is required';
    if (!form.endTime) errs.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) errs.endTime = 'End time must be after start time';
    if (!form.type) errs.type = 'Appointment type is required';
    if (!form.status) errs.status = 'Status is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = { ...form, providerId: currentUser?.id, clientId: parseInt(form.clientId) };
      if (form.id) {
        await appointmentApi.updateAppointment(form.id, payload);
        addToast('success', 'Success', 'Appointment updated successfully');
      } else {
        await appointmentApi.scheduleAppointment(payload);
        addToast('success', 'Success', 'Appointment scheduled successfully');
      }
      setShowAddModal(false);
      setForm({});
      fetchData();
    } catch (err) {
      addToast('error', 'Error', err.message || 'Failed to save appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNewModal = () => {
    setForm({ type: 'INDIVIDUAL_THERAPY', status: 'SCHEDULED', telehealth: false });
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (appt) => {
    setForm({ ...appt, clientId: appt.clientId || appt.client?.id || '', telehealth: appt.telehealth || false });
    setErrors({});
    setSelectedAppt(null);
    setShowAddModal(true);
  };

  // ─── Filtered list ──────────────────────────────────────────────────────────
  const filteredAppts = appointments.filter(a => {
    const matchSearch = !searchTerm ||
      (a.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.date || '').includes(searchTerm);
    const matchStatus = statusFilter === 'ALL' || (a.status || '').toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  // ─── Week view helpers ──────────────────────────────────────────────────────
  const weekStart = startOfWeek(navDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const apptsByDate = (dateStr) => appointments.filter(a => a.date === dateStr);

  // ─── Month view helpers ─────────────────────────────────────────────────────
  const monthStart = startOfMonth(navDate);
  const firstDow = monthStart.getDay();
  const daysInMonth = new Date(navDate.getFullYear(), navDate.getMonth() + 1, 0).getDate();
  const monthCells = [];
  for (let i = 0; i < firstDow; i++) monthCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) monthCells.push(new Date(navDate.getFullYear(), navDate.getMonth(), d));

  // ─── Navigation helpers ─────────────────────────────────────────────────────
  const goPrev = () => {
    if (viewMode === 'week') setNavDate(d => addDays(d, -7));
    else if (viewMode === 'month') setNavDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const goNext = () => {
    if (viewMode === 'week') setNavDate(d => addDays(d, 7));
    else if (viewMode === 'month') setNavDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };
  const goToday = () => setNavDate(today());

  const STATUS_OPTIONS = ['ALL', 'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>

      {/* Page Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
          <CalendarMonthOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} />
          {isCalendarRoute ? 'Master Calendar' : 'Master Schedule'}
        </h1>
        <Button onClick={openNewModal}>+ Schedule Appointment</Button>
      </div>

      {/* View toggle + filter bar */}
      <div className="mc-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>

        {/* View Mode Buttons */}
        <div style={{ display: 'flex', border: '1px solid var(--border-primary)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { mode: 'list', icon: <ViewListOutlinedIcon style={{ fontSize: 18 }} />, label: 'List' },
            { mode: 'week', icon: <CalendarViewWeekOutlinedIcon style={{ fontSize: 18 }} />, label: 'Week' },
            { mode: 'month', icon: <CalendarViewMonthOutlinedIcon style={{ fontSize: 18 }} />, label: 'Month' },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', border: 'none', cursor: 'pointer',
                background: viewMode === mode ? 'var(--color-primary)' : 'transparent',
                color: viewMode === mode ? 'white' : 'var(--text-secondary)',
                fontWeight: viewMode === mode ? 600 : 400, fontSize: 12,
              }}
            >{icon}{label}</button>
          ))}
        </div>

        {/* List mode: search + status filter */}
        {viewMode === 'list' && (
          <>
            <input
              type="text"
              placeholder="Search by client or date..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: 180, padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 13, background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 12, background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : STATUS_CONFIG[s]?.label || s}</option>
              ))}
            </select>
          </>
        )}

        {/* Week/Month: nav controls */}
        {(viewMode === 'week' || viewMode === 'month') && (
          <>
            <button onClick={goPrev} style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 8, background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 13 }}>‹</button>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', minWidth: 200, textAlign: 'center' }}>
              {viewMode === 'week'
                ? `${fmtDay(weekDays[0])} – ${fmtDay(weekDays[6])}`
                : `${MONTHS[navDate.getMonth()]} ${navDate.getFullYear()}`}
            </span>
            <button onClick={goNext} style={{ padding: '6px 10px', border: '1px solid var(--border-primary)', borderRadius: 8, background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-primary)', fontSize: 13 }}>›</button>
            <button onClick={goToday} style={{ padding: '6px 10px', border: '1px solid var(--color-primary)', borderRadius: 8, background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 12, fontWeight: 600 }}>Today</button>
          </>
        )}
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <div className="mc-card" style={{ padding: 0 }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center' }}>Loading schedule...</div>
          ) : filteredAppts.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <EventNoteOutlinedIcon style={{ fontSize: 48, marginBottom: 8, color: 'var(--text-tertiary)' }} />
              <p>No appointments match your search.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="mc-table" style={{ minWidth: 900 }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Client</th>
                    <th>Provider / Clinician</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Modality</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppts.map(appt => (
                    <tr key={appt.id || `${appt.date}-${appt.startTime}-${appt.clientName}`}>
                      <td style={{ whiteSpace: 'nowrap' }}>{appt.date}</td>
                      <td style={{ whiteSpace: 'nowrap', color: 'var(--color-primary)', fontWeight: 500 }}>
                        {appt.startTime} – {appt.endTime}
                      </td>
                      <td style={{ fontWeight: 500 }}>{appt.clientName || 'Unknown'}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {resolveProvider(appt)}
                      </td>
                      <td style={{ fontSize: 12 }}>{formatType(appt.type)}</td>
                      <td><StatusBadge status={appt.status} /></td>
                      <td>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 12,
                          background: appt.telehealth ? '#EFF6FF' : '#F0FDF4',
                          color: appt.telehealth ? '#1D4ED8' : '#15803D',
                          border: `1px solid ${appt.telehealth ? '#BFDBFE' : '#BBF7D0'}`,
                        }}>
                          {appt.telehealth ? 'Telehealth' : 'In-Person'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {(appt.telehealth || appt.modality === 'TELEHEALTH') && appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                            <button
                              onClick={() => navigate(`/telehealth/${appt.id || 1}`)}
                              style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, border: 'none', background: '#2563EB', color: '#FFFFFF', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >📹 Join Therapy</button>
                          )}
                          <button
                            onClick={() => setSelectedAppt(appt)}
                            style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, border: '1px solid #3B82F6', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >View</button>
                          <button
                            onClick={() => openEditModal(appt)}
                            style={{ padding: '4px 10px', fontSize: 11, fontWeight: 600, border: '1px solid #D1D5DB', background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── WEEK VIEW ── */}
      {viewMode === 'week' && (
        <div className="mc-card" style={{ padding: 0, overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(120px, 1fr))', minWidth: 840 }}>
            {weekDays.map((day, i) => {
              const ymd = toYMD(day);
              const isToday = ymd === toYMD(today());
              const dayAppts = apptsByDate(ymd);
              return (
                <div
                  key={i}
                  style={{
                    borderRight: i < 6 ? '1px solid var(--border-primary)' : 'none',
                    minHeight: 200,
                  }}
                >
                  {/* Day header */}
                  <div style={{
                    padding: '8px 10px', borderBottom: '1px solid var(--border-primary)',
                    background: isToday ? 'var(--color-primary)' : 'var(--bg-secondary)',
                    color: isToday ? 'white' : 'var(--text-secondary)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 500 }}>{DAYS[day.getDay()]}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>{day.getDate()}</div>
                  </div>
                  {/* Day appointments */}
                  <div style={{ padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {dayAppts.length === 0 ? (
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center', padding: '8px 0' }}>—</div>
                    ) : dayAppts.map((a, idx) => {
                      const cfg = STATUS_CONFIG[(a.status || '').toUpperCase()] || { color: '#64748B', bg: '#F1F5F9' };
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedAppt(a)}
                          style={{
                            background: cfg.bg, borderLeft: `3px solid ${cfg.color}`,
                            borderRadius: 4, padding: '4px 6px', cursor: 'pointer', fontSize: 10,
                          }}
                        >
                          <div style={{ fontWeight: 700, color: cfg.color }}>{a.startTime}</div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{a.clientName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 9 }}>{formatType(a.type)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MONTH VIEW ── */}
      {viewMode === 'month' && (
        <div className="mc-card" style={{ padding: 0 }}>
          {/* Month grid header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', padding: '8px 0', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', borderRight: '1px solid var(--border-primary)' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {monthCells.map((day, idx) => {
              if (!day) return (
                <div key={`empty-${idx}`} style={{ minHeight: 80, borderRight: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', opacity: 0.3 }} />
              );
              const ymd = toYMD(day);
              const isToday = ymd === toYMD(today());
              const dayAppts = apptsByDate(ymd);
              return (
                <div
                  key={idx}
                  style={{
                    minHeight: 80, padding: 4, borderRight: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)',
                    background: isToday ? '#EFF6FF' : 'var(--bg-primary)',
                    cursor: dayAppts.length ? 'pointer' : 'default',
                  }}
                  onClick={() => { if (dayAppts.length) { setNavDate(day); setViewMode('week'); } }}
                >
                  <div style={{ fontWeight: isToday ? 800 : 500, fontSize: 13, color: isToday ? 'var(--color-primary)' : 'var(--text-primary)', marginBottom: 4 }}>
                    {day.getDate()}
                  </div>
                  {dayAppts.slice(0, 3).map((a, i) => {
                    const cfg = STATUS_CONFIG[(a.status || '').toUpperCase()] || { color: '#64748B', bg: '#F1F5F9' };
                    return (
                      <div key={i} onClick={e => { e.stopPropagation(); setSelectedAppt(a); }} style={{ background: cfg.bg, borderLeft: `2px solid ${cfg.color}`, borderRadius: 2, padding: '1px 4px', fontSize: 9, fontWeight: 600, color: cfg.color, marginBottom: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {a.startTime} {a.clientName}
                      </div>
                    );
                  })}
                  {dayAppts.length > 3 && (
                    <div style={{ fontSize: 9, color: 'var(--text-tertiary)', paddingLeft: 2 }}>+{dayAppts.length - 3} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SCHEDULE APPOINTMENT MODAL ── */}
      {showAddModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 520, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0' }}>{form.id ? 'Edit' : 'Schedule'} Appointment</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Client *</label>
                <select className="form-select mc-luxury-input" value={form.clientId || ''} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Select Client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
                </select>
                {errors.clientId && <span style={{ color: 'red', fontSize: 10 }}>{errors.clientId}</span>}
              </div>

              <Input type="date" label="Date" required value={form.date || ''} error={errors.date} onChange={e => setForm({ ...form, date: e.target.value })} />

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}><Input type="time" label="Start Time" required value={form.startTime || ''} error={errors.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
                <div style={{ flex: 1 }}><Input type="time" label="End Time" required value={form.endTime || ''} error={errors.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, display: 'block' }}>Session Type *</label>
                  <select className="form-select mc-luxury-input" value={form.type || 'INDIVIDUAL_THERAPY'} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="INDIVIDUAL_THERAPY">Individual Therapy</option>
                    <option value="INITIAL">Initial Intake / Consultation</option>
                    <option value="FOLLOW_UP">Follow-up Session</option>
                    <option value="GROUP_THERAPY">Group Therapy</option>
                    <option value="CONSULTATION">Psychiatric Consultation</option>
                    <option value="ASSESSMENT">Psychological Assessment</option>
                    <option value="MEDICATION_MANAGEMENT">Medication Management</option>
                    <option value="CRISIS">Crisis Intervention</option>
                    <option value="DISCHARGE">Discharge Review</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, display: 'block' }}>Status *</label>
                  <select className="form-select mc-luxury-input" value={form.status || 'SCHEDULED'} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CHECKED_IN">Checked In</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="NO_SHOW">No Show</option>
                  </select>
                </div>
              </div>

              <Input label="Location / Room" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="telehealth-chk" checked={form.telehealth || false} onChange={e => setForm({ ...form, telehealth: e.target.checked })} />
                <label htmlFor="telehealth-chk" style={{ fontSize: 12 }}>Telehealth / Video Session</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Notes / Reason for Visit</label>
                <textarea className="form-control mc-luxury-input" rows="2" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" loading={isSubmitting}>{form.id ? 'Update' : 'Schedule'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAIL MODAL ── */}
      {selectedAppt && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 520, padding: 24, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Appointment Details</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedAppt(null)}>&times;</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Client:</strong><span>{selectedAppt.clientName || 'Unknown'}</span></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Provider:</strong><span>{resolveProvider(selectedAppt)}</span></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Date:</strong><span>{selectedAppt.date}</span></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Time:</strong><span>{selectedAppt.startTime} – {selectedAppt.endTime}</span></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Session Type:</strong><span>{formatType(selectedAppt.type)}</span></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Status:</strong><StatusBadge status={selectedAppt.status} /></div>
              <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Modality:</strong><span>{selectedAppt.telehealth ? 'Telehealth / Video' : 'In-Person'}</span></div>
              {selectedAppt.location && <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Location:</strong><span>{selectedAppt.location}</span></div>}
              {selectedAppt.notes && <div style={{ display: 'flex', gap: 8 }}><strong style={{ minWidth: 130 }}>Notes:</strong><span style={{ color: 'var(--text-secondary)' }}>{selectedAppt.notes}</span></div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              {(selectedAppt.telehealth || selectedAppt.modality === 'TELEHEALTH') && selectedAppt.status !== 'COMPLETED' && selectedAppt.status !== 'CANCELLED' && (
                <button
                  onClick={() => {
                    const targetId = selectedAppt.id || 1;
                    setSelectedAppt(null);
                    navigate(`/telehealth/${targetId}`);
                  }}
                  style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, border: 'none', background: '#2563EB', color: '#FFFFFF', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  📹 Join Therapy
                </button>
              )}
              <Button variant="outline" onClick={() => openEditModal(selectedAppt)}>Edit Appointment</Button>
              <Button variant="ghost" onClick={() => setSelectedAppt(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
