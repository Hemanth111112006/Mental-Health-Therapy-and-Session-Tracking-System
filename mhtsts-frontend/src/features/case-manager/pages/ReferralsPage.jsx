import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowRightLeft, Search, Plus, Clock, CheckCircle2,
  XCircle, AlertTriangle, Eye, MoreVertical, Send,
  UserPlus, Phone, MapPin, Building, Printer, Trash2,
  Calendar, Check, X, ShieldAlert, FileText, User
} from 'lucide-react';
import { clientApi } from '../../../api/clientApi';
import { toast } from '../../../utils/toast';

const INITIAL_REFERRALS = [
  {
    id: 'REF-001', clientName: 'Sarah Mitchell', clientId: 'CLT-1042',
    referralDate: '2024-07-12', type: 'Internal', direction: 'Outgoing',
    referredTo: 'Dr. Alan Brooks (Psychiatrist)', referredFrom: 'Dr. Emily Carter (Therapist)',
    reason: 'Medication evaluation for treatment-resistant anxiety',
    status: 'Pending', priority: 'High', followUpDate: '2024-07-19',
    notes: 'Patient consented to psychiatric evaluation; initial intake paperwork sent.'
  },
  {
    id: 'REF-002', clientName: 'James Rodriguez', clientId: 'CLT-1078',
    referralDate: '2024-07-11', type: 'External', direction: 'Outgoing',
    referredTo: 'Metro Community Health Center', referredFrom: 'Case Management',
    reason: 'Housing assistance and social services support',
    status: 'Accepted', priority: 'Normal', followUpDate: '2024-07-18',
    notes: 'Application approved for county transitional housing subsidy.'
  },
  {
    id: 'REF-003', clientName: 'Maria Gonzalez', clientId: 'CLT-1103',
    referralDate: '2024-07-10', type: 'Internal', direction: 'Incoming',
    referredTo: 'Dr. Lisa Patel (Psychologist)', referredFrom: 'Primary Care — Dr. Johnson',
    reason: 'Neuropsychological assessment for cognitive concerns',
    status: 'In Progress', priority: 'Normal', followUpDate: '2024-07-17',
    notes: 'Cognitive testing battery session scheduled for Thursday 2 PM.'
  },
  {
    id: 'REF-004', clientName: 'Angela Thompson', clientId: 'CLT-1155',
    referralDate: '2024-07-09', type: 'External', direction: 'Outgoing',
    referredTo: 'Crisis Intervention Center', referredFrom: 'Dr. Emily Carter (Therapist)',
    reason: 'Acute crisis stabilization — elevated suicide risk',
    status: 'Completed', priority: 'Urgent', followUpDate: '2024-07-12',
    notes: 'Patient successfully stabilized, safety plan updated, returned to outpatient care.'
  },
  {
    id: 'REF-005', clientName: 'David Kim', clientId: 'CLT-0987',
    referralDate: '2024-07-08', type: 'External', direction: 'Outgoing',
    referredTo: 'Substance Abuse Recovery Network', referredFrom: 'Case Management',
    reason: 'Dual-diagnosis support — substance use and depression',
    status: 'Pending', priority: 'High', followUpDate: '2024-07-15',
    notes: 'Awaiting intake coordinator callback.'
  },
  {
    id: 'REF-006', clientName: 'Robert Chen', clientId: 'CLT-0876',
    referralDate: '2024-07-07', type: 'Internal', direction: 'Incoming',
    referredTo: 'Dr. Lisa Patel (Psychologist)', referredFrom: 'Employee Assistance Program',
    reason: 'Couples counseling — workplace stress impacting relationship',
    status: 'Declined', priority: 'Normal', followUpDate: null,
    notes: 'Client declined scheduling at this time due to scheduling conflicts.'
  },
];

