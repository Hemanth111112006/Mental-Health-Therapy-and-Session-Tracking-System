import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ComposedChart
} from 'recharts';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';

const Analytics = () => {
  // Realistic healthcare analytics database
  const outcomeStats = [
    { name: 'Intake', score: 18.5, activeCount: 64 },
    { name: 'Week 2', score: 15.2, activeCount: 58 },
    { name: 'Week 4', score: 12.1, activeCount: 52 },
    { name: 'Week 6', score: 9.8, activeCount: 45 },
    { name: 'Week 8', score: 7.4, activeCount: 38 },
    { name: 'Discharge', score: 5.2, activeCount: 32 }
  ];

  const sessionDistribution = [
    { name: 'CBT Sessions', value: 142, fill: '#4338CA' },
    { name: 'DBT Modalities', value: 98, fill: '#5B21B6' },
    { name: 'EMDR Trauma', value: 45, fill: '#F59E0B' },
    { name: 'Med Consults', value: 87, fill: '#C4B5FD' },
    { name: 'Intake Screeners', value: 64, fill: '#38BDF8' }
  ];

  const claimsResolution = [
    { month: 'Jan', submitted: 120, cleared: 112, denied: 8 },
    { month: 'Feb', submitted: 135, cleared: 128, denied: 7 },
    { month: 'Mar', submitted: 150, cleared: 144, denied: 6 },
    { month: 'Apr', submitted: 142, cleared: 134, denied: 8 },
    { month: 'May', submitted: 168, cleared: 161, denied: 7 },
    { month: 'Jun', submitted: 184, cleared: 178, denied: 6 }
  ];

  const clientAgeDemographics = [
    { name: '18-25 yrs', value: 34, color: '#4338CA' },
    { name: '26-35 yrs', value: 58, color: '#5B21B6' },
    { name: '36-50 yrs', value: 42, color: '#F59E0B' },
    { name: '51+ yrs', value: 20, color: '#C4B5FD' }
  ];

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
            <BarChartOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> Executive Clinical Analytics
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Real-time visual monitoring of clinical outcomes recovery progress, operational session distributions, and claims billing clearances.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => (() => { window.print(); })()}>
            <PictureAsPdfOutlinedIcon style={{ fontSize: 14, color: 'red' }} /> Generate PDF Analytics
          </button>
        </div>
      </div>

      {/* Grid of charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16 }}>
        
        {/* Outcome Score Reduction Trends */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Clinical Outcome Recovery Curves (Routine Outcome Monitoring)</h3>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={outcomeStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="score" name="Mean GAD-7 / PHQ-9 Symptom Score" stroke="#4338CA" strokeWidth={3} />
                <Bar dataKey="activeCount" name="Active Monitored Cases" fill="#C4B5FD" radius={[3, 3, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insurance Claims Resolution clearances */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Insurance Claims Resolution Ratios</h3>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimsResolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="submitted" name="Claims Submitted" fill="#4338CA" radius={[3, 3, 0, 0]} />
                <Bar dataKey="cleared" name="Claims Cleared" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="denied" name="Claims Denied" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Therapy Modalities session distribution */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Therapeutic Modalities Session Volume</h3>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionDistribution} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-primary)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#4338CA" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Demographics pie distribution */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 12 }}>
          <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Active Client Age Demographics</h3>
          </div>
          <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientAgeDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientAgeDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;

