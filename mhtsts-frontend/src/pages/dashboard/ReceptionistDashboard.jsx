import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useDashboardData } from '../../hooks/useDashboardData';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';

const ReceptionistDashboard = () => {
  const { currentUser } = useAuth();
  const { clients, appointments, users, loading } = useDashboardData();
  const [appointments, setAppointments] = useState([
    { id: 1, time: '09:00 AM', client: 'Sophia Davis', therapist: 'Dr. Emily Chen, PsyD', status: 'COMPLETED', copay: 20, copayPaid: true },
    { id: 2, time: '10:00 AM', client: 'Jennifer Miller', therapist: 'Dr. James Rodriguez, MD', status: 'COMPLETED', copay: 25, copayPaid: true },
    { id: 3, time: '11:30 AM', client: 'Ava Johnson', therapist: 'Dr. Michael Thompson, LCSW', status: 'IN_PROGRESS', copay: 0, copayPaid: false },
    { id: 4, time: '01:00 PM', client: 'Sarah Connor', therapist: 'Dr. James Rodriguez, MD', status: 'CHECKED_IN', copay: 35, copayPaid: false },
    { id: 5, time: '02:30 PM', client: 'David Wilson', therapist: 'Dr. Michael Thompson, LCSW', status: 'SCHEDULED', copay: 15, copayPaid: false },
  ]);

  const insuranceVerifications = [
    { id: 101, client: 'Sarah Connor', policy: 'Blue Shield CA', status: 'VERIFIED' },
    { id: 102, client: 'David Wilson', policy: 'Aetna POS', status: 'PENDING' },
    { id: 103, client: 'Ava Johnson', policy: 'Cigna PPO', status: 'VERIFIED' }
  ];

  const handleCheckIn = (id) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'CHECKED_IN' } : apt
    ));
    setCheckedIn(true); setTimeout(()=>setCheckedIn(false),3000);
  };

  const handleCollectCopay = (id) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, copayPaid: true } : apt
    ));
    setCopayCollected(true); setTimeout(()=>setCopayCollected(false),3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="mc-badge mc-badge-success">Completed</span>;
      case 'IN_PROGRESS': return <span className="mc-badge mc-badge-active">In Progress</span>;
      case 'CHECKED_IN': return <span className="mc-badge mc-badge-warning">Checked In</span>;
      case 'SCHEDULED': return <span className="mc-badge mc-badge-default">Scheduled</span>;
      default: return <span className="mc-badge mc-badge-default">{status}</span>;
    }
  };

  return (
    <div className="mc-dashboard">
      <div className="mc-dashboard-header">
        <div>
          <h1 className="mc-page-title">Receptionist Dashboard</h1>
          <p className="mc-page-subtitle">Welcome back, {currentUser?.firstName}. Clinic scheduling and front desk coordinator.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mc-grid-4">
        <div className="mc-stat-card primary">
          <div className="mc-stat-card-icon"><PeopleOutlinedIcon /></div>
          <div className="mc-stat-card-value">2</div>
          <div className="mc-stat-card-label">Checked In (Waiting)</div>
        </div>
        <div className="mc-stat-card success">
          <div className="mc-stat-card-icon"><EventAvailableOutlinedIcon /></div>
          <div className="mc-stat-card-value">5</div>
          <div className="mc-stat-card-label">Total Appointments Today</div>
        </div>
        <div className="mc-stat-card warning">
          <div className="mc-stat-card-icon"><ReceiptOutlinedIcon /></div>
          <div className="mc-stat-card-value">$45.00</div>
          <div className="mc-stat-card-label">Copays Collected Today</div>
        </div>
        <div className="mc-stat-card accent">
          <div className="mc-stat-card-icon"><FactCheckOutlinedIcon /></div>
          <div className="mc-stat-card-value">1</div>
          <div className="mc-stat-card-label">Pending Verifications</div>
        </div>
      </div>

      <div className="mc-grid-2">
        {/* Today's Client Arrivals & Check-In */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Client Arrivals & Check-In</h3>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {appointments.map((apt, i) => (
              <div key={apt.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < appointments.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                    {apt.time} - {apt.client}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Provider: {apt.therapist}
                  </div>
                  {apt.copay > 0 && (
                    <div style={{ fontSize: 'var(--font-size-xs)', marginTop: 2 }}>
                      Copay: <strong>${apt.copay}</strong> â€¢ {apt.copayPaid ? 
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Paid</span> : 
                        <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>Unpaid</span>
                      }
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getStatusBadge(apt.status)}
                  {apt.status === 'SCHEDULED' && (
                    <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => handleCheckIn(apt.id)}>Check In</button>
                  )}
                  {apt.copay > 0 && !apt.copayPaid && (
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => handleCollectCopay(apt.id)}>Collect Copay</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance verification check list */}
        <div className="mc-card" style={{ borderTop: '4px solid var(--color-primary)' }}>
          <div className="mc-card-header">
            <h3 className="mc-card-title">Insurance Verification Queue</h3>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {insuranceVerifications.map((ins, i) => (
              <div key={ins.id} style={{ 
                padding: 'var(--space-4)', 
                borderBottom: i < insuranceVerifications.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{ins.client}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Provider Plan: <strong>{ins.policy}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span className={`mc-badge mc-badge-${ins.status === 'VERIFIED' ? 'success' : 'warning'}`}>{ins.status}</span>
                  {ins.status === 'PENDING' && (
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => console.log('Insurance verified')}>Verify Eligibility</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;


