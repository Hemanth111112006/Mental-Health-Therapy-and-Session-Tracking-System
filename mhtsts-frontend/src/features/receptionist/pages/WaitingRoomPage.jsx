import React, { useState, useMemo } from 'react';
import {
  Armchair, Search, Filter, RefreshCcw, Download, Printer,
  Clock, UserCheck, Activity, CheckCircle2, AlertTriangle,
  Phone, Eye, CalendarX2, ArrowRight, MoreVertical, Timer,
  Users, Stethoscope, Brain, Pill, Plus, X
} from 'lucide-react';

const INITIAL_QUEUE = [
  {
    id: 1, queueNo: 'Q-001', clientName: 'Jordan Taylor', clientId: 'CLN-A3A86311',
    appointmentTime: '09:00 AM', provider: 'Dr. Sarah Chen, LCSW', providerType: 'Therapist',
    checkInTime: '08:48 AM', waitingDuration: '14 min', priority: 'Normal',
    status: 'Waiting', visitType: 'Individual Therapy', insurance: 'Blue Cross Blue Shield',
    room: 'Room 204'
  },
  {
    id: 2, queueNo: 'Q-002', clientName: 'Alex Rivers', clientId: 'CLN-62E695F3',
    appointmentTime: '09:30 AM', provider: 'Dr. Emily Chen, PsyD', providerType: 'Psychologist',
    checkInTime: '09:12 AM', waitingDuration: '8 min', priority: 'Urgent',
    status: 'Waiting', visitType: 'Psychological Assessment', insurance: 'Aetna Health',
    room: 'Room 108'
  },
  {
    id: 3, queueNo: 'Q-003', clientName: 'Taylor Morgan', clientId: 'CLN-3CD50763',
    appointmentTime: '10:00 AM', provider: 'Dr. Michael Thompson, MD', providerType: 'Psychiatrist',
    checkInTime: '09:55 AM', waitingDuration: '3 min', priority: 'High',
    status: 'Checked In', visitType: 'Medication Review', insurance: 'United Healthcare',
    room: 'Room 301'
  },
  {
    id: 4, queueNo: 'Q-004', clientName: 'Casey Harper', clientId: 'CLN-9ABFFDAC',
    appointmentTime: '08:30 AM', provider: 'Dr. James Rodriguez, LMFT', providerType: 'Therapist',
    checkInTime: '08:20 AM', waitingDuration: '-', priority: 'Normal',
    status: 'In Session', visitType: 'Family Psychotherapy', insurance: 'Cigna Health',
    room: 'Suite 202'
  },
  {
    id: 5, queueNo: 'Q-005', clientName: 'Jordan Taylor', clientId: 'CLN-A3A86311',
    appointmentTime: '11:00 AM', provider: 'Dr. Sarah Chen, LCSW', providerType: 'Therapist',
    checkInTime: null, waitingDuration: '-', priority: 'Normal',
    status: 'Scheduled', visitType: 'Follow-up Session', insurance: 'Blue Cross Blue Shield',
    room: 'Room 204'
  }
];

