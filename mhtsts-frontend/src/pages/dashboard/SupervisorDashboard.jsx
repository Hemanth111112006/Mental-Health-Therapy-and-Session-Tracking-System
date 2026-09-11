import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import QueryBuilderOutlinedIcon from '@mui/icons-material/QueryBuilderOutlined';

const SupervisorDashboard = () => {
  const { currentUser } = useAuth();
  const { clients, appointments, users, loading } = useDashboardData();
  
  const supervisees = [
    { id: 4, name: 'Michael Thompson, ACSW', type: 'Associate LCSW', clientCount: 18, pendingNotes: 3, hoursLogged: 780, hoursRequired: 3000 },
    { id: 11, name: 'Jessica Vance, AMFT', type: 'Associate LMFT', clientCount: 12, pendingNotes: 4, hoursLogged: 1240, hoursRequired: 3000 }
  ];

  const pendingCoSignatures = [
    { id: 201, client: 'Alex Morgan', supervisee: 'Michael Thompson, ACSW', type: 'CBT SOAP Note', date: 'Today, 09:00 AM' },
    { id: 202, client: 'David Wilson', supervisee: 'Michael Thompson, ACSW', type: 'Intake Assessment DAP', date: 'Yesterday' },
    { id: 203, client: 'John Smith', supervisee: 'Jessica Vance, AMFT', type: 'Family Session Note', date: '2 days ago' }
  ];

  const crisisConsults = [
    { id: 102, client: 'David Wilson', supervisee: 'Michael Thompson, ACSW', severity: 'HIGH', date: 'July 11, 2026', details: 'Client reported suicidal ideation with passive plans. Safety plan updated.' }
  ];

  const weeklySupervisionHours = [
    { week: 'W1', hours: 4.5 },
    { week: 'W2', hours: 6.0 },
    { week: 'W3', hours: 5.5 },
    { week: 'W4', hours: 7.0 },
    { week: 'W5', hours: 5.0 },
  ];

  return (
    <div className="mc-dashboard">
      <div className="mc-dashboard-header">
        <div>
          <h1 className="mc-page-title">Supervisor Dashboard</h1>
          <p className="mc-page-subtitle">Oversight for clinical supervisees and documentation compliance.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mc-grid-4">
        <div className="mc-stat-card primary">
          <div className="mc-stat-card-icon"><PeopleOutlinedIcon /></div>
          <div className="mc-stat-card-value">2</div>
          <div className="mc-stat-card-label">Supervisees Managed</div>
        </div>
        <div className="mc-stat-card success">
          <div className="mc-stat-card-icon"><DescriptionOutlinedIcon /></div>
          <div className="mc-stat-card-value">7</div>
          <div className="mc-stat-card-label">Pending Co-Signatures</div>
        </div>
        <div className="mc-stat-card warning">
          <div className="mc-stat-card-icon"><WarningAmberOutlinedIcon /></div>
          <div className="mc-stat-card-value">1</div>
          <div className="mc-stat-card-label">Active Crisis Consults</div>
        </div>
        <div className="mc-stat-card accent">
          <div className="mc-stat-card-icon"><QueryBuilderOutlinedIcon /></div>
          <div className="mc-stat-card-value">5.6h</div>
          <div className="mc-stat-card-label">Avg. Weekly Supervision</div>
        </div>
      </div>

      <div className="mc-grid-2">
        {/* Supervisee Caseload Overview */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">My Supervisees</h3>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {supervisees.map((sup, i) => {
              const progressPct = ((sup.hoursLogged / sup.hoursRequired) * 100).toFixed(0);
              return (
                <div key={sup.id} style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: i < supervisees.length - 1 ? '1px solid var(--border-primary)' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{sup.name}</strong>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{sup.type} â€¢ {sup.clientCount} Active Clients</div>
                    </div>
                    <span className="mc-badge mc-badge-warning">{sup.pendingNotes} Pending Notes</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                      <span>Licensure Hours: {sup.hoursLogged} / {sup.hoursRequired} hrs</span>
                      <span>{progressPct}% Completed</span>
                    </div>
                    <div className="progress" style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--color-gray-200)' }}>
                      <div className="progress-bar" style={{ width: `${progressPct}%`, background: 'var(--color-primary)', height: '100%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Co-Signatures List */}
        <div className="mc-card" style={{ borderTop: '4px solid var(--color-warning)' }}>
          <div className="mc-card-header">
            <h3 className="mc-card-title">Pending Co-Signatures</h3>
            <span className="mc-badge mc-badge-warning">{pendingCoSignatures.length}</span>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {pendingCoSignatures.map((note, i) => (
              <div key={note.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < pendingCoSignatures.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{note.client}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Written by: <strong>{note.supervisee}</strong>
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{note.type} â€¢ {note.date}</div>
                </div>
                <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => console.log('Co-signature applied - would be stored in DB')}>Review & Sign</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crisis Supervision Log */}
      <div className="mc-card" style={{ marginTop: 'var(--space-6)', borderLeft: '4px solid var(--color-danger)' }}>
        <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="mc-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)' }}>
            <WarningAmberOutlinedIcon /> Crisis Escalation Alerts (Supervisee Caseloads)
          </h3>
        </div>
        <div className="mc-card-content" style={{ padding: 0 }}>
          {crisisConsults.map((consult, i) => (
            <div key={consult.id} style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Client: {consult.client}</strong>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Supervised Clinician: {consult.supervisee}</div>
                </div>
                <span className="mc-badge mc-badge-critical">{consult.severity} RISK</span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {consult.details}
              </p>
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 8 }}>
                <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => console.log('Crisis response co-signed')}>Document Supervision Consultation</button>
                <button className="mc-btn mc-btn-ghost mc-btn-sm">View Crisis Assessment</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hour tracker progress chart */}
      <div className="mc-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="mc-card-header">
          <h3 className="mc-card-title">Accumulated Supervision Hours (Weekly Trends)</h3>
        </div>
        <div className="mc-card-content" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklySupervisionHours} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="var(--color-primary)" fill="var(--color-primary-50)" name="Supervision Hours Logged" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;


