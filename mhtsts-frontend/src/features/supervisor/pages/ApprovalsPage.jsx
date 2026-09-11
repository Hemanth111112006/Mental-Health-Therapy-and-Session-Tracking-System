import React, { useState, useMemo, useEffect } from 'react';
import {
  BadgeCheck, Search, Filter, Download, Clock,
  CheckCircle2, XCircle, Eye, MoreVertical, FileText,
  AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, Printer, Check, X
} from 'lucide-react';
import { toast } from '../../../utils/toast';

const INITIAL_APPROVALS = [
  {
    id: 'APR-001', type: 'Treatment Plan', title: 'CBT Treatment Plan — Sarah Mitchell',
    submittedBy: 'Dr. Emily Carter', role: 'Therapist', submittedDate: '2024-07-12',
    client: 'Sarah Mitchell', clientId: 'CLT-1042', priority: 'Normal',
    status: 'Pending', description: '12-week CBT protocol for generalized anxiety disorder. Includes exposure therapy and cognitive restructuring.',
    feedback: ''
  },
  {
    id: 'APR-002', type: 'Session Note', title: 'Session Note #47 — James Rodriguez',
    submittedBy: 'Dr. Alan Brooks', role: 'Psychiatrist', submittedDate: '2024-07-12',
    client: 'James Rodriguez', clientId: 'CLT-1078', priority: 'High',
    status: 'Pending', description: 'Medication adjustment note. Changed dosage from 20mg to 40mg sertraline due to insufficient response.',
    feedback: ''
  },
  {
    id: 'APR-003', type: 'Safety Plan', title: 'Crisis Safety Plan — Angela Thompson',
    submittedBy: 'Dr. Emily Carter', role: 'Therapist', submittedDate: '2024-07-11',
    client: 'Angela Thompson', clientId: 'CLT-1155', priority: 'Urgent',
    status: 'Pending', description: 'Updated safety plan following PHQ-9 score of 22. Includes emergency contacts and crisis intervention steps.',
    feedback: ''
  },
  {
    id: 'APR-004', type: 'Treatment Plan', title: 'DBT Skills Group — Maria Gonzalez',
    submittedBy: 'Dr. Lisa Patel', role: 'Psychologist', submittedDate: '2024-07-10',
    client: 'Maria Gonzalez', clientId: 'CLT-1103', priority: 'Normal',
    status: 'Approved', description: 'Enrollment in 8-week DBT skills group therapy program for emotional regulation.',
    feedback: 'Approved without modifications. Objectives align with treatment goals.'
  },
  {
    id: 'APR-005', type: 'Discharge Summary', title: 'Discharge Summary — Patricia Nguyen',
    submittedBy: 'Dr. Emily Carter', role: 'Therapist', submittedDate: '2024-07-09',
    client: 'Patricia Nguyen', clientId: 'CLT-0943', priority: 'Normal',
    status: 'Approved', description: 'Treatment completed. Patient met all therapeutic goals. Transitioning to maintenance phase.',
    feedback: 'Discharge summary signed and archived.'
  },
  {
    id: 'APR-006', type: 'Session Note', title: 'Session Note #12 — Robert Chen',
    submittedBy: 'Dr. Lisa Patel', role: 'Psychologist', submittedDate: '2024-07-09',
    client: 'Robert Chen', clientId: 'CLT-0876', priority: 'Normal',
    status: 'Rejected', description: 'Couples therapy session note — requires additional detail on intervention strategies used.',
    feedback: 'Please document specific Gottman method communication exercises practiced.'
  },
];

