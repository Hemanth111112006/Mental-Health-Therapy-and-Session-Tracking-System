import React, { useState } from 'react';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { jsPDF } from 'jspdf';

// ── Seeded HIPAA-compliant audit log entries ───────────────────────────────────
const SEED_AUDIT_LOGS = [
  {
    id: 'AL-10041',
    timestamp: '2026-09-11T00:38:14Z',
    username: 'admin@mindcare.com',
    action: 'USER_LOGIN_SUCCESS',
    entityType: 'AUTH',
    entityId: '1',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10040',
    timestamp: '2026-09-10T23:51:02Z',
    username: 'therapist@mindcare.com',
    action: 'SESSION_NOTE_SIGNED',
    entityType: 'SESSION_NOTE',
    entityId: 'SN-4022',
    ipAddress: '192.168.1.104',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10039',
    timestamp: '2026-09-10T22:45:30Z',
    username: 'admin@mindcare.com',
    action: 'USER_ACCOUNT_PROVISIONED',
    entityType: 'USER',
    entityId: '9',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10038',
    timestamp: '2026-09-10T21:30:18Z',
    username: 'psychiatrist@mindcare.com',
    action: 'PHI_RECORD_ACCESSED',
    entityType: 'CLIENT_RECORD',
    entityId: 'MC-3021',
    ipAddress: '10.0.0.42',
    userAgent: 'Firefox 128',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10037',
    timestamp: '2026-09-10T20:12:55Z',
    username: 'admin@mindcare.com',
    action: 'RBAC_POLICY_UPDATED',
    entityType: 'ROLE',
    entityId: 'THERAPIST',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10036',
    timestamp: '2026-09-10T19:55:40Z',
    username: 'psychologist@mindcare.com',
    action: 'OUTCOME_MEASURE_SAVED',
    entityType: 'OUTCOME_MEASURE',
    entityId: 'OM-8812',
    ipAddress: '192.168.1.103',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10035',
    timestamp: '2026-09-10T18:44:08Z',
    username: 'unknown',
    action: 'LOGIN_FAILED_INVALID_PASSWORD',
    entityType: 'AUTH',
    entityId: 'receptionist@mindcare.com',
    ipAddress: '203.0.113.77',
    userAgent: 'curl/7.88',
    status: 'FAILED',
  },
  {
    id: 'AL-10034',
    timestamp: '2026-09-10T17:30:22Z',
    username: 'receptionist@mindcare.com',
    action: 'APPOINTMENT_SCHEDULED',
    entityType: 'APPOINTMENT',
    entityId: 'APT-2244',
    ipAddress: '192.168.1.107',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10033',
    timestamp: '2026-09-10T16:59:29Z',
    username: 'admin@mindcare.com',
    action: 'DATABASE_BACKUP_COMPLETED',
    entityType: 'SYSTEM',
    entityId: 'BACKUP-20260910',
    ipAddress: '127.0.0.1',
    userAgent: 'System Scheduler',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10032',
    timestamp: '2026-09-10T15:20:11Z',
    username: 'supervisor@mindcare.com',
    action: 'SESSION_NOTE_CO_SIGNED',
    entityType: 'SESSION_NOTE',
    entityId: 'SN-3981',
    ipAddress: '192.168.1.105',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10031',
    timestamp: '2026-09-10T14:08:55Z',
    username: 'case_manager@mindcare.com',
    action: 'CLIENT_RECORD_VIEWED',
    entityType: 'CLIENT_RECORD',
    entityId: 'MC-1887',
    ipAddress: '192.168.1.106',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10030',
    timestamp: '2026-09-10T13:41:30Z',
    username: 'admin@mindcare.com',
    action: 'BILLING_CLAIM_SUBMITTED',
    entityType: 'BILLING',
    entityId: 'CLM-9081',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10029',
    timestamp: '2026-09-10T12:15:44Z',
    username: 'therapist@mindcare.com',
    action: 'TREATMENT_PLAN_UPDATED',
    entityType: 'TREATMENT_PLAN',
    entityId: 'TP-1142',
    ipAddress: '192.168.1.104',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10028',
    timestamp: '2026-09-10T11:02:19Z',
    username: 'psychiatrist@mindcare.com',
    action: 'PRESCRIPTION_APPROVED',
    entityType: 'PRESCRIPTION',
    entityId: 'RX-5514',
    ipAddress: '10.0.0.42',
    userAgent: 'Firefox 128',
    status: 'SUCCESS',
  },
  {
    id: 'AL-10027',
    timestamp: '2026-09-10T09:48:55Z',
    username: 'admin@mindcare.com',
    action: 'MFA_VERIFICATION_PASSED',
    entityType: 'AUTH',
    entityId: '1',
    ipAddress: '192.168.1.101',
    userAgent: 'Chrome 127',
    status: 'SUCCESS',
  },
];