const statusConfig = {
  'Scheduled': { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  'Checked In': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'Waiting': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'Called': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'In Session': { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Completed': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  'No Show': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const priorityConfig = {
  'Normal': { color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  'High': { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  'Urgent': { color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
};

const providerIcons = {
  'Therapist': <Stethoscope size={12} />,
  'Psychiatrist': <Pill size={12} />,
  'Psychologist': <Brain size={12} />,
};

const WaitingRoomPage = () => {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [bannerAlert, setBannerAlert] = useState(null);
  
  // Walk-in modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    clientId: 'CLN-A3A86311',
    clientName: 'Jordan Taylor',
    provider: 'Dr. Sarah Chen, LCSW',
    providerType: 'Therapist',
    visitType: 'Walk-In Consultation',
    priority: 'Normal',
    insurance: 'Blue Cross Blue Shield',
    room: 'Room 204'
  });

  const stats = useMemo(() => {
    const waiting = queue.filter(q => q.status === 'Waiting' || q.status === 'Called').length;
    const checkedIn = queue.filter(q => q.status === 'Checked In').length;
    const inSession = queue.filter(q => q.status === 'In Session').length;
    const completed = queue.filter(q => q.status === 'Completed').length;
    const avgWait = '11 min';
    const urgentCount = queue.filter(q => q.priority === 'Urgent' || q.priority === 'High').length;
    return { waiting, checkedIn, inSession, completed, avgWait, urgentCount };
  }, [queue]);

  const filtered = useMemo(() => {
    return queue.filter(q => {
      const matchSearch = !searchTerm || q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || q.clientId.toLowerCase().includes(searchTerm.toLowerCase()) || q.queueNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || q.priority === priorityFilter;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [queue, searchTerm, statusFilter, priorityFilter]);

  const statCards = [
    { label: 'Patients Waiting', value: stats.waiting, icon: <Clock size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
    { label: 'Checked In', value: stats.checkedIn, icon: <UserCheck size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
    { label: 'In Session', value: stats.inSession, icon: <Activity size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { label: 'Completed Today', value: stats.completed, icon: <CheckCircle2 size={20} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.10)' },
    { label: 'Avg Wait Time', value: stats.avgWait, icon: <Timer size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
    { label: 'Priority / Urgent', value: stats.urgentCount, icon: <AlertTriangle size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  ];

  // Actions
  const handleCheckIn = (id) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'Waiting', checkInTime: timeNow, waitingDuration: '1 min' } : q));
    const target = queue.find(q => q.id === id);
    setBannerAlert(`Checked in ${target?.clientName}. Added to waiting lobby.`);
    setTimeout(() => setBannerAlert(null), 4000);
  };

  const handleCall = (id) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'Called' } : q));
    const target = queue.find(q => q.id === id);
    setBannerAlert(`Paging ${target?.clientName}: Please proceed to ${target?.room || 'consultation room'} (${target?.provider})`);
    setTimeout(() => setBannerAlert(null), 5000);
  };

  const handleStart = (id) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'In Session', waitingDuration: '-' } : q));
    const target = queue.find(q => q.id === id);
    setBannerAlert(`Session started for ${target?.clientName} with ${target?.provider}.`);
    setTimeout(() => setBannerAlert(null), 4000);
  };

  const handleComplete = (id) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'Completed' } : q));
    const target = queue.find(q => q.id === id);
    setBannerAlert(`Completed visit for ${target?.clientName}.`);
    setTimeout(() => setBannerAlert(null), 4000);
  };

  const handleAddWalkInSubmit = (e) => {
    e.preventDefault();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntryObj = {
      id: queue.length + 1,
      queueNo: `Q-00${queue.length + 1}`,
      clientName: newEntry.clientName,
      clientId: newEntry.clientId,
      appointmentTime: 'Walk-In',
      provider: newEntry.provider,
      providerType: newEntry.providerType,
      checkInTime: timeNow,
      waitingDuration: '0 min',
      priority: newEntry.priority,
      status: 'Waiting',
      visitType: newEntry.visitType,
      insurance: newEntry.insurance,
      room: newEntry.room
    };
    setQueue([newEntryObj, ...queue]);
    setShowAddModal(false);
    setBannerAlert(`Walk-in added: ${newEntryObj.clientName} (Queue ${newEntryObj.queueNo}) is now waiting in the lobby.`);
    setTimeout(() => setBannerAlert(null), 5000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Reception</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Waiting Room Lobby</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Armchair size={24} style={{ color: '#f59e0b' }} /> Waiting Room Lobby &amp; Patient Flow
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time patient queue management, lobby paging, and consultation room dispatching
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="mc-btn mc-btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Plus size={14} /> Add Walk-In Arrival
          </button>
          <button className="mc-btn mc-btn-ghost" onClick={() => window.print()} style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Printer size={14} /> Print Queue
          </button>
        </div>
      </div>

      {/* Live Toast Banner */}
      {bannerAlert && (
        <div style={{ background: '#3b82f6', color: '#fff', padding: '10px 18px', borderRadius: '10px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600, boxShadow: '0 4px 12px rgba(59,130,246,0.3)', animation: 'fadeIn 0.2s ease' }}>
          <Phone size={16} />
          <span style={{ flex: 1 }}>{bannerAlert}</span>
          <button onClick={() => setBannerAlert(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={15} /></button>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {statCards.map((card, i) => (
          <div key={i} className="mc-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search queue by client name, ID, or queue number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)' }}>
            <option value="All">All Statuses</option>
            {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)' }}>
            <option value="All">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {queue.length} entries
        </div>
      </div>

      {/* Queue Table */}
      <div className="mc-card" style={{ borderRadius: '12px', overflow: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                {['Queue #', 'Client', 'Appointment', 'Provider & Room', 'Check-In', 'Waiting', 'Priority', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No patients match the current filters.</td></tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{q.queueNo}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{q.clientName}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{q.clientId} · {q.visitType}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-primary)', fontWeight: 500 }}>{q.appointmentTime}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {providerIcons[q.providerType]} {q.provider}
                      </div>
                      <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 600 }}>{q.room}</div>
                    </td>
                    <td style={{ padding: '10px 14px', color: q.checkInTime ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 500 }}>
                      {q.checkInTime || '—'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {q.waitingDuration !== '-' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: parseInt(q.waitingDuration) > 15 ? '#ef4444' : '#f59e0b', fontWeight: 600, fontSize: '11px' }}>
                          <Timer size={12} /> {q.waitingDuration}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: priorityConfig[q.priority]?.color, background: priorityConfig[q.priority]?.bg }}>
                        {q.priority === 'Urgent' && <AlertTriangle size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />}
                        {q.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: statusConfig[q.status]?.color, background: statusConfig[q.status]?.bg }}>
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {q.status === 'Scheduled' && (
                          <button 
                            title="Check In Patient" 
                            className="mc-btn mc-btn-primary" 
                            onClick={() => handleCheckIn(q.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                          >
                            <UserCheck size={12} /> Check In
                          </button>
                        )}
                        {(q.status === 'Waiting' || q.status === 'Checked In') && (
                          <button 
                            title="Call Patient" 
                            className="mc-btn mc-btn-primary" 
                            onClick={() => handleCall(q.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 3, background: '#8b5cf6' }}
                          >
                            <Phone size={12} /> Call
                          </button>
                        )}
                        {q.status === 'Called' && (
                          <button 
                            title="Start Session" 
                            className="mc-btn mc-btn-primary" 
                            onClick={() => handleStart(q.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 3, background: '#10b981' }}
                          >
                            <ArrowRight size={12} /> Start
                          </button>
                        )}
                        {q.status === 'In Session' && (
                          <button 
                            title="Complete Visit" 
                            className="mc-btn mc-btn-outline" 
                            onClick={() => handleComplete(q.id)}
                            style={{ padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 3, color: '#06b6d4', borderColor: '#06b6d4' }}
                          >
                            <CheckCircle2 size={12} /> Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-In Modal */}
      {showAddModal && (
        <div className="mc-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: 480, borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="mc-card-title" style={{ margin: 0, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={18} style={{ color: 'var(--color-primary)' }} /> Add Walk-In Patient Arrival
              </h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddWalkInSubmit} style={{ padding: 20 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Select Patient *</label>
                <select 
                  className="mc-form-select"
                  value={newEntry.clientId}
                  onChange={e => {
                    const id = e.target.value;
                    const names = {
                      'CLN-A3A86311': 'Jordan Taylor',
                      'CLN-62E695F3': 'Alex Rivers',
                      'CLN-9ABFFDAC': 'Casey Harper',
                      'CLN-3CD50763': 'Taylor Morgan'
                    };
                    setNewEntry({ ...newEntry, clientId: id, clientName: names[id] || 'Patient' });
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                >
                  <option value="CLN-A3A86311">Jordan Taylor (CLN-A3A86311)</option>
                  <option value="CLN-62E695F3">Alex Rivers (CLN-62E695F3)</option>
                  <option value="CLN-9ABFFDAC">Casey Harper (CLN-9ABFFDAC)</option>
                  <option value="CLN-3CD50763">Taylor Morgan (CLN-3CD50763)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Provider</label>
                  <select 
                    value={newEntry.provider}
                    onChange={e => {
                      const p = e.target.value;
                      let pType = 'Therapist';
                      let rm = 'Room 204';
                      if (p.includes('PsyD')) { pType = 'Psychologist'; rm = 'Room 108'; }
                      else if (p.includes('MD')) { pType = 'Psychiatrist'; rm = 'Room 301'; }
                      else if (p.includes('LMFT')) { pType = 'Therapist'; rm = 'Suite 202'; }
                      setNewEntry({ ...newEntry, provider: p, providerType: pType, room: rm });
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  >
                    <option value="Dr. Sarah Chen, LCSW">Dr. Sarah Chen, LCSW</option>
                    <option value="Dr. Emily Chen, PsyD">Dr. Emily Chen, PsyD</option>
                    <option value="Dr. Michael Thompson, MD">Dr. Michael Thompson, MD</option>
                    <option value="Dr. James Rodriguez, LMFT">Dr. James Rodriguez, LMFT</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Priority</label>
                  <select 
                    value={newEntry.priority}
                    onChange={e => setNewEntry({ ...newEntry, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / Crisis</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 5 }}>Visit Reason</label>
                <input 
                  type="text" required
                  value={newEntry.visitType}
                  onChange={e => setNewEntry({ ...newEntry, visitType: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={15} /> Add to Lobby Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitingRoomPage;
