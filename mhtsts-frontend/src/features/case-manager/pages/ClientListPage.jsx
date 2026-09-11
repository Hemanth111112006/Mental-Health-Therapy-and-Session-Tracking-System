import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, MoreVertical, Eye, FileText, 
  Phone, Mail, MapPin, Calendar, Activity, AlertCircle, ChevronDown
} from 'lucide-react';

const MOCK_CLIENTS = [
  {
    id: 'C-1001', name: 'Eleanor Vance', age: 34, status: 'Active',
    assignedDate: '2023-10-15', nextContact: '2023-11-05',
    riskLevel: 'Medium', phone: '(555) 123-4567', email: 'eleanor.v@email.com',
    primaryNeed: 'Housing Assistance',
  },
  {
    id: 'C-1002', name: 'James Holden', age: 42, status: 'Active',
    assignedDate: '2023-09-22', nextContact: '2023-11-02',
    riskLevel: 'High', phone: '(555) 987-6543', email: 'j.holden@email.com',
    primaryNeed: 'Substance Abuse Treatment',
  },
  {
    id: 'C-1003', name: 'Amos Burton', age: 38, status: 'Inactive',
    assignedDate: '2023-01-10', nextContact: 'N/A',
    riskLevel: 'Low', phone: '(555) 456-7890', email: 'amos.b@email.com',
    primaryNeed: 'Employment Placement',
  },
  {
    id: 'C-1004', name: 'Naomi Nagata', age: 29, status: 'Active',
    assignedDate: '2023-10-28', nextContact: '2023-11-03',
    riskLevel: 'Low', phone: '(555) 234-5678', email: 'n.nagata@email.com',
    primaryNeed: 'Educational Support',
  },
  {
    id: 'C-1005', name: 'Alex Kamal', age: 51, status: 'Pending',
    assignedDate: '2023-11-01', nextContact: '2023-11-04',
    riskLevel: 'Medium', phone: '(555) 876-5432', email: 'alex.k@email.com',
    primaryNeed: 'Mental Health Services',
  }
];

const riskColors = {
  'Low': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  'Medium': { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
  'High': { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

const statusColors = {
  'Active': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  'Inactive': { bg: 'rgba(107,114,128,0.1)', text: '#6b7280' },
  'Pending': { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
};

const ClientListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = MOCK_CLIENTS.filter(c => {
    const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Case Management</span><span style={{ opacity: 0.4 }}>›</span><span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Client List</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} style={{ color: '#3b82f6' }} /> Client List
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage and view all clients in your caseload
          </p>
        </div>
        <button 
          onClick={() => navigate('/clients/new')}
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
          onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}>
          + Add New Client
        </button>
      </div>

      <div className="mc-card" style={{ padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search by name, ID, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: '12px', color: 'var(--text-primary)' }}>
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="mc-card" style={{ borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Client Info</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Primary Need</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Risk Level</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Next Contact</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-primary)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', marginBottom: '4px' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.id} • {c.age} yrs</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12}/> {c.phone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12}/> {c.email}</div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-primary)' }}>{c.primaryNeed}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: statusColors[c.status].bg, color: statusColors[c.status].text }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: riskColors[c.riskLevel].bg, color: riskColors[c.riskLevel].text, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {c.riskLevel === 'High' && <AlertCircle size={10} />}
                      {c.riskLevel}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-primary)' }}>{c.nextContact}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/clients`)}
                        style={{ background: 'transparent', border: '1px solid var(--border-primary)', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' }} 
                        title="View Profile"
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = '#3b82f6'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/session-notes`)}
                        style={{ background: 'transparent', border: '1px solid var(--border-primary)', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'all 0.2s' }} 
                        title="Case Notes"
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = '#10b981'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    No clients found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientListPage;
