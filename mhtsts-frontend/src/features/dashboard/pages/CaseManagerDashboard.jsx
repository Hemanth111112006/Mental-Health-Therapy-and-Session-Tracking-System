import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { toast } from '../../../utils/toast';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { 
  Users, Share2, CheckSquare, FileText, ArrowRight, 
  Building2, Calendar, CheckCircle2, Clock, X, AlertCircle 
} from 'lucide-react';

const CaseManagerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeCases, setActiveCases] = useState([
    { id: 1, name: 'Alex Morgan', goal: 'Securing stable housing & outpatient support links', status: 'IN_PROGRESS', progress: 60 },
    { id: 2, name: 'David Wilson', goal: 'Linkage to local vocational training programs', status: 'IN_PROGRESS', progress: 40 },
    { id: 3, name: 'John Smith', goal: 'Medicare eligibility appeal and SSI coordinate', status: 'COMPLETED', progress: 100 }
  ]);

  const [pendingReferrals, setPendingReferrals] = useState([
    { id: 101, client: 'Alex Morgan', agency: 'County Housing Authority', type: 'Affordable Housing Support', date: 'July 8, 2026', status: 'PENDING', notes: 'Application submitted for Section 8 voucher program.' },
    { id: 102, client: 'David Wilson', agency: 'Department of Rehabilitation', type: 'Vocational Counseling', date: 'July 10, 2026', status: 'SUBMITTED', notes: 'Medical records forwarded for intake review.' }
  ]);

  const [selectedReferral, setSelectedReferral] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('ACCEPTED');
  const [updateNotes, setUpdateNotes] = useState('');

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
      case 'SUBMITTED': return <span className="mc-badge mc-badge-active">Submitted</span>;
      case 'ACCEPTED': return <span className="mc-badge mc-badge-success">Accepted</span>;
      default: return <span className="mc-badge mc-badge-default">{status}</span>;
    }
  };

  const handleOpenUpdateModal = (ref) => {
    setSelectedReferral(ref);
    setUpdateStatus(ref.status === 'PENDING' ? 'ACCEPTED' : 'COMPLETED');
    setUpdateNotes(ref.notes || '');
  };

  const handleSaveReferralUpdate = (e) => {
    e.preventDefault();
    if (!selectedReferral) return;

    setPendingReferrals(prev => prev.map(r => 
      r.id === selectedReferral.id 
        ? { ...r, status: updateStatus, notes: updateNotes } 
        : r
    ));
    toast.success(`Agency referral for ${selectedReferral.client} (${selectedReferral.agency}) updated to ${updateStatus}!`);
    setSelectedReferral(null);
  };

  return (
    <div className="mc-dashboard" style={{ padding: '0 8px 24px 8px' }}>
      <div className="mc-dashboard-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Case Manager Dashboard
            </h1>
            <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Care coordination, social support linkage, and client transitions tracking.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mc-btn mc-btn-outline" onClick={() => navigate('/resources')} style={{ fontSize: 11, padding: '8px 12px' }}>
              Community Directory
            </button>
            <button className="mc-btn mc-btn-primary" onClick={() => navigate('/referrals')} style={{ fontSize: 11, padding: '8px 14px' }}>
              + New Referral
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive 4-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="mc-stat-card primary" style={{ margin: 0 }}>
          <div className="mc-stat-card-icon"><Users size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-card-value">{activeCases.length + 15}</div>
            <div className="mc-stat-card-label">Active Care Cases</div>
          </div>
        </div>

        <div className="mc-stat-card success" style={{ margin: 0 }}>
          <div className="mc-stat-card-icon"><Share2 size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-card-value">{pendingReferrals.length + 3}</div>
            <div className="mc-stat-card-label">Open Referrals</div>
          </div>
        </div>

        <div className="mc-stat-card warning" style={{ margin: 0 }}>
          <div className="mc-stat-card-icon"><CheckSquare size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-card-value">3</div>
            <div className="mc-stat-card-label">Pending Agency Steps</div>
          </div>
        </div>

        <div className="mc-stat-card accent" style={{ margin: 0 }}>
          <div className="mc-stat-card-icon"><FileText size={22} /></div>
          <div className="mc-stat-content">
            <div className="mc-stat-card-value">45</div>
            <div className="mc-stat-card-label">Care Logs Written (YTD)</div>
          </div>
        </div>
      </div>

      <div className="mc-grid mc-grid-2">
        {/* Active Care Coordination Goals */}
        <div className="mc-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
          <div className="mc-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="mc-card-title" style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
              Active Care Coordination Goals
            </h3>
            <button className="mc-btn mc-btn-ghost mc-btn-sm" onClick={() => navigate('/treatment-plans')} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {activeCases.map((c, i) => (
              <div key={c.id} style={{ 
                padding: '16px 20px', 
                borderBottom: i < activeCases.length - 1 ? '1px solid var(--border-primary)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: 13 }}>{c.name}</strong>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{c.goal}</div>
                  </div>
                  {getStatusBadge(c.status)}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>
                    <span>Care Plan Milestones</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{c.progress}%</strong>
                  </div>
                  <div className="progress" style={{ height: 6, borderRadius: 3, overflow: 'hidden', background: '#E2E8F0' }}>
                    <div className="progress-bar" style={{ width: `${c.progress}%`, background: 'var(--color-primary)', height: '100%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agency Referrals Tracker */}
        <div className="mc-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
          <div className="mc-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="mc-card-title" style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
              Outstanding Agency Referrals
            </h3>
            <button className="mc-btn mc-btn-ghost mc-btn-sm" onClick={() => navigate('/referrals')} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              Manage <ArrowRight size={12} />
            </button>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {pendingReferrals.map((ref, i) => (
              <div key={ref.id} style={{ 
                padding: '16px 20px', 
                borderBottom: i < pendingReferrals.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{ref.client}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Agency: <strong>{ref.agency}</strong> ({ref.type})
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Submitted: {ref.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {getStatusBadge(ref.status)}
                  <button 
                    className="mc-btn mc-btn-outline mc-btn-sm" 
                    onClick={() => handleOpenUpdateModal(ref)}
                    style={{ fontSize: 11, padding: '4px 10px' }}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referrals breakdown chart */}
      <div className="mc-card" style={{ marginTop: '24px', borderRadius: 14, padding: 20 }}>
        <div className="mc-card-header" style={{ borderBottom: 'none', padding: 0, marginBottom: 16 }}>
          <h3 className="mc-card-title" style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            Caseload Resource Referrals (Monthly Trends)
          </h3>
        </div>
        <div className="mc-card-content" style={{ height: 220, padding: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={referralData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Bar dataKey="housing" stackId="a" fill="var(--color-primary)" name="Housing Support" />
              <Bar dataKey="vocational" stackId="a" fill="var(--color-secondary)" name="Vocational Links" />
              <Bar dataKey="medical" stackId="a" fill="#D97706" name="External Medical Co-care" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Update Agency Referral Modal */}
      {selectedReferral && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 500, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Update Referral Status
                </h3>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {selectedReferral.client} · {selectedReferral.agency}
                </span>
              </div>
              <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedReferral(null)} style={{ fontSize: 20, padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveReferralUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Referral Status
                </label>
                <select 
                  className="form-select" 
                  value={updateStatus} 
                  onChange={e => setUpdateStatus(e.target.value)}
                  style={{ height: 38, fontSize: 12 }}
                >
                  <option value="ACCEPTED">Accepted by Agency</option>
                  <option value="IN_PROGRESS">In Progress / Intake Scheduled</option>
                  <option value="COMPLETED">Completed / Placement Confirmed</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="SUBMITTED">Submitted</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Care Coordination Notes
                </label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={updateNotes} 
                  onChange={e => setUpdateNotes(e.target.value)}
                  placeholder="Document agency communication, intake coordinator contacts, or client transport plans..."
                  style={{ fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setSelectedReferral(null)} style={{ fontSize: 12 }}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ fontSize: 12 }}>
                  Save Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CaseManagerDashboard;