const statusConfig = {
  'Pending': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'Approved': { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'Rejected': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const priorityConfig = {
  'Normal': { color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  'High': { color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  'Urgent': { color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
};

const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState(() => {
    try {
      const saved = localStorage.getItem('mindcare_approvals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_APPROVALS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modals
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [feedbackModalItem, setFeedbackModalItem] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Persist to storage
  useEffect(() => {
    try {
      localStorage.setItem('mindcare_approvals', JSON.stringify(approvals));
    } catch (e) {}
  }, [approvals]);

  const stats = useMemo(() => ({
    pending: approvals.filter(a => a.status === 'Pending').length,
    approved: approvals.filter(a => a.status === 'Approved').length,
    rejected: approvals.filter(a => a.status === 'Rejected').length,
    urgent: approvals.filter(a => a.priority === 'Urgent' && a.status === 'Pending').length,
  }), [approvals]);

  const filtered = useMemo(() => {
    return approvals.filter(a => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || 
        a.title.toLowerCase().includes(q) || 
        a.submittedBy.toLowerCase().includes(q) ||
        a.client.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [approvals, searchTerm, statusFilter]);

  const handleApprove = (id) => {
    const item = approvals.find(a => a.id === id);
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved', approvedAt: new Date().toISOString() } : a));
    toast.success(`Approved: ${item?.title || id} has been co-signed`);
  };

  const handleOpenReject = (item) => {
    setRejectModalItem(item);
    setRejectReason('Requires additional clinical documentation detail before co-signature can be granted.');
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectModalItem) return;

    setApprovals(prev => prev.map(a => 
      a.id === rejectModalItem.id 
        ? { ...a, status: 'Rejected', feedback: rejectReason.trim(), rejectedAt: new Date().toISOString() } 
        : a
    ));
    toast.warn(`Rejected: Revisions requested for ${rejectModalItem.title}`);
    setRejectModalItem(null);
  };

  const handleOpenFeedback = (item) => {
    setFeedbackModalItem(item);
    setFeedbackText(item.feedback || '');
  };

  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!feedbackModalItem) return;

    setApprovals(prev => prev.map(a => 
      a.id === feedbackModalItem.id ? { ...a, feedback: feedbackText.trim() } : a
    ));
    toast.success(`Supervisor feedback logged for ${feedbackModalItem.id}`);
    setFeedbackModalItem(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Title', 'Client', 'Submitted By', 'Role', 'Date', 'Priority', 'Status', 'Feedback'];
    const rows = filtered.map(a => [
      a.id,
      `"${a.type}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.client}"`,
      `"${a.submittedBy}"`,
      `"${a.role}"`,
      a.submittedDate,
      a.priority,
      a.status,
      `"${(a.feedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MindCare_Supervision_Approvals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Approvals CSV exported successfully');
  };

  const statCards = [
    { label: 'Pending Review', value: stats.pending, icon: <Clock size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle2 size={20} />, color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
    { label: 'Urgent Items', value: stats.urgent, icon: <AlertTriangle size={20} />, color: '#dc2626', bg: 'rgba(220,38,38,0.10)' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Supervisor</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Approvals</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BadgeCheck size={24} style={{ color: '#10b981' }} /> Approvals Queue
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review and co-sign treatment plans, clinical session notes, crisis safety plans, and discharge summaries
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="mc-btn mc-btn-outline" 
            onClick={() => window.print()}
            style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Print
          </button>
          <button 
            className="mc-btn mc-btn-primary" 
            onClick={handleExportCSV}
            style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
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

      {/* Filter and Search Bar */}
      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search approvals by title, supervisee clinician, or patient name..." 
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
          <option value="All">All Statuses ({approvals.length})</option>
          <option value="Pending">Pending ({stats.pending})</option>
          <option value="Approved">Approved ({stats.approved})</option>
          <option value="Rejected">Rejected ({stats.rejected})</option>
        </select>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length} of {approvals.length} requests
        </span>
      </div>

      {/* Approvals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="mc-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <BadgeCheck size={36} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>No approval records match filters</h3>
            <p style={{ margin: 0, fontSize: 12 }}>Try adjusting your search criteria or clear status filters.</p>
          </div>
        ) : filtered.map(a => (
          <div 
            key={a.id} 
            className="mc-card" 
            style={{ padding: '18px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)', transition: 'box-shadow 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 4 }}>
                    {a.id}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 600, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                    {a.type}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, color: priorityConfig[a.priority]?.color, background: priorityConfig[a.priority]?.bg }}>
                    {a.priority === 'Urgent' && <AlertTriangle size={9} style={{ marginRight: '3px', verticalAlign: 'middle' }} />}
                    {a.priority}
                  </span>
                </div>

                <h3 
                  onClick={() => setSelectedApproval(a)}
                  style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0', cursor: 'pointer' }}
                >
                  {a.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                  {a.description}
                </p>

                {a.feedback && (
                  <div style={{ marginBottom: 10, padding: '8px 12px', background: a.status === 'Rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', borderRadius: 6, fontSize: 11, color: a.status === 'Rejected' ? '#b91c1c' : '#047857' }}>
                    <strong>Supervisor Feedback:</strong> {a.feedback}
                  </div>
                )}

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>Submitted by: <strong style={{ color: 'var(--text-primary)' }}>{a.submittedBy}</strong> ({a.role})</span>
                  <span>Date: {a.submittedDate}</span>
                  <span>Client: {a.client} ({a.clientId})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, color: statusConfig[a.status]?.color, background: statusConfig[a.status]?.bg }}>
                  {a.status}
                </span>

                {a.status === 'Pending' ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="mc-btn mc-btn-primary" 
                      onClick={() => handleApprove(a.id)}
                      style={{ padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', background: '#10b981', border: 'none' }}
                    >
                      <ThumbsUp size={12} /> Approve
                    </button>
                    <button 
                      className="mc-btn mc-btn-outline" 
                      onClick={() => handleOpenReject(a)}
                      style={{ padding: '6px 14px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      <ThumbsDown size={12} /> Reject
                    </button>
                    <button 
                      className="mc-btn mc-btn-ghost" 
                      onClick={() => handleOpenFeedback(a)}
                      title="Add Clinical Comment"
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="mc-btn mc-btn-ghost" 
                      onClick={() => setSelectedApproval(a)}
                      style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={13} /> View Record
                    </button>
                    <button 
                      className="mc-btn mc-btn-ghost" 
                      onClick={() => handleOpenFeedback(a)}
                      title="Update Feedback"
                      style={{ padding: '6px 8px', fontSize: '11px' }}
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL: Request Revisions / Reject ── */}
      {rejectModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 520, padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#ef4444' }}>
                  Request Revisions / Reject Documentation
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {rejectModalItem.title}
                </div>
              </div>
              <button onClick={() => setRejectModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReject} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 8 }}>
                <strong>Clinician:</strong> {rejectModalItem.submittedBy} ({rejectModalItem.role})
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Rejection Reason & Required Revisions <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  required
                  placeholder="Specify clinical deficiencies, missing ICD-10 criteria, or required edits..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setRejectModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ background: '#ef4444', borderColor: '#ef4444' }}>
                  Submit Rejection & Notify Clinician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Clinical Feedback / Comment ── */}
      {feedbackModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 500, padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                  Supervisor Clinical Notes & Feedback
                </h3>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {feedbackModalItem.id}: {feedbackModalItem.title}
                </div>
              </div>
              <button onClick={() => setFeedbackModalItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFeedback} style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
                  Supervisor Guidance Notes
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Enter supervisory comments, coaching recommendations, or audit notes..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setFeedbackModalItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary">
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: View Approval Record Details ── */}
      {selectedApproval && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: 26, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 800, background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 4 }}>
                    {selectedApproval.id}
                  </span>
                  <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: statusConfig[selectedApproval.status]?.color, background: statusConfig[selectedApproval.status]?.bg }}>
                    {selectedApproval.status}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                  {selectedApproval.title}
                </h3>
              </div>
              <button onClick={() => setSelectedApproval(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: 14, fontSize: 12 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><strong>Patient:</strong> {selectedApproval.client} ({selectedApproval.clientId})</div>
                <div><strong>Submitted By:</strong> {selectedApproval.submittedBy} ({selectedApproval.role})</div>
                <div><strong>Document Type:</strong> {selectedApproval.type}</div>
                <div><strong>Submission Date:</strong> {selectedApproval.submittedDate}</div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Clinical Summary & Goals
                </label>
                <div style={{ padding: '14px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)' }}>
                  {selectedApproval.description}
                </div>
              </div>

              {selectedApproval.feedback && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Supervisor Attestation / Comments
                  </label>
                  <div style={{ padding: '12px', background: selectedApproval.status === 'Rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }}>
                    {selectedApproval.feedback}
                  </div>
                </div>
              )}

              {selectedApproval.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-primary)', paddingTop: 14 }}>
                  <button 
                    className="mc-btn mc-btn-primary" 
                    onClick={() => {
                      handleApprove(selectedApproval.id);
                      setSelectedApproval(prev => ({ ...prev, status: 'Approved' }));
                    }}
                    style={{ flex: 1, background: '#10b981', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Check size={14} /> Approve & Co-Sign
                  </button>
                  <button 
                    className="mc-btn mc-btn-outline" 
                    onClick={() => {
                      const item = selectedApproval;
                      setSelectedApproval(null);
                      handleOpenReject(item);
                    }}
                    style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <X size={14} /> Request Revisions
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;