const statusConfig = {
  'Pending': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'Accepted': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'In Progress': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
  'Completed': { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Declined': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const SUGGESTED_FACILITIES = [
  { name: 'Dr. Alan Brooks (Psychiatrist)', type: 'Internal' },
  { name: 'Dr. Lisa Patel (Psychologist)', type: 'Internal' },
  { name: 'Dr. Emily Carter (Therapist)', type: 'Internal' },
  { name: 'Dr. Mark Rivera, MD (Psychiatrist)', type: 'Internal' },
  { name: 'Metro Community Health Center', type: 'External' },
  { name: 'Safe Haven Housing Services', type: 'External' },
  { name: 'Workforce Development Center', type: 'External' },
  { name: 'Recovery Solutions Network', type: 'External' },
  { name: 'Crisis Intervention Center', type: 'External' },
  { name: 'Legal Aid Society', type: 'External' },
  { name: 'Family Support Alliance', type: 'External' },
];

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_referrals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved referrals', e);
    }
    return INITIAL_REFERRALS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clients, setClients] = useState([]);
  
  // Modals & Menu State
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // New Referral Form State
  const [newClient, setNewClient] = useState('');
  const [newType, setNewType] = useState('Internal');
  const [newDirection, setNewDirection] = useState('Outgoing');
  const [newReferredFrom, setNewReferredFrom] = useState('Case Management Desk');
  const [newReferredTo, setNewReferredTo] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newPriority, setNewPriority] = useState('Normal');
  const [newFollowUpDate, setNewFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [newNotes, setNewNotes] = useState('');

  // Persist to localStorage whenever referrals change
  useEffect(() => {
    try {
      localStorage.setItem('mindcare_referrals', JSON.stringify(referrals));
    } catch (e) {
      console.warn('Could not save referrals', e);
    }
  }, [referrals]);

  // Load clients for selector
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientList = await clientApi.getAllClients();
        setClients(clientList || []);
        if (clientList && clientList.length > 0) {
          const first = clientList[0];
          setNewClient(JSON.stringify({
            name: `${first.firstName} ${first.lastName}`.trim(),
            id: first.clientNumber || `CLT-${first.id}`
          }));
        }
      } catch (e) {
        console.warn('Error loading clients for referrals:', e);
      }
    };
    loadClients();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mc-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const stats = useMemo(() => ({
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'Pending').length,
    active: referrals.filter(r => ['Accepted', 'In Progress'].includes(r.status)).length,
    completed: referrals.filter(r => r.status === 'Completed').length,
  }), [referrals]);

  const filtered = useMemo(() => {
    return referrals.filter(r => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        r.clientName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.referredTo && r.referredTo.toLowerCase().includes(q)) ||
        (r.reason && r.reason.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [referrals, searchTerm, statusFilter]);

  const handleCreateReferral = (e) => {
    e.preventDefault();
    if (!newClient) {
      toast.error('Please select a client');
      return;
    }
    if (!newReferredTo.trim()) {
      toast.error('Please select or specify the recipient provider / organization');
      return;
    }
    if (!newReason.trim()) {
      toast.error('Please provide a reason for referral');
      return;
    }

    let clientData = { name: 'Unknown Client', id: 'CLT-0000' };
    try {
      clientData = JSON.parse(newClient);
    } catch (err) {
      clientData = { name: newClient, id: `CLT-${Math.floor(Math.random() * 8000 + 1000)}` };
    }

    const nextIdNum = referrals.reduce((max, r) => {
      const match = r.id.match(/\d+/);
      const val = match ? parseInt(match[0], 10) : 0;
      return val > max ? val : max;
    }, 0) + 1;

    const newRef = {
      id: `REF-${String(nextIdNum).padStart(3, '0')}`,
      clientName: clientData.name,
      clientId: clientData.id,
      referralDate: new Date().toISOString().split('T')[0],
      type: newType,
      direction: newDirection,
      referredTo: newReferredTo.trim(),
      referredFrom: newReferredFrom.trim(),
      reason: newReason.trim(),
      status: 'Pending',
      priority: newPriority,
      followUpDate: newFollowUpDate || null,
      notes: newNotes.trim()
    };

    setReferrals(prev => [newRef, ...prev]);
    setShowNewModal(false);
    setNewReason('');
    setNewNotes('');
    setNewReferredTo('');
    toast.success(`Referral ${newRef.id} created successfully`);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReferral && selectedReferral.id === id) {
      setSelectedReferral(prev => ({ ...prev, status: newStatus }));
    }
    toast.success(`Referral status changed to "${newStatus}"`);
    setOpenDropdownId(null);
  };

  const handleDeleteReferral = (id) => {
    if (window.confirm(`Are you sure you want to delete referral ${id}?`)) {
      setReferrals(prev => prev.filter(r => r.id !== id));
      if (selectedReferral && selectedReferral.id === id) setSelectedReferral(null);
      toast.info(`Referral ${id} removed`);
      setOpenDropdownId(null);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Case Management</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Referrals</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ArrowRightLeft size={24} style={{ color: '#8b5cf6' }} /> Care Referrals
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage client referrals, track clinical intake status, and coordinate care transitions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="mc-btn mc-btn-outline" 
            onClick={() => window.print()}
            style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Print Summary
          </button>
          <button 
            className="mc-btn mc-btn-primary" 
            onClick={() => setShowNewModal(true)}
            style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> New Referral
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Referrals', value: stats.total, icon: <ArrowRightLeft size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
          { label: 'Pending Review', value: stats.pending, icon: <Clock size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
          { label: 'Active Linkages', value: stats.active, icon: <Send size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
          { label: 'Completed Care', value: stats.completed, icon: <CheckCircle2 size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
        ].map((c, i) => (
          <div key={i} className="mc-card" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by client, ID, provider, or clinical reason..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }} 
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          <option value="All">All Statuses ({referrals.length})</option>
          {Object.keys(statusConfig).map(s => (
            <option key={s} value={s}>{s} ({referrals.filter(r => r.status === s).length})</option>
          ))}
        </select>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {referrals.length}
        </span>
      </div>

      {/* Referrals Table */}
      <div className="mc-card" style={{ borderRadius: '12px', overflow: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                {['ID', 'Client', 'Type', 'From', 'To', 'Reason', 'Priority', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <ArrowRightLeft size={36} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No referrals found</p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px' }}>Try clearing your search filters or create a new referral above.</p>
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr 
                  key={r.id} 
                  style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {r.id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.clientName}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{r.clientId}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, 
                      background: r.type === 'Internal' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', 
                      color: r.type === 'Internal' ? '#3b82f6' : '#8b5cf6' 
                    }}>
                      {r.type}
                    </span>
                    <span style={{ marginLeft: 4, fontSize: '9px', color: 'var(--text-secondary)' }}>
                      ({r.direction || 'Outgoing'})
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontSize: '11px' }}>
                    {r.referredFrom}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 600 }}>
                    {r.referredTo}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '11px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.reason}>
                    {r.reason}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ 
                      padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, 
                      color: r.priority === 'Urgent' ? '#ef4444' : r.priority === 'High' ? '#f59e0b' : '#10b981', 
                      background: r.priority === 'Urgent' ? 'rgba(239,68,68,0.1)' : r.priority === 'High' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)' 
                    }}>
                      {r.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ 
                      padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, 
                      color: statusConfig[r.status]?.color || '#6b7280', 
                      background: statusConfig[r.status]?.bg || 'rgba(107,114,128,0.1)' 
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div className="mc-dropdown-container" style={{ display: 'flex', gap: '6px', position: 'relative', alignItems: 'center' }}>
                      <button 
                        className="mc-btn mc-btn-ghost" 
                        onClick={() => setSelectedReferral(r)}
                        title="View Referral Details"
                        style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px', color: 'var(--color-primary)' }}
                      >
                        <Eye size={14} />
                      </button>

                      <button 
                        className="mc-btn mc-btn-ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === r.id ? null : r.id);
                        }}
                        title="Quick Actions"
                        style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === r.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: '100%', zIndex: 50,
                          background: 'var(--card-bg)', border: '1px solid var(--border-primary)',
                          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                          minWidth: '170px', padding: '6px 0', marginTop: '4px'
                        }}>
                          <div style={{ padding: '4px 12px', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            Update Status
                          </div>
                          <button 
                            onClick={() => handleUpdateStatus(r.id, 'Accepted')}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Check size={12} /> Mark Accepted
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(r.id, 'In Progress')}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Clock size={12} /> Mark In Progress
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(r.id, 'Completed')}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <CheckCircle2 size={12} /> Mark Completed
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(r.id, 'Declined')}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <XCircle size={12} /> Mark Declined
                          </button>
                          <div style={{ height: '1px', background: 'var(--border-primary)', margin: '4px 0' }} />
                          <button 
                            onClick={() => { setSelectedReferral(r); setOpenDropdownId(null); }}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Eye size={12} /> View Full Record
                          </button>
                          <button 
                            onClick={() => handleDeleteReferral(r.id)}
                            style={{ width: '100%', textAlign: 'left', padding: '6px 12px', background: 'none', border: 'none', fontSize: '11px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <Trash2 size={12} /> Delete Referral
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Create New Referral ── */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Create New Referral</h2>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Initiate an internal clinical or external community linkage</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewModal(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReferral} style={{ display: 'grid', gap: '16px' }}>
              {/* Client Selector */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Patient / Client <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  className="mc-input"
                  value={newClient}
                  onChange={e => setNewClient(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  {clients.length > 0 ? (
                    clients.map(c => {
                      const name = `${c.firstName} ${c.lastName}`.trim();
                      const code = c.clientNumber || `CLT-${c.id}`;
                      const val = JSON.stringify({ name, id: code });
                      return (
                        <option key={c.id} value={val}>
                          {name} ({code})
                        </option>
                      );
                    })
                  ) : (
                    <>
                      <option value={JSON.stringify({ name: 'Taylor Morgan', id: 'CLT-1089' })}>Taylor Morgan (CLT-1089)</option>
                      <option value={JSON.stringify({ name: 'Sarah Mitchell', id: 'CLT-1042' })}>Sarah Mitchell (CLT-1042)</option>
                      <option value={JSON.stringify({ name: 'James Rodriguez', id: 'CLT-1078' })}>James Rodriguez (CLT-1078)</option>
                      <option value={JSON.stringify({ name: 'Alex Rivers', id: 'CLT-1090' })}>Alex Rivers (CLT-1090)</option>
                      <option value={JSON.stringify({ name: 'Emma Johnson', id: 'CLT-2041' })}>Emma Johnson (CLT-2041)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Type and Direction */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Referral Type
                  </label>
                  <select 
                    value={newType} 
                    onChange={e => setNewType(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Internal">Internal (Specialty Clinician)</option>
                    <option value="External">External (Community Agency)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Direction
                  </label>
                  <select 
                    value={newDirection} 
                    onChange={e => setNewDirection(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Outgoing">Outgoing Referral</option>
                    <option value="Incoming">Incoming Referral</option>
                  </select>
                </div>
              </div>

              {/* Referred From & Referred To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Referred From
                  </label>
                  <input 
                    type="text" 
                    value={newReferredFrom} 
                    onChange={e => setNewReferredFrom(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Referred To (Provider/Agency) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    list="suggested-providers"
                    placeholder="Search or enter provider/facility..."
                    value={newReferredTo} 
                    onChange={e => setNewReferredTo(e.target.value)}
                    required
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                  <datalist id="suggested-providers">
                    {SUGGESTED_FACILITIES.map(f => (
                      <option key={f.name} value={f.name}>{f.type}</option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Reason for Referral */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Reason for Referral / Clinical Objectives <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea 
                  rows={3}
                  value={newReason}
                  onChange={e => setNewReason(e.target.value)}
                  placeholder="Describe client presenting issue, medical/social necessity, or transition goals..."
                  required
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              {/* Priority & Follow-up Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Priority Level
                  </label>
                  <select 
                    value={newPriority} 
                    onChange={e => setNewPriority(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <option value="Normal">Normal (Routine)</option>
                    <option value="High">High (Within 48-72h)</option>
                    <option value="Urgent">Urgent (Immediate/Crisis)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                    Target Follow-up Date
                  </label>
                  <input 
                    type="date"
                    value={newFollowUpDate} 
                    onChange={e => setNewFollowUpDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Clinical Notes / Coordination */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Case Notes / Authorization Details (Optional)
                </label>
                <textarea 
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Insurance pre-authorization numbers, client preferences, or contact details..."
                  style={{ width: '100%', padding: '9px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="mc-btn mc-btn-ghost" 
                  onClick={() => setShowNewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="mc-btn mc-btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Submit Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: View Referral Details ── */}
      {selectedReferral && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'monospace', fontWeight: 800, color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                    {selectedReferral.id}
                  </span>
                  <span style={{ 
                    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, 
                    color: statusConfig[selectedReferral.status]?.color, 
                    background: statusConfig[selectedReferral.status]?.bg 
                  }}>
                    {selectedReferral.status}
                  </span>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {selectedReferral.clientName}
                </h2>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Client ID: {selectedReferral.clientId}</div>
              </div>
              <button 
                onClick={() => setSelectedReferral(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Referral Type</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedReferral.type} ({selectedReferral.direction || 'Outgoing'})</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Priority</span>
                  <span style={{ 
                    fontWeight: 700,
                    color: selectedReferral.priority === 'Urgent' ? '#ef4444' : selectedReferral.priority === 'High' ? '#f59e0b' : '#10b981'
                  }}>
                    {selectedReferral.priority}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Initiated Date</span>
                  <span style={{ color: 'var(--text-primary)' }}>{selectedReferral.referralDate}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Follow-Up Due</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: selectedReferral.followUpDate ? 600 : 400 }}>
                    {selectedReferral.followUpDate || 'None specified'}
                  </span>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                  Care Transition Pathway
                </span>
                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>REFERRED FROM</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedReferral.referredFrom}</div>
                  </div>
                  <ArrowRightLeft size={16} style={{ color: '#8b5cf6', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>REFERRED TO</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedReferral.referredTo}</div>
                  </div>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                  Clinical Justification / Reason
                </span>
                <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {selectedReferral.reason}
                </div>
              </div>

              {selectedReferral.notes && (
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Coordination Notes
                  </span>
                  <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    {selectedReferral.notes}
                  </div>
                </div>
              )}

              {/* Status Updater Buttons */}
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-primary)', paddingTop: '14px' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  Update Referral Status
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Pending', 'Accepted', 'In Progress', 'Completed', 'Declined'].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedReferral.id, st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: selectedReferral.status === st ? `2px solid ${statusConfig[st]?.color}` : '1px solid var(--border-primary)',
                        background: selectedReferral.status === st ? statusConfig[st]?.bg : 'transparent',
                        color: selectedReferral.status === st ? statusConfig[st]?.color : 'var(--text-primary)'
                      }}
                    >
                      {selectedReferral.status === st && '✓ '}
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button 
                  className="mc-btn mc-btn-outline" 
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={13} /> Print
                </button>
                <button 
                  className="mc-btn mc-btn-primary" 
                  onClick={() => setSelectedReferral(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
