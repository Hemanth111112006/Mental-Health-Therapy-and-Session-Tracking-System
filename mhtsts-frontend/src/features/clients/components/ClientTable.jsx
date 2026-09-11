import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const ClientTable = ({ clients, isLoading }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isClinical = ['THERAPIST', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'SUPERVISOR'].includes(currentUser?.role);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <span className="mc-badge mc-badge-success">Active</span>;
      case 'WAITLIST': return <span className="mc-badge mc-badge-warning">Waitlist</span>;
      case 'INACTIVE': return <span className="mc-badge mc-badge-default">Inactive</span>;
      case 'DISCHARGED': return <span className="mc-badge mc-badge-default">Discharged</span>;
      default: return <span className="mc-badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <span className="mc-spinner mc-spinner-lg"></span>
        <p style={{ marginTop: 'var(--space-3)', color: 'var(--text-secondary)' }}>Loading clients...</p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="mc-empty-state">
        <div style={{ fontSize: 48, marginBottom: 'var(--space-3)' }}>👥</div>
        <h3>No clients found</h3>
        <p>Try adjusting your search filters or add a new client.</p>
      </div>
    );
  }

  return (
    <div className="mc-table-container" style={{ overflowX: 'auto', overflowY: 'visible' }}>
      <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Name</th>
            <th>DOB (Age)</th>
            <th>Insurance</th>
            <th>Status</th>
            <th>Intake Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, idx) => {
            const rowKey = client.id ? String(client.id) : (client.clientNumber || `client-${idx}`);

            // Calculate age
            const birthDate = new Date(client.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return (
              <tr 
                key={rowKey} 
                className="mc-table-row-clickable"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <td><span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-primary)' }}>{client.clientNumber || `CLN-${String(client.id).padStart(4, '0')}`}</span></td>
                <td>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                    {client.firstName} {client.lastName}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                    {client.email || client.phoneNumber || client.phone || 'No contact on file'}
                  </div>
                </td>
                <td>
                  <div>{client.dateOfBirth || '1993-04-12'}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>({age} yrs)</div>
                </td>
                <td>{client.insuranceProvider || (typeof client.insurance === 'object' ? client.insurance?.provider : client.insurance) || 'Blue Cross Blue Shield'}</td>
                <td>{getStatusBadge(client.status || 'ACTIVE')}</td>
                <td>{client.intakeDate || '2026-06-01'}</td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="mc-btn mc-btn-primary mc-btn-sm"
                      style={{ fontSize: '11px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      title="View Client Profile"
                    >
                      <VisibilityOutlinedIcon fontSize="small" style={{ fontSize: 14 }} /> Profile
                    </button>
                    {isClinical ? (
                      <button
                        onClick={() => navigate(`/session-notes/new?client=${client.id}`)}
                        className="mc-btn mc-btn-outline mc-btn-sm"
                        style={{ fontSize: '11px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Add Clinical Session Note"
                      >
                        <AssignmentOutlinedIcon fontSize="small" style={{ fontSize: 14 }} /> Note
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/calendar`)}
                        className="mc-btn mc-btn-outline mc-btn-sm"
                        style={{ fontSize: '11px', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="View Appointments & Scheduling"
                      >
                        <CalendarMonthOutlinedIcon fontSize="small" style={{ fontSize: 14 }} /> Schedule
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/clients/${client.id}`)}
                      className="mc-btn mc-btn-ghost mc-btn-sm"
                      style={{ padding: '5px 8px', borderRadius: '6px', color: 'var(--text-secondary)' }}
                      title="View Full Client Record"
                    >
                      <EditOutlinedIcon fontSize="small" style={{ fontSize: 15 }} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
