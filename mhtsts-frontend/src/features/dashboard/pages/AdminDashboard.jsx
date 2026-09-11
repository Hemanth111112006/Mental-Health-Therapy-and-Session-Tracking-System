import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mock Sparkline Data (Realistic points)
  const sparkUsers = [{ y: 65 }, { y: 68 }, { y: 70 }, { y: 74 }, { y: 79 }];
  const sparkClients = [{ y: 120 }, { y: 128 }, { y: 135 }, { y: 142 }, { y: 154 }];
  const sparkAppts = [{ y: 18 }, { y: 22 }, { y: 20 }, { y: 24 }, { y: 28 }];
  const sparkNotes = [{ y: 8 }, { y: 6 }, { y: 9 }, { y: 5 }, { y: 3 }];
  const sparkCrisis = [{ y: 0 }, { y: 2 }, { y: 1 }, { y: 3 }, { y: 1 }];
  const sparkBilling = [{ y: 85 }, { y: 89 }, { y: 94 }, { y: 96 }, { y: 97 }];

  // Charts Data
  const appointmentTrend = [
    { name: 'Mon', completed: 18, cancelled: 2, noshow: 1 },
    { name: 'Tue', completed: 22, cancelled: 1, noshow: 0 },
    { name: 'Wed', completed: 20, cancelled: 3, noshow: 2 },
    { name: 'Thu', completed: 24, cancelled: 0, noshow: 1 },
    { name: 'Fri', completed: 26, cancelled: 2, noshow: 0 },
    { name: 'Sat', completed: 10, cancelled: 1, noshow: 1 },
    { name: 'Sun', completed: 6, cancelled: 0, noshow: 0 },
  ];

  const clientGrowth = [
    { name: 'Jan', active: 90, total: 110 },
    { name: 'Feb', active: 102, total: 125 },
    { name: 'Mar', active: 118, total: 138 },
    { name: 'Apr', active: 126, total: 145 },
    { name: 'May', active: 138, total: 158 },
    { name: 'Jun', active: 154, total: 172 },
  ];

  const billingOverview = [
    { name: 'Jan', insuranceClearance: 12400, clientCopay: 3100 },
    { name: 'Feb', insuranceClearance: 14200, clientCopay: 3500 },
    { name: 'Mar', insuranceClearance: 16800, clientCopay: 4200 },
    { name: 'Apr', insuranceClearance: 15400, clientCopay: 3800 },
    { name: 'May', insuranceClearance: 18900, clientCopay: 4600 },
    { name: 'Jun', insuranceClearance: 21000, clientCopay: 5200 },
  ];

  const outcomeTrends = [
    { name: 'Week 1', phq9: 16, gad7: 14 },
    { name: 'Week 2', phq9: 14, gad7: 11 },
    { name: 'Week 3', phq9: 11, gad7: 9 },
    { name: 'Week 4', phq9: 8, gad7: 7 },
    { name: 'Week 5', phq9: 6, gad7: 5 },
  ];

  const roleDistribution = [
    { name: 'Therapists', value: 14, color: '#4338CA' },
    { name: 'Psychologists', value: 6, color: '#5B21B6' },
    { name: 'Psychiatrists', value: 4, color: '#F59E0B' },
    { name: 'Case Managers', value: 8, color: '#C4B5FD' },
    { name: 'Supervisors', value: 5, color: '#38BDF8' },
    { name: 'Receptionists', value: 3, color: '#98A2B3' },
  ];

  const monthlyActivity = [
    { name: 'Jan', intake: 15, discharge: 8 },
    { name: 'Feb', intake: 22, discharge: 12 },
    { name: 'Mar', intake: 18, discharge: 14 },
    { name: 'Apr', intake: 26, discharge: 10 },
    { name: 'May', intake: 30, discharge: 15 },
    { name: 'Jun', intake: 34, discharge: 18 },
  ];

  // Helper to render mini sparkline charts
  const renderSparkline = (data, color = '#4338CA') => (
    <div style={{ width: 60, height: 26 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, bottom: 2, left: 2, right: 2 }}>
          <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="mc-dashboard" style={{ padding: '0 8px 24px 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Welcome Top Banner */}
      <div className="mc-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
            Executive Administrative Center
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Welcome back, System Admin <strong>{currentUser?.firstName && currentUser?.lastName ? `${currentUser.firstName} ${currentUser.lastName}` : (currentUser?.username ? currentUser.username : 'Administrator')}</strong>. Practice system uptime is at 99.98% with active E2EE databases.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/audit-logs')} className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <SecurityOutlinedIcon style={{ fontSize: 14 }} /> System Audit Trail
          </button>
          <button onClick={() => navigate('/system-configuration')} className="mc-btn mc-btn-primary" style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <SettingsOutlinedIcon style={{ fontSize: 14 }} /> System Configurations
          </button>
        </div>
      </div>

      {/* Grid-14 Metrics Cards Layout (Gradient Cards with Sparklines) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        
        {/* Total Users */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Users</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>79</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>+6% this week</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 6, borderRadius: '50%' }}><GroupOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkUsers, '#4338CA')}
          </div>
        </div>

        {/* Total Clients */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Clients</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>154</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>+12% client rate</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#5B21B6', background: 'rgba(91, 33, 182, 0.1)', padding: 6, borderRadius: '50%' }}><PeopleOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkClients, '#5B21B6')}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Today's Appts</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>28</strong>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>8 active telehealth</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: 6, borderRadius: '50%' }}><CalendarMonthOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkAppts, '#F59E0B')}
          </div>
        </div>

        {/* Staff Distributions Summary */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.03) 0%, rgba(91, 33, 182, 0.03) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.1)', padding: 14, borderRadius: 14, 
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Active Therapists</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>14 providers</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Psychologists</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>6 clinical</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Psychiatrists</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>4 MDs</strong>
          </div>
        </div>

        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.03) 0%, rgba(91, 33, 182, 0.03) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.1)', padding: 14, borderRadius: 14, 
          display: 'flex', flexDirection: 'column', justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Supervisors</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>5 active</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Receptionists</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>3 desks</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>Case Managers</span>
            <strong style={{ fontSize: 11, color: '#1E1B4B' }}>8 staff</strong>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Monthly Revenue</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>$48,230</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>+6.4% this month</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: 6, borderRadius: '50%' }}><ReceiptOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkBilling, '#059669')}
          </div>
        </div>

        {/* Pending Audits */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, rgba(217, 119, 6, 0.04) 100%)', 
          border: '1px solid rgba(245, 158, 11, 0.25)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: '#D97706', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Pending Audits</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#B45309', margin: '4px 0', display: 'block' }}>3</strong>
            <span style={{ fontSize: 9, color: '#D97706', fontWeight: 700 }}>Needs Review</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#D97706', background: 'rgba(245, 158, 11, 0.1)', padding: 6, borderRadius: '50%' }}><ShieldOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkNotes, '#D97706')}
          </div>
        </div>

        {/* Billing Summary */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Claim Success</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>97.8%</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>$26,200 cleared</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: 6, borderRadius: '50%' }}><ReceiptOutlinedIcon style={{ fontSize: 18 }} /></div>
            {renderSparkline(sparkBilling, '#F59E0B')}
          </div>
        </div>

        {/* Secure Messages */}
        <div className="mc-card" style={{ 
          background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.05) 0%, rgba(91, 33, 182, 0.05) 100%)', 
          border: '1px solid rgba(67, 56, 202, 0.15)', padding: 14, borderRadius: 14, 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Unread Msgs</span>
            <strong style={{ fontSize: 22, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>2</strong>
            <span style={{ fontSize: 9, color: '#4338CA', fontWeight: 700 }}>E2EE Secure</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 6, borderRadius: '50%' }}><MessageOutlinedIcon style={{ fontSize: 18 }} /></div>
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 600 }}>Active</span>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        
        {/* Appointment Completion & Cancels */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Appointment Attendance Trends</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="completed" name="Completed" fill="#4338CA" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Client Active Growth */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Active Client Case growth</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clientGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338CA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4338CA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="active" stroke="#4338CA" fillOpacity={1} fill="url(#growthGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Billing Clearance Metrics */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Billing Revenue Breakdown</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={billingOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="insuranceClearance" name="Insurance Paid" fill="#4338CA" stackId="a" />
                <Bar dataKey="clientCopay" name="Client Copay" fill="#F59E0B" stackId="a" />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Measure Symptom tracking */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Mean Outcome Score Reductions</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={outcomeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="phq9" name="PHQ-9 (Depression)" stroke="#5B21B6" strokeWidth={2} />
                <Line type="monotone" dataKey="gad7" name="GAD-7 (Anxiety)" stroke="#F59E0B" strokeWidth={2} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Practitioner Role distribution */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Staff User Distribution</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Intake / Discharge activity */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Monthly Client Activity</h3>
          </div>
          <div className="mc-card-content" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="intake" name="New Intakes" fill="#4338CA" radius={[3, 3, 0, 0]} />
                <Bar dataKey="discharge" name="Discharges" fill="#C4B5FD" radius={[3, 3, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 3: Timelines, Quick Actions & Status Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        
        {/* Recent Timeline Feed */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Recent System & Administrative Activities</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16 }}>👤</span>
              <div>
                <strong style={{ fontSize: 11, display: 'block', color: 'var(--text-primary)' }}>New User Account Provisioned</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Clinician Dr. Mark Rivera assigned Psychiatrist credentials and caseload permissions.</span>
                <span style={{ fontSize: 8, color: 'var(--text-tertiary)', display: 'block', marginTop: 2 }}>1 hour ago · Audit Log #AL-9041</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <div>
                <strong style={{ fontSize: 11, display: 'block', color: 'var(--text-primary)' }}>RBAC Permission Policy Verified</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Therapist and Clinical Supervisor permission matrices re-indexed and locked.</span>
                <span style={{ fontSize: 8, color: 'var(--text-tertiary)', display: 'block', marginTop: 2 }}>2 hours ago · System Policy</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16 }}>💾</span>
              <div>
                <strong style={{ fontSize: 11, display: 'block', color: 'var(--text-primary)' }}>Encrypted Database Snapshot</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Daily automated MySQL backup completed successfully. SHA-256 integrity verified.</span>
                <span style={{ fontSize: 8, color: 'var(--text-tertiary)', display: 'block', marginTop: 2 }}>3 hours ago · Backup Engine</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16 }}>💵</span>
              <div>
                <strong style={{ fontSize: 11, display: 'block', color: 'var(--text-primary)' }}>Billing Insurance Clearance</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Batch Claim #CLM-9081 cleared by Blue Cross Blue Shield for $2,420.00.</span>
                <span style={{ fontSize: 8, color: 'var(--text-tertiary)', display: 'block', marginTop: 2 }}>4 hours ago · EDI 835 Processed</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16 }}>🔐</span>
              <div>
                <strong style={{ fontSize: 11, display: 'block', color: 'var(--text-primary)' }}>MFA & Session Security Audit</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Zero authentication anomalies detected across 79 active practice accounts.</span>
                <span style={{ fontSize: 8, color: 'var(--text-tertiary)', display: 'block', marginTop: 2 }}>5 hours ago · Security Watchdog</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Dashboard Tools */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column' }}>
          <div className="mc-card-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Administrative Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
            <Link to="/clients/new" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>👤</span>
              Register Client
            </Link>
            <Link to="/calendar" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>📅</span>
              Create Appt
            </Link>
            <Link to="/users" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>👥</span>
              Manage Users
            </Link>
            <Link to="/reports" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>📊</span>
              View Reports
            </Link>
            <Link to="/analytics" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>📈</span>
              Analytics
            </Link>
            <Link to="/audit-logs" className="mc-btn mc-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 80, gap: 6, fontSize: 11, textAlign: 'center', borderRadius: 12 }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              Audit Logs
            </Link>
          </div>
        </div>

        {/* Real-time System Connectivity Status */}
        <div className="mc-card" style={{ padding: 16, borderRadius: 16 }}>
          <div className="mc-card-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 12 }}>
            <h3 className="mc-card-title" style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>System Health Monitor</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            
            {/* System Uptime */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.05)', padding: 10, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiberManualRecordIcon style={{ fontSize: 10, color: '#10B981' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46' }}>System Status</span>
              </div>
              <strong style={{ fontSize: 11, color: '#065F46' }}>Operational (100%)</strong>
            </div>

            {/* Database connectivity */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.05)', padding: 10, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiberManualRecordIcon style={{ fontSize: 10, color: '#10B981' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46' }}>Database Engine</span>
              </div>
              <strong style={{ fontSize: 11, color: '#065F46' }}>Connected (MySQL 8)</strong>
            </div>

            {/* Core API Server status */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', background: 'rgba(16, 185, 129, 0.05)', padding: 10, borderRadius: 10, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FiberManualRecordIcon style={{ fontSize: 10, color: '#10B981' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#065F46' }}>REST Services</span>
              </div>
              <strong style={{ fontSize: 11, color: '#065F46' }}>Active (Spring Boot)</strong>
            </div>

            {/* Build Version info */}
            <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', background: '#F8F9FA', padding: 10, borderRadius: 10, border: '1px solid #EAECF0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldOutlinedIcon style={{ fontSize: 12, color: '#667085' }} />
                <span style={{ fontSize: 11, color: '#344054' }}>Client Build Version</span>
              </div>
              <strong style={{ fontSize: 11, color: '#344054' }}>v1.0.0-Stable</strong>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
