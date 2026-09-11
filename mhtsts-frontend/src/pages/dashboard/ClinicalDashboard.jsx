import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ClinicalLayout from '../../layouts/ClinicalLayout';
import { HeartHandshake, CalendarClock, ClipboardPen, Target, Siren, ShieldPlus, Activity } from 'lucide-react';

const ClinicalDashboard = () => {
  const [summary] = useState({
    assignedClients: 24,
    todaysSessions: 6,
    pendingNotes: 3,
    activePlans: 21,
    highRiskClients: 1
  });

  return (
    <ClinicalLayout role="THERAPIST">
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '0.3rem' }}>Clinical Provider Workspace</h2>
          <p style={{ color: '#64748b' }}>Overview of assigned patient caseload, daily session schedule, progress documentation, and risk logs.</p>
        </div>

        {/* 5 Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2563eb', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>ASSIGNED CLIENTS</span>
              <HeartHandshake size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{summary.assignedClients} Active</div>
          </div>

          <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #16a34a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#16a34a', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>TODAY'S SESSIONS</span>
              <CalendarClock size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{summary.todaysSessions}</div>
          </div>

          <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#d97706', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>PENDING NOTES</span>
              <ClipboardPen size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{summary.pendingNotes} Due</div>
          </div>

          <div style={{ padding: '1rem', background: '#f5f3ff', borderRadius: '8px', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#7c3aed', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>TREATMENT PLANS</span>
              <Target size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>{summary.activePlans}</div>
          </div>

          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#dc2626', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>HIGH RISK CLIENTS</span>
              <Siren size={18} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#dc2626' }}>{summary.highRiskClients} Critical</div>
          </div>
        </div>

        {/* Clinical Control Modules */}
        <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '1rem' }}>Clinical Documentation & Tools</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Link to="/clinical/clients" style={{ padding: '1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <HeartHandshake size={24} color="#2563eb" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Clients</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>View caseload profile & info</div>
            </div>
          </Link>

          <Link to="/clinical/session-notes" style={{ padding: '1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ClipboardPen size={24} color="#d97706" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Session Notes</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Create SOAP & DAP notes</div>
            </div>
          </Link>

          <Link to="/clinical/treatment-plans" style={{ padding: '1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Target size={24} color="#7c3aed" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Treatment Plans</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Goals & therapeutic strategies</div>
            </div>
          </Link>

          <Link to="/clinical/crisis-assessment" style={{ padding: '1.2rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', textDecoration: 'none', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Siren size={24} color="#dc2626" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Crisis Assessment</div>
              <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>Risk logs & immediate protocol</div>
            </div>
          </Link>

          <Link to="/clinical/safety-plans" style={{ padding: '1.2rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', textDecoration: 'none', color: '#166534', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldPlus size={24} color="#16a34a" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Safety Plans</div>
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>Stanley-Brown suicide safety</div>
            </div>
          </Link>

          <Link to="/clinical/outcome-measures" style={{ padding: '1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Activity size={24} color="#059669" />
            <div>
              <div style={{ fontWeight: 'bold' }}>Outcome Measures</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PHQ-9 & GAD-7 score trends</div>
            </div>
          </Link>
        </div>
      </div>
    </ClinicalLayout>
  );
};

export default ClinicalDashboard;
