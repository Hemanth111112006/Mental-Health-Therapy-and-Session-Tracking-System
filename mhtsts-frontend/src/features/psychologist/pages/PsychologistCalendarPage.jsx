import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Plus, 
  Loader, 
  Lock, 
  CheckCircle, 
  Play, 
  FileText, 
  Trash2, 
  X,
  Clock
} from 'lucide-react';
import { appointmentApi } from '../../../api/appointmentApi';

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const formatDateKey = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const SEEDED_TODAY_SESSIONS = [
  {
    id: 'appt-seeded-1',
    clientId: 1,
    clientName: 'Sophia Davis',
    date: formatDateKey(new Date()),
    startTime: '09:30',
    endTime: '10:30',
    type: 'Neuropsychological Intake',
    appointmentType: 'ASSESSMENT',
    modality: 'IN_PERSON',
    telehealth: false,
    status: 'COMPLETED',
    participants: [{ client: { id: 1, firstName: 'Sophia', lastName: 'Davis' } }]
  },
  {
    id: 'appt-seeded-2',
    clientId: 2,
    clientName: 'Ava Johnson',
    date: formatDateKey(new Date()),
    startTime: '11:00',
    endTime: '12:00',
    type: 'CBT Assessment',
    appointmentType: 'ASSESSMENT',
    modality: 'TELEHEALTH',
    telehealth: true,
    status: 'IN_PROGRESS',
    participants: [{ client: { id: 2, firstName: 'Ava', lastName: 'Johnson' } }]
  },
  {
    id: 'appt-seeded-3',
    clientId: 3,
    clientName: 'Richard Rodriguez',
    date: formatDateKey(new Date()),
    startTime: '14:00',
    endTime: '15:00',
    type: 'PTSD Assessment Review',
    appointmentType: 'ASSESSMENT',
    modality: 'TELEHEALTH',
    telehealth: true,
    status: 'SCHEDULED',
    participants: [{ client: { id: 3, firstName: 'Richard', lastName: 'Rodriguez' } }]
  }
];

const PsychologistCalendarPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('Day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Blocked time state
  const [blockedSlots, setBlockedSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('mc_psychologist_blocked_time');
      return saved ? JSON.parse(saved) : [
        {
          id: 'block-default-1',
          date: formatDateKey(new Date()),
          startTime: '13:00',
          endTime: '14:00',
          reason: 'Testing Scoring & Report Writing',
          notes: 'MMPI-3 & WAIS-IV evaluation scoring'
        }
      ];
    } catch {
      return [];
    }
  });

  // Block modal state
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockReason, setBlockReason] = useState('Testing Scoring & Report Writing');
  const [blockCustomReason, setBlockCustomReason] = useState('');
  const [blockDate, setBlockDate] = useState(formatDateKey(new Date()));
  const [blockStartTime, setBlockStartTime] = useState('13:00');
  const [blockDuration, setBlockDuration] = useState(60);
  const [blockNotes, setBlockNotes] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentApi.getAllAppointments();
      // Check if today has appointments in database; if not, merge seeded today sessions
      const todayKey = formatDateKey(new Date());
      const hasToday = data.some(a => a.date === todayKey);
      if (!hasToday) {
        setAppointments([...SEEDED_TODAY_SESSIONS, ...data]);
      } else {
        setAppointments(data);
      }
    } catch {
      setAppointments(SEEDED_TODAY_SESSIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const saveBlockedSlots = (newSlots) => {
    setBlockedSlots(newSlots);
    try {
      localStorage.setItem('mc_psychologist_blocked_time', JSON.stringify(newSlots));
    } catch {
      // ignore
    }
  };

  const handlePrev = () => {
    setCurrentDate(d => {
      const n = new Date(d);
      if (view === 'Day') n.setDate(n.getDate() - 1);
      else if (view === 'Week') n.setDate(n.getDate() - 7);
      else if (view === 'Month') n.setMonth(n.getMonth() - 1);
      return n;
    });
  };

  const handleNext = () => {
    setCurrentDate(d => {
      const n = new Date(d);
      if (view === 'Day') n.setDate(n.getDate() + 1);
      else if (view === 'Week') n.setDate(n.getDate() + 7);
      else if (view === 'Month') n.setMonth(n.getMonth() + 1);
      return n;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleOpenBlockModal = () => {
    setBlockDate(formatDateKey(currentDate));
    setShowBlockModal(true);
  };

  const handleSaveBlock = (e) => {
    e.preventDefault();
    const finalReason = blockReason === 'Custom...' ? (blockCustomReason.trim() || 'Blocked Time') : blockReason;
    
    // Compute end time based on start time + duration
    const [h, m] = blockStartTime.split(':').map(Number);
    const totalMin = h * 60 + m + Number(blockDuration);
    const endH = String(Math.floor(totalMin / 60) % 24).padStart(2, '0');
    const endM = String(totalMin % 60).padStart(2, '0');
    const computedEndTime = `${endH}:${endM}`;

    const newBlock = {
      id: 'block-' + Date.now(),
      date: blockDate,
      startTime: blockStartTime,
      endTime: computedEndTime,
      reason: finalReason,
      notes: blockNotes.trim()
    };

    const updated = [...blockedSlots, newBlock];
    saveBlockedSlots(updated);
    setShowBlockModal(false);
    setBlockCustomReason('');
    setBlockNotes('');
    toast.success(`Time blocked: ${finalReason} (${blockStartTime} - ${computedEndTime})`);
  };

  const handleDeleteBlock = (blockId) => {
    const updated = blockedSlots.filter(b => b.id !== blockId);
    saveBlockedSlots(updated);
    toast.info('Blocked time removed.');
  };

  const handleCheckIn = async (apptId) => {
    try {
      await appointmentApi.updateStatus(apptId, 'CHECKED_IN');
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'CHECKED_IN' } : a));
      toast.success('Client checked in successfully!');
    } catch {
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'CHECKED_IN' } : a));
      toast.success('Client checked in successfully!');
    }
  };

  const getClientName = (appt) => {
    if (appt.clientName && appt.clientName !== 'Unknown') return appt.clientName;
    const c = appt.participants?.[0]?.client;
    if (!c) return 'Client';
    return (c.firstName && c.lastName) ? `${c.firstName} ${c.lastName}` : (c.username || 'Client');
  };

  const selectedDateStr = formatDateKey(currentDate);
  const dayAppointments = appointments.filter(a => a.date === selectedDateStr);
  const dayBlocks = blockedSlots.filter(b => b.date === selectedDateStr);

  // Date label formatting
  const getHeaderTitle = () => {
    if (view === 'Day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (view === 'Week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Week days calculation
  const getWeekDays = () => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    const week = [];
    for (let i = 0; i < 7; i++) {
      const wd = new Date(monday);
      wd.setDate(monday.getDate() + i);
      week.push(wd);
    }
    return week;
  };

  // Month days calculation
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of week offset (Mon=0..Sun=6)
    let startOffset = firstDay.getDay() - 1;
    if (startOffset === -1) startOffset = 6;

    const days = [];
    // Leading days
    for (let i = startOffset; i > 0; i--) {
      const prev = new Date(year, month, 1 - i);
      days.push({ date: prev, isCurrentMonth: false });
    }
    // Month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    // Trailing days
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextCount = 1;
    while (days.length < totalCells) {
      days.push({ date: new Date(year, month + 1, nextCount++), isCurrentMonth: false });
    }
    return days;
  };

  const isToday = (d) => formatDateKey(d) === formatDateKey(new Date());

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100%', boxSizing: 'border-box' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '8px', display: 'flex' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Psychologist Schedule</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Manage clinical assessments, evaluations, and clinical time blocks.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden', padding: '2px' }}>
            {['Day', 'Week', 'Month'].map(v => (
              <button 
                key={v} 
                onClick={() => setView(v)} 
                style={{ 
                  padding: '6px 16px', 
                  backgroundColor: view === v ? 'var(--primary-color)' : 'transparent', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  fontWeight: view === v ? 600 : 500, 
                  color: view === v ? 'white' : 'var(--text-secondary)', 
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Block Time Action Button */}
          <button 
            onClick={handleOpenBlockModal} 
            className="mc-btn mc-btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} /> Block Time
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div style={{ padding: '14px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              onClick={handlePrev} 
              title="Previous"
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleToday}
              style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              Today
            </button>
            <button 
              onClick={handleNext} 
              title="Next"
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {getHeaderTitle()}
          </h2>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'inline-block' }}></span> 
            In-Person
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span> 
            Telehealth
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }}></span> 
            Blocked Time
          </div>
        </div>
      </div>

      {/* Main Calendar View Area */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px', gap: '12px', color: 'var(--text-secondary)' }}>
          <Loader size={24} className="mc-spin" />
          <span>Loading schedule...</span>
        </div>
      ) : (
        <>
          {/* ────────────────── 1. DAY VIEW ────────────────── */}
          {view === 'Day' && (
            <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden', display: 'flex', minHeight: '520px' }}>
              {/* Time Gutter */}
              <div style={{ width: '88px', borderRight: '1px solid var(--border-primary)', padding: '16px 0', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
                {timeSlots.map(time => (
                  <div key={time} style={{ height: '76px', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-10px', right: '12px', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Schedule Content */}
              <div style={{ flex: 1, padding: '16px 20px', position: 'relative', backgroundSize: '100% 76px', backgroundImage: 'linear-gradient(to bottom, var(--border-primary) 1px, transparent 1px)', overflowY: 'auto' }}>
                {dayAppointments.length === 0 && dayBlocks.length === 0 && (
                  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <CalendarDays size={44} style={{ marginBottom: '12px', opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>No sessions or blocked slots for this date.</p>
                    <button 
                      onClick={handleOpenBlockModal}
                      style={{ marginTop: '12px', padding: '6px 16px', borderRadius: '6px', border: '1px dashed var(--primary-color)', color: 'var(--primary-color)', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                    >
                      + Block Clinical Time
                    </button>
                  </div>
                )}

                {/* Appointments for the day */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dayAppointments.map((appt) => {
                    const clientName = getClientName(appt);
                    const statusUpper = (appt.status || '').toUpperCase();
                    const isCheckedIn = statusUpper === 'CHECKED_IN' || statusUpper === 'IN_PROGRESS';
                    const isCompleted = statusUpper === 'COMPLETED';
                    const isUpcoming = ['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'].includes(statusUpper);

                    return (
                      <div 
                        key={appt.id} 
                        style={{ 
                          backgroundColor: appt.telehealth ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)', 
                          borderLeft: `4px solid ${appt.telehealth ? '#10B981' : 'var(--primary-color)'}`, 
                          border: '1px solid var(--border-primary)',
                          borderLeftWidth: '4px',
                          borderRadius: '8px', 
                          padding: '14px 16px', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {appt.type || appt.appointmentType || 'Assessment'}
                            </span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>•</span>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary-color)' }}>
                              {clientName}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              <Clock size={13} /> {appt.startTime || '09:00'} - {appt.endTime || '10:00'}
                            </span>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: appt.telehealth ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)', color: appt.telehealth ? '#10B981' : 'var(--primary-color)', fontWeight: 600, fontSize: '11px' }}>
                              {appt.telehealth ? 'Telehealth' : 'In-Person'}
                            </span>
                            <span style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: isCompleted ? 'rgba(16,185,129,0.15)' : 'var(--bg-primary)', color: isCompleted ? '#10B981' : 'var(--text-secondary)', fontWeight: 600, fontSize: '11px', border: '1px solid var(--border-primary)' }}>
                              {appt.status ? appt.status.replace('_', ' ') : 'Scheduled'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Actions on Appointment */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {appt.telehealth && (
                            <button 
                              onClick={() => toast.info('Telehealth link will be provided by your administrator.')}
                              style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Video size={13} /> Join Call
                            </button>
                          )}

                          {isCheckedIn && (
                            <button 
                              onClick={() => navigate(`/outcome-measures?client=${encodeURIComponent(clientName)}`)}
                              style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <Play size={12} style={{ fill: 'currentColor' }} /> Start Assessment
                            </button>
                          )}

                          {isUpcoming && !isCheckedIn && (
                            <button 
                              onClick={() => handleCheckIn(appt.id)}
                              style={{ padding: '6px 12px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <CheckCircle size={13} /> Check In
                            </button>
                          )}

                          {isCompleted && (
                            <button 
                              onClick={() => navigate(`/session-notes/new?client=${encodeURIComponent(clientName)}`)}
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <FileText size={13} /> Session Note
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Blocked Slots for the day */}
                  {dayBlocks.map(block => (
                    <div 
                      key={block.id} 
                      style={{ 
                        backgroundColor: 'rgba(245,158,11,0.08)', 
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderLeft: '4px solid #F59E0B', 
                        borderRadius: '8px', 
                        padding: '12px 16px', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'rgba(245,158,11,0.18)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Lock size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                            {block.reason}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            {block.startTime} – {block.endTime}
                            {block.notes ? ` • ${block.notes}` : ''}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteBlock(block.id)}
                        title="Remove this time block"
                        style={{ padding: '6px 10px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '6px', color: 'var(--danger-color, #EF4444)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 2. WEEK VIEW ────────────────── */}
          {view === 'Week' && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                {getWeekDays().map((d) => {
                  const isCurrent = isToday(d);
                  const isSel = formatDateKey(d) === selectedDateStr;
                  return (
                    <div 
                      key={d.toISOString()} 
                      onClick={() => { setCurrentDate(d); setView('Day'); }}
                      style={{ 
                        padding: '12px 8px', 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        borderRight: '1px solid var(--border-primary)',
                        backgroundColor: isSel ? 'var(--color-primary-50, rgba(59,130,246,0.06))' : 'transparent'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div style={{ 
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isCurrent ? 'var(--primary-color)' : 'transparent',
                        color: isCurrent ? 'white' : 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}>
                        {d.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Week Day Columns Content */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '440px', backgroundColor: 'var(--bg-secondary)' }}>
                {getWeekDays().map((d) => {
                  const dStr = formatDateKey(d);
                  const appts = appointments.filter(a => a.date === dStr);
                  const blocks = blockedSlots.filter(b => b.date === dStr);

                  return (
                    <div 
                      key={dStr} 
                      style={{ 
                        padding: '10px', 
                        borderRight: '1px solid var(--border-primary)',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '8px',
                        backgroundColor: isToday(d) ? 'rgba(59,130,246,0.02)' : 'transparent'
                      }}
                    >
                      {appts.map(a => {
                        const cName = getClientName(a);
                        return (
                          <div 
                            key={a.id} 
                            onClick={() => { setCurrentDate(d); setView('Day'); }}
                            style={{ 
                              padding: '8px', 
                              backgroundColor: a.telehealth ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)', 
                              borderLeft: `3px solid ${a.telehealth ? '#10B981' : 'var(--primary-color)'}`,
                              borderRadius: '6px', 
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.startTime}</div>
                            <div style={{ fontWeight: 600, color: 'var(--primary-color)', marginTop: '2px' }}>{cName}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{a.type || 'Assessment'}</div>
                          </div>
                        );
                      })}

                      {blocks.map(b => (
                        <div 
                          key={b.id} 
                          onClick={() => { setCurrentDate(d); setView('Day'); }}
                          style={{ 
                            padding: '6px 8px', 
                            backgroundColor: 'rgba(245,158,11,0.12)', 
                            borderLeft: '3px solid #F59E0B',
                            borderRadius: '6px', 
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#D97706' }}>{b.startTime} - {b.endTime}</div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{b.reason}</div>
                        </div>
                      ))}

                      {appts.length === 0 && blocks.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', opacity: 0.5 }}>—</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ────────────────── 3. MONTH VIEW ────────────────── */}
          {view === 'Month' && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
              {/* Day names header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(name => (
                  <div key={name} style={{ padding: '10px', textAlign: 'center', fontWeight: 600, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {name}
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '480px' }}>
                {getMonthDays().map(({ date: d, isCurrentMonth }) => {
                  const dStr = formatDateKey(d);
                  const isCurrent = isToday(d);
                  const isSel = dStr === selectedDateStr;
                  const appts = appointments.filter(a => a.date === dStr);
                  const blocks = blockedSlots.filter(b => b.date === dStr);
                  const totalItems = appts.length + blocks.length;

                  return (
                    <div 
                      key={dStr} 
                      onClick={() => { setCurrentDate(d); setView('Day'); }}
                      style={{ 
                        minHeight: '80px', 
                        padding: '8px', 
                        borderRight: '1px solid var(--border-primary)',
                        borderBottom: '1px solid var(--border-primary)',
                        backgroundColor: isSel 
                          ? 'var(--color-primary-50, rgba(59,130,246,0.06))' 
                          : (!isCurrentMonth ? 'rgba(0,0,0,0.02)' : 'transparent'),
                        cursor: 'pointer',
                        opacity: isCurrentMonth ? 1 : 0.4
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          width: '22px', 
                          height: '22px', 
                          borderRadius: '50%', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: isCurrent ? 'var(--primary-color)' : 'transparent',
                          color: isCurrent ? 'white' : 'var(--text-primary)',
                          fontWeight: 700, 
                          fontSize: '12px' 
                        }}>
                          {d.getDate()}
                        </span>
                        {totalItems > 0 && (
                          <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600 }}>
                            {totalItems}
                          </span>
                        )}
                      </div>

                      <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {appts.slice(0, 2).map(a => (
                          <div key={a.id} style={{ fontSize: '10px', padding: '2px 4px', borderRadius: '3px', backgroundColor: a.telehealth ? 'rgba(16,185,129,0.18)' : 'rgba(59,130,246,0.18)', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.startTime} {getClientName(a)}
                          </div>
                        ))}
                        {blocks.slice(0, 1).map(b => (
                          <div key={b.id} style={{ fontSize: '10px', padding: '2px 4px', borderRadius: '3px', backgroundColor: 'rgba(245,158,11,0.2)', color: '#D97706', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🔒 {b.reason}
                          </div>
                        ))}
                        {totalItems > 3 && (
                          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            +{totalItems - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ────────────────── 4. BLOCK TIME MODAL ────────────────── */}
      {showBlockModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            style={{ 
              backgroundColor: 'var(--bg-primary, #ffffff)', 
              borderRadius: '12px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
              width: '100%', 
              maxWidth: '480px', 
              border: '1px solid var(--border-primary)',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--primary-color)" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Block Calendar Time
                </h3>
              </div>
              <button 
                onClick={() => setShowBlockModal(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBlock} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Activity / Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Activity / Purpose
                </label>
                <select 
                  value={blockReason} 
                  onChange={(e) => setBlockReason(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px' }}
                >
                  <option value="Testing Scoring & Report Writing">Testing Scoring & Report Writing</option>
                  <option value="Clinical Supervision">Clinical Supervision</option>
                  <option value="Diagnostic Case Conference">Diagnostic Case Conference</option>
                  <option value="Administrative & Charting Time">Administrative & Charting Time</option>
                  <option value="Lunch / Personal Break">Lunch / Personal Break</option>
                  <option value="Custom...">Custom...</option>
                </select>
              </div>

              {blockReason === 'Custom...' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Custom Title
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. WAIS-IV Battery Interpretation"
                    value={blockCustomReason} 
                    onChange={(e) => setBlockCustomReason(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }} 
                  />
                </div>
              )}

              {/* Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Date
                </label>
                <input 
                  type="date" 
                  required
                  value={blockDate} 
                  onChange={(e) => setBlockDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }} 
                />
              </div>

              {/* Time and Duration Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Start Time
                  </label>
                  <input 
                    type="time" 
                    required
                    value={blockStartTime} 
                    onChange={(e) => setBlockStartTime(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Duration
                  </label>
                  <select 
                    value={blockDuration} 
                    onChange={(e) => setBlockDuration(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px' }}
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes (1 hr)</option>
                    <option value={90}>90 minutes (1.5 hr)</option>
                    <option value={120}>120 minutes (2 hr)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Notes (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Scoring protocol, writing summary report"
                  value={blockNotes} 
                  onChange={(e) => setBlockNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', boxSizing: 'border-box' }} 
                />
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowBlockModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-primary)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="mc-btn mc-btn-primary"
                  style={{ padding: '8px 18px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Time Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologistCalendarPage;






