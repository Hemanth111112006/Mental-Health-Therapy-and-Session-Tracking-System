import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';

const CaseManagerDashboard = () => {
  const { currentUser } = useAuth();
  const { clients, appointments, users, loading } = useDashboardData();

  const activeCases = [
    { id: 1, name: 'Alex Morgan', goal: 'Securing stable housing & outpatient support links', status: 'IN_PROGRESS', progress: 60 },
    { id: 2, name: 'David Wilson', goal: 'Linkage to local vocational training programs', status: 'IN_PROGRESS', progress: 40 },
    { id: 3, name: 'John Smith', goal: 'Medicare eligibility appeal and SSI coordinate', status: 'COMPLETED', progress: 100 }
  ];

  const pendingReferrals = [
    { id: 101, client: 'Alex Morgan', agency: 'County Housing Authority', type: 'Affordable Housing Support', date: 'July 8, 2026', status: 'PENDING' },
    { id: 102, client: 'David Wilson', agency: 'Department of Rehabilitation', type: 'Vocational Counseling', date: 'July 10, 2026', status: 'SUBMITTED' }
  ];

  const referralData = [
    { month: 'Mar', housing: 4, vocational: 6, medical: 2 },
    { month: 'Apr', housing: 5, vocational: 8, medical: 3 },
    { month: 'May', housing: 7, vocational: 5, medical: 5 },
    { month: 'Jun', housing: 8, vocational: 9, medical: 4 },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="mc-badge mc-badge-success">Completed</span>;
      case 'IN_PROGRESS': return <span className="mc-badge mc-badge-active">In Progress</span>;
      case 'PENDING': return <span className="mc-badge mc-badge-warning">Pending Review</span>;
      case 'SUBMITTED': return <span className="mc-badge mc-badge-success">Submitted</span>;
      default: return <span className="mc-badge mc-badge-default">{status}</span>;
    }
  };

  return (
    <div className="mc-dashboard">
      <div className="mc-dashboard-header">
        <div>
          <h1 className="mc-page-title">Case Manager Dashboard</h1>
          <p className="mc-page-subtitle">Care coordination, social support linkage, and client transitions tracking.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mc-grid-4">
        <div className="mc-stat-card primary">
          <div className="mc-stat-card-icon"><PeopleOutlinedIcon /></div>
          <div className="mc-stat-card-value">18</div>
          <div className="mc-stat-card-label">Active Care Cases</div>
        </div>
        <div className="mc-stat-card success">
          <div className="mc-stat-card-icon"><ShareLocationOutlinedIcon /></div>
          <div className="mc-stat-card-value">5</div>
          <div className="mc-stat-card-label">Open Referrals</div>
        </div>
        <div className="mc-stat-card warning">
          <div className="mc-stat-card-icon"><ChecklistOutlinedIcon /></div>
          <div className="mc-stat-card-value">3</div>
          <div className="mc-stat-card-label">Pending Agency Steps</div>
        </div>
        <div className="mc-stat-card accent">
          <div className="mc-stat-card-icon"><DescriptionOutlinedIcon /></div>
          <div className="mc-stat-card-value">45</div>
          <div className="mc-stat-card-label">Care Logs Written (YTD)</div>
        </div>
      </div>

      <div className="mc-grid-2">
        {/* Active Care Coordination Goals */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Active Care Coordination Goals</h3>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {activeCases.map((c, i) => (
              <div key={c.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < activeCases.length - 1 ? '1px solid var(--border-primary)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{c.name}</strong>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>{c.goal}</div>
                  </div>
                  {getStatusBadge(c.status)}
                </div>
                <div>
                  <div className="progress" style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--color-gray-200)' }}>
                    <div className="progress-bar" style={{ width: `${c.progress}%`, background: 'var(--color-primary)', height: '100%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Referrals Tracker */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Outstanding Agency Referrals</h3>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {pendingReferrals.map((ref, i) => (
              <div key={ref.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < pendingReferrals.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{ref.client}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Agency: <strong>{ref.agency}</strong> ({ref.type})
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Submitted: {ref.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getStatusBadge(ref.status)}
                  <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => console.log('Referral status updated')}>Update</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referrals breakdown chart */}
      <div className="mc-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="mc-card-header">
          <h3 className="mc-card-title">Caseload Resource Referrals (Monthly Trends)</h3>
        </div>
        <div className="mc-card-content" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referralData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Bar dataKey="housing" stackId="a" fill="var(--color-primary)" name="Housing Support" />
              <Bar dataKey="vocational" stackId="a" fill="var(--color-secondary)" name="Vocational Links" />
              <Bar dataKey="medical" stackId="a" fill="var(--color-accent)" name="External Medical Co-care" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CaseManagerDashboard;


