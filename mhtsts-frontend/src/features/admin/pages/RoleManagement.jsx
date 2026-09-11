import React, { useState } from 'react';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

const RoleManagement = () => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');

  // Exact permission matrix from MHTSTS SRS
  const rolesList = [
    { code: 'ADMIN', name: 'System Administrator', desc: 'Full operational control, user provisioning, system configuration, and audit trail oversight.' },
    { code: 'THERAPIST', name: 'Therapist / Counselor', desc: 'Primary therapist role. Access limited to assigned caseload clients. Document SOAP/DAP notes.' },
    { code: 'PSYCHOLOGIST', name: 'Psychologist', desc: 'Specialized clinical assessment, testing interpretation, and psychotherapy.' },
    { code: 'PSYCHIATRIST', name: 'Psychiatrist', desc: 'Prescription authority and psychiatric evaluations across assigned clients.' },
    { code: 'SUPERVISOR', name: 'Clinical Supervisor', desc: 'Caseload oversight, supervisee training logs, and clinical note co-signatures.' },
    { code: 'RECEPTIONIST', name: 'Receptionist', desc: 'Scheduling, copays, insurance checks, and intake documentation. No access to clinical notes or diagnoses.' },
    { code: 'CASE_MANAGER', name: 'Case Manager', desc: 'Care coordination and external referrals. Access to treatment plans without clinical note contents.' },
    { code: 'CLIENT', name: 'Client / Patient', desc: 'Access own portal to book appointments, view bills, complete scales (PHQ9), and message team.' }
  ];

  const permissionMatrix = {
    'View Records': {
      ADMIN: true, THERAPIST: 'caseload', PSYCHOLOGIST: 'caseload', PSYCHIATRIST: 'caseload',
      SUPERVISOR: 'supervisees', RECEPTIONIST: 'demographics', CASE_MANAGER: 'caseload', CLIENT: 'own'
    },
    'Session Notes': {
      ADMIN: true, THERAPIST: 'write', PSYCHOLOGIST: 'write', PSYCHIATRIST: 'write',
      SUPERVISOR: 'cosign', RECEPTIONIST: false, CASE_MANAGER: false, CLIENT: false
    },
    'Treatment Plans': {
      ADMIN: true, THERAPIST: 'write', PSYCHOLOGIST: 'write', PSYCHIATRIST: 'write',
      SUPERVISOR: 'review', RECEPTIONIST: false, CASE_MANAGER: 'view', CLIENT: 'view'
    },
    'Outcome Measures': {
      ADMIN: true, THERAPIST: 'write', PSYCHOLOGIST: 'write', PSYCHIATRIST: 'write',
      SUPERVISOR: 'view', RECEPTIONIST: false, CASE_MANAGER: 'view', CLIENT: 'submit'
    },
    'Scheduling': {
      ADMIN: true, THERAPIST: 'own', PSYCHOLOGIST: 'own', PSYCHIATRIST: 'own',
      SUPERVISOR: 'supervisees', RECEPTIONIST: true, CASE_MANAGER: 'view', CLIENT: 'own'
    },
    'Billing': {
      ADMIN: true, THERAPIST: false, PSYCHOLOGIST: false, PSYCHIATRIST: false,
      SUPERVISOR: false, RECEPTIONIST: true, CASE_MANAGER: false, CLIENT: 'pay'
    },
    'Secure Messages': {
      ADMIN: true, THERAPIST: 'caseload', PSYCHOLOGIST: 'caseload', PSYCHIATRIST: 'caseload',
      SUPERVISOR: 'caseload', RECEPTIONIST: 'scheduling', CASE_MANAGER: 'caseload', CLIENT: 'treatmentTeam'
    },
    'Audit Logs': {
      ADMIN: true, THERAPIST: false, PSYCHOLOGIST: false, PSYCHIATRIST: false,
      SUPERVISOR: false, RECEPTIONIST: false, CASE_MANAGER: false, CLIENT: false
    },
    'System Configuration': {
      ADMIN: true, THERAPIST: false, PSYCHOLOGIST: false, PSYCHIATRIST: false,
      SUPERVISOR: false, RECEPTIONIST: false, CASE_MANAGER: false, CLIENT: false
    }
  };

  const getStatusIndicator = (allowed) => {
    if (allowed === true) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-success)', fontWeight: 600 }}>
          <CheckCircleOutlinedIcon style={{ fontSize: 16 }} /> Allowed
        </span>
      );
    } else if (allowed === false) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-danger)', fontWeight: 500 }}>
          <CancelOutlinedIcon style={{ fontSize: 16 }} /> Blocked
        </span>
      );
    } else {
      // Conditional access
      return (
        <span className="mc-badge mc-badge-warning" style={{ fontSize: 10, padding: '3px 8px' }}>
          {allowed}
        </span>
      );
    }
  };

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
            <SecurityOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> Role-Based Access Permissions
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            System permission matrix configured according to HIPAA Privacy rules and MHTSTS clinical guidelines.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => (() => { window.print(); })()}>
            <PrintOutlinedIcon style={{ fontSize: 14 }} /> Print Schema
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
        
        {/* Left Side: Roles list with description */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>System Account Roles</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {rolesList.map(r => (
              <button
                key={r.code}
                type="button"
                onClick={() => setSelectedRole(r.code)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid',
                  borderColor: selectedRole === r.code ? '#4338CA' : 'transparent',
                  background: selectedRole === r.code ? '#EEF2FF' : 'transparent',
                  color: selectedRole === r.code ? '#4338CA' : 'var(--text-primary)',
                  cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                <strong style={{ display: 'block', fontSize: 12 }}>{r.name}</strong>
                <span style={{ fontSize: 9, color: selectedRole === r.code ? '#667085' : 'var(--text-secondary)' }}>Code: {r.code}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Matrix display */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Active Role Description */}
          <div className="mc-card" style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.02) 0%, rgba(91, 33, 182, 0.02) 100%)', border: '1px solid rgba(67, 56, 202, 0.1)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E1B4B', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <SecurityOutlinedIcon style={{ fontSize: 18, color: '#4338CA' }} />
              {rolesList.find(r => r.code === selectedRole)?.name} Permissions Overview
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              {rolesList.find(r => r.code === selectedRole)?.desc}
            </p>
          </div>

          {/* Matrix table */}
          <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <div className="mc-card-header" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700 }}>Access Matrix for {selectedRole}</h3>
            </div>
            <table className="mc-table">
              <thead>
                <tr style={{ background: '#F8F9FA', fontSize: 11 }}>
                  <th>System Module / Capability</th>
                  <th>Permission Level</th>
                  <th>Status & Guard Policy</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(permissionMatrix).map((perm, i) => {
                  const allowedState = permissionMatrix[perm][selectedRole];
                  return (
                    <tr key={i} style={{ fontSize: 12 }}>
                      <td><strong>{perm}</strong></td>
                      <td>
                        <span className="mc-badge mc-badge-default" style={{ 
                          fontSize: 10, 
                          fontWeight: 600, 
                          background: allowedState === true ? 'rgba(16, 185, 129, 0.1)' : allowedState === false ? 'rgba(152, 162, 179, 0.1)' : 'rgba(67, 56, 202, 0.08)',
                          color: allowedState === true ? '#059669' : allowedState === false ? '#667085' : '#4338CA',
                          padding: '3px 8px'
                        }}>
                          {allowedState === true ? 'ALL_ACTIONS' : allowedState === false ? 'NO_ACCESS' : String(allowedState).toUpperCase()}
                        </span>
                      </td>
                      <td>{getStatusIndicator(allowedState)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Comprehensive Permission Matrix Grid */}
          <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <div className="mc-card-header" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-primary)' }}>
              <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700 }}>Global System Matrix Grid (All Roles)</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="mc-table" style={{ minWidth: 640 }}>
                <thead>
                  <tr style={{ background: '#F8F9FA', fontSize: 10 }}>
                    <th>Module</th>
                    {rolesList.map(r => <th key={r.code} style={{ textAlign: 'center' }}>{r.code}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(permissionMatrix).map((perm, i) => (
                    <tr key={i} style={{ fontSize: 11 }}>
                      <td><strong>{perm}</strong></td>
                      {rolesList.map(r => {
                        const allowed = permissionMatrix[perm][r.code];
                        return (
                          <td key={r.code} style={{ textAlign: 'center' }}>
                            {allowed === true ? (
                              <CheckCircleOutlinedIcon style={{ fontSize: 16, color: 'var(--color-success)', verticalAlign: 'middle' }} />
                            ) : allowed === false ? (
                              <CancelOutlinedIcon style={{ fontSize: 16, color: 'var(--color-danger)', verticalAlign: 'middle' }} />
                            ) : (
                              <span className="mc-badge mc-badge-default" style={{ fontSize: 8, padding: '2px 4px' }}>{allowed}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default RoleManagement;