const STATUS_CONFIG = {
  SUCCESS: { label: 'Audit Pass', color: '#059669', bg: '#ECFDF5' },
  FAILED:  { label: 'ALERT',     color: '#DC2626', bg: '#FEF2F2' },
};

const ENTITY_COLORS = {
  AUTH:            '#6366F1',
  SESSION_NOTE:    '#3B82F6',
  USER:            '#8B5CF6',
  CLIENT_RECORD:   '#0891B2',
  ROLE:            '#D97706',
  OUTCOME_MEASURE: '#10B981',
  APPOINTMENT:     '#14B8A6',
  SYSTEM:          '#64748B',
  BILLING:         '#059669',
  TREATMENT_PLAN:  '#7C3AED',
  PRESCRIPTION:    '#EF4444',
};

const AuditLogs = () => {
  const [logs] = useState(SEED_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const entityTypes = ['ALL', ...Array.from(new Set(SEED_AUDIT_LOGS.map(l => l.entityType)))];

  const filteredLogs = logs.filter(log => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !s ||
      log.action?.toLowerCase().includes(s) ||
      log.username?.toLowerCase().includes(s) ||
      log.ipAddress?.toLowerCase().includes(s) ||
      log.entityType?.toLowerCase().includes(s) ||
      log.id?.toLowerCase().includes(s);
    const matchEntity = entityFilter === 'ALL' || log.entityType === entityFilter;
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchSearch && matchEntity && matchStatus;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('MindCare Mental Health Therapy System', 14, 11);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('HIPAA COMPLIANCE AUDIT TRAIL  ·  CONFIDENTIAL  ·  ACTIVE-E2EE-HIPAA', 14, 18);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('System Audit Log Export', 14, 34);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Exported: ${new Date().toLocaleString()}   |   Records: ${filteredLogs.length}   |   Scope: Active-E2EE-HIPAA`, 14, 40);

    let y = 50;
    // Table header
    doc.setFillColor(37, 99, 235);
    doc.rect(14, y, 268, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const cols = [14, 50, 90, 130, 172, 212, 252];
    const headers = ['Timestamp', 'User Account', 'Operation / Action', 'Resource', 'Target ID', 'IP Address', 'Status'];
    headers.forEach((h, i) => doc.text(h, cols[i], y + 6));
    y += 9;

    filteredLogs.slice(0, 25).forEach((log, idx) => {
      if (y > 185) return;
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y, 268, 8, 'F');
      }
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      const ts = new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
      [ts, log.username, log.action, log.entityType, log.entityId, log.ipAddress, log.status]
        .forEach((v, i) => doc.text(String(v || '—'), cols[i], y + 5.5));
      y += 8;
    });

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 199, 297, 8, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('CONFIDENTIAL — MindCare EHR System | HIPAA Audit Log | This document contains protected administrative records.', 14, 204);

    doc.save(`MindCare_AuditLog_${new Date().toLocaleDateString('en-CA')}.pdf`);
  };

  const handleExportCSV = () => {
    let csv = 'Audit ID,Timestamp,User Account,Operation / Action,Resource Category,Target ID,IP Address,Status\n';
    filteredLogs.forEach(log => {
      csv += `"${log.id}","${new Date(log.timestamp).toLocaleString()}","${log.username}","${log.action}","${log.entityType}","${log.entityId}","${log.ipAddress}","${log.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MindCare_AuditLog_${new Date().toLocaleDateString('en-CA')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatAction = (action) =>
    (action || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="mc-page-container">
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SecurityOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 32 }} />
            HIPAA Compliance Audit Trail
          </h1>
          <p className="mc-page-subtitle">Historical records tracking all PHI modifications, patient record unblindings, logins, and signatures.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid var(--border-primary)', borderRadius: 8, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <DownloadOutlinedIcon style={{ fontSize: 16 }} /> CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="mc-btn mc-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
          >
            <DownloadOutlinedIcon style={{ fontSize: 16 }} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary stat chips */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Events', value: SEED_AUDIT_LOGS.length, color: '#3B82F6' },
          { label: 'Success',      value: SEED_AUDIT_LOGS.filter(l => l.status === 'SUCCESS').length, color: '#059669' },
          { label: SEED_AUDIT_LOGS.filter(l => l.status === 'FAILED').length === 1 ? 'Alert' : 'Alerts', value: SEED_AUDIT_LOGS.filter(l => l.status === 'FAILED').length,  color: '#DC2626' },
          { label: 'Unique Users', value: new Set(SEED_AUDIT_LOGS.map(l => l.username)).size, color: '#8B5CF6' },
        ].map(c => (
          <div key={c.label} style={{ padding: '8px 16px', borderRadius: 8, background: `${c.color}12`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: c.color }}>{c.value}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mc-card" style={{ marginBottom: 16, padding: '12px 16px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Search Audit Logs</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search user, action, IP address, resource type..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Resource Category</label>
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12 }}
          >
            {entityTypes.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Categories' : t.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 10px', border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: 12 }}
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Alert / Failed</option>
          </select>
        </div>
      </div>

      {/* Audit table */}
      <div className="mc-card">
        <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="mc-card-title">System Audit Log Trace</h3>
          <span className="mc-badge mc-badge-success" style={{ fontSize: 10 }}>
            Compliance Scope: Active-E2EE-HIPAA
          </span>
        </div>
        <div className="mc-card-content" style={{ padding: 0, overflowX: 'auto' }}>
          {filteredLogs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <SecurityOutlinedIcon style={{ fontSize: 48, color: 'var(--text-tertiary)', marginBottom: 8 }} />
              <p>No audit log entries match your search.</p>
            </div>
          ) : (
            <table className="mc-table" style={{ minWidth: 960 }}>
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>User Account</th>
                  <th>Operation / Action</th>
                  <th>Resource Category</th>
                  <th>Target ID</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const sc = STATUS_CONFIG[log.status] || STATUS_CONFIG.SUCCESS;
                  const ec = ENTITY_COLORS[log.entityType] || '#64748B';
                  return (
                    <tr key={log.id} style={{ fontSize: 'var(--font-size-sm)' }}>
                      <td style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary, #3B82F6)', whiteSpace: 'nowrap' }}>{log.id}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 11 }}>
                        {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}><strong style={{ fontSize: 12 }}>{log.username}</strong></td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}>{formatAction(log.action)}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600,
                          color: ec, background: `${ec}18`, border: `1px solid ${ec}30`,
                          display: 'inline-block', whiteSpace: 'nowrap',
                        }}>
                          {(log.entityType || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>#{log.entityId}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--text-tertiary)', fontSize: 11, whiteSpace: 'nowrap' }}>{log.ipAddress}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          color: sc.color, background: sc.bg, border: `1px solid ${sc.color}30`,
                          display: 'inline-block', whiteSpace: 'nowrap',
                        }}>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
