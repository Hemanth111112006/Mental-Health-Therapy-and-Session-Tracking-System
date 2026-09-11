import { toast } from '../../../../utils/toast';
import React, { useState } from 'react';
import { PieChart, TrendingUp, Users, DollarSign, Calendar, Activity, Download } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { jsPDF } from 'jspdf';

// ── Revenue data with positive-trending values ─────────────────────────────────
const ALL_REVENUE_DATA = {
  '1M': [
    { name: 'Wk 1', revenue: 9800,  expenses: 4200 },
    { name: 'Wk 2', revenue: 10400, expenses: 4500 },
    { name: 'Wk 3', revenue: 11200, expenses: 4800 },
    { name: 'Wk 4', revenue: 12890, expenses: 5100 },
  ],
  '3M': [
    { name: 'Jul', revenue: 38400, expenses: 16000 },
    { name: 'Aug', revenue: 42100, expenses: 17200 },
    { name: 'Sep', revenue: 48230, expenses: 18800 },
  ],
  '6M': [
    { name: 'Apr', revenue: 28000, expenses: 12400 },
    { name: 'May', revenue: 31500, expenses: 13800 },
    { name: 'Jun', revenue: 36200, expenses: 15200 },
    { name: 'Jul', revenue: 38400, expenses: 16000 },
    { name: 'Aug', revenue: 42100, expenses: 17200 },
    { name: 'Sep', revenue: 48230, expenses: 18800 },
  ],
  '1Y': [
    { name: 'Oct', revenue: 18000, expenses: 9000 },
    { name: 'Nov', revenue: 21000, expenses: 10200 },
    { name: 'Dec', revenue: 24500, expenses: 11000 },
    { name: 'Jan', revenue: 22000, expenses: 10500 },
    { name: 'Feb', revenue: 25800, expenses: 11800 },
    { name: 'Mar', revenue: 28000, expenses: 12400 },
    { name: 'Apr', revenue: 31500, expenses: 13800 },
    { name: 'May', revenue: 34200, expenses: 14500 },
    { name: 'Jun', revenue: 36200, expenses: 15200 },
    { name: 'Jul', revenue: 38400, expenses: 16000 },
    { name: 'Aug', revenue: 42100, expenses: 17200 },
    { name: 'Sep', revenue: 48230, expenses: 18800 },
  ],
};

const ALL_PATIENT_DATA = {
  '1M': [
    { name: 'Wk 1', patients: 1120 },
    { name: 'Wk 2', patients: 1148 },
    { name: 'Wk 3', patients: 1180 },
    { name: 'Wk 4', patients: 1204 },
  ],
  '3M': [
    { name: 'Jul', patients: 1050 },
    { name: 'Aug', patients: 1140 },
    { name: 'Sep', patients: 1204 },
  ],
  '6M': [
    { name: 'Apr', patients: 870 },
    { name: 'May', patients: 940 },
    { name: 'Jun', patients: 1010 },
    { name: 'Jul', patients: 1050 },
    { name: 'Aug', patients: 1140 },
    { name: 'Sep', patients: 1204 },
  ],
  '1Y': [
    { name: 'Oct', patients: 420 },
    { name: 'Nov', patients: 510 },
    { name: 'Dec', patients: 580 },
    { name: 'Jan', patients: 650 },
    { name: 'Feb', patients: 730 },
    { name: 'Mar', patients: 800 },
    { name: 'Apr', patients: 870 },
    { name: 'May', patients: 940 },
    { name: 'Jun', patients: 1010 },
    { name: 'Jul', patients: 1050 },
    { name: 'Aug', patients: 1140 },
    { name: 'Sep', patients: 1204 },
  ],
};

const KPI_CARDS = [
  { title: 'Total Revenue', value: '$84,290', trend: 12.5, icon: DollarSign, color: '#3B82F6' },
  { title: 'Active Users',  value: '1,204',  trend: 8.2,  icon: Users,       color: '#8B5CF6' },
  { title: 'Total Sessions',value: '4,822',  trend: 14.1, icon: Calendar,    color: '#10B981' },
  { title: 'System Uptime', value: '99.9%',  trend: 0.1,  icon: Activity,    color: '#F59E0B' },
];

// ── Currency formatter ─────────────────────────────────────────────────────────
const fmtCurrency = (v) => `$${(v / 1000).toFixed(0)}k`;

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('6M');

  const revenueData  = ALL_REVENUE_DATA[timeRange]  || ALL_REVENUE_DATA['6M'];
  const patientData  = ALL_PATIENT_DATA[timeRange]  || ALL_PATIENT_DATA['6M'];

  // ── jsPDF Export ──────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Header banner
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 297, 22, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 14, 11);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('ADMIN ANALYTICS DASHBOARD  ·  HIPAA COMPLIANT  ·  CONFIDENTIAL', 14, 18);

      // Report metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Admin Analytics Report', 14, 34);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const now = new Date().toLocaleString();
      doc.text(`Generated: ${now}   |   Period: ${timeRange}   |   Classification: Administrative KPIs`, 14, 40);

      // KPI boxes
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Key Performance Indicators', 14, 52);

      const boxW = 64, boxH = 20, gap = 5, startX = 14;
      KPI_CARDS.forEach((kpi, i) => {
        const x = startX + i * (boxW + gap);
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(x, 56, boxW, boxH, 2, 2, 'FD');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(kpi.title.toUpperCase(), x + 4, 62);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(String(kpi.value), x + 4, 72);
        doc.setFontSize(8);
        doc.setTextColor(16, 185, 129);
        doc.text(`+${kpi.trend}% vs last month`, x + 4, 78);
      });

      // Revenue data table
      let y = 90;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Revenue Overview (${timeRange})`, 14, y);
      y += 6;

      doc.setFillColor(37, 99, 235);
      doc.rect(14, y, 268, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      ['Period', 'Revenue', 'Expenses', 'Net Income', 'Margin'].forEach((h, i) => {
        doc.text(h, 16 + i * 54, y + 5.5);
      });
      y += 8;

      revenueData.forEach((row, idx) => {
        if (idx % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(14, y, 268, 8, 'F'); }
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const net = row.revenue - row.expenses;
        const margin = ((net / row.revenue) * 100).toFixed(1);
        [row.name, `$${row.revenue.toLocaleString()}`, `$${row.expenses.toLocaleString()}`, `$${net.toLocaleString()}`, `${margin}%`].forEach((val, i) => {
          doc.text(String(val), 16 + i * 54, y + 5.5);
        });
        y += 8;
      });

      // Patient growth table
      y += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Patient Growth (${timeRange})`, 14, y);
      y += 6;

      doc.setFillColor(16, 185, 129);
      doc.rect(14, y, 120, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      ['Period', 'Active Patients', 'Growth'].forEach((h, i) => {
        doc.text(h, 16 + i * 40, y + 5.5);
      });
      y += 8;

      patientData.forEach((row, idx) => {
        if (idx % 2 === 0) { doc.setFillColor(236, 253, 245); doc.rect(14, y, 120, 8, 'F'); }
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        const prev = idx > 0 ? patientData[idx - 1].patients : row.patients;
        const growth = idx > 0 ? `+${(((row.patients - prev) / prev) * 100).toFixed(1)}%` : '—';
        [row.name, String(row.patients), growth].forEach((val, i) => {
          doc.text(val, 16 + i * 40, y + 5.5);
        });
        y += 8;
      });

      // HIPAA footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 192, 297, 8, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text('CONFIDENTIAL — MindCare EHR System | HIPAA Compliant | This document contains protected administrative data. Unauthorized disclosure is prohibited.', 14, 197);

      doc.save(`MindCare_Admin_Analytics_${timeRange}_${new Date().toLocaleDateString('en-CA')}.pdf`);
      toast.success('Admin Analytics PDF exported successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF export failed. Please try again.');
    }
  };

  const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div className="mc-card" style={{
      padding: '20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px',
      border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: 180
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
        </div>
        <div style={{ padding: '10px', backgroundColor: `${color}20`, color, borderRadius: '8px' }}>
          <Icon size={20} />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}>
        <span style={{ color: trend >= 0 ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', gap: '2px' }}>
          <TrendingUp size={12} style={{ transform: trend < 0 ? 'scaleY(-1)' : 'none' }} />
          {Math.abs(trend)}%
        </span>
        <span style={{ color: 'var(--text-secondary)' }}>vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--color-primary, #3B82F6)', color: 'white', borderRadius: '8px', display: 'flex' }}>
            <PieChart size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Analytics</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Real-time dashboard with KPIs and growth charts.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Time range selector */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', overflow: 'hidden', padding: '2px' }}>
            {['1M', '3M', '6M', '1Y'].map(v => (
              <button
                key={v}
                onClick={() => setTimeRange(v)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: timeRange === v ? 'var(--color-primary, #3B82F6)' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: timeRange === v ? 600 : 500,
                  color: timeRange === v ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: timeRange === v ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.15s',
                }}
              >{v}</button>
            ))}
          </div>
          {/* jsPDF Export */}
          <button
            onClick={handleExportPDF}
            className="mc-btn mc-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {KPI_CARDS.map(k => <StatCard key={k.title} {...k} />)}
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* Revenue Bar Chart — uses distinct blue + red bars */}
        <div className="mc-card" style={{ flex: '1 1 460px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Revenue Overview</h2>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmtCurrency} />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.06)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: 12 }}
                  formatter={(v, name) => [`$${v.toLocaleString()}`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Growth Area Chart */}
        <div className="mc-card" style={{ flex: '1 1 460px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Patient Growth</h2>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <AreaChart data={patientData}>
                <defs>
                  <linearGradient id="colorPatientsAdmin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', fontSize: 12 }}
                  formatter={(v) => [v.toLocaleString(), 'Active Patients']}
                />
                <Area type="monotone" dataKey="patients" name="Active Patients" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPatientsAdmin)" dot={{ fill: '#10B981', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Avg Session Revenue', value: '$174.80', sub: 'Per completed session (Sep 2026)', color: '#3B82F6' },
          { label: 'Insurance Clearance Rate', value: '97.8%', sub: 'BCBS / Aetna / UHC combined', color: '#10B981' },
          { label: 'Staff Utilization', value: '91.4%', sub: 'Across 18 active providers', color: '#8B5CF6' },
          { label: 'No-Show Rate', value: '2.8%', sub: 'Below 5% clinical benchmark', color: '#F59E0B' },
        ].map(c => (
          <div key={c.label} className="mc-card" style={{ flex: '1 1 180px', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: c.color, marginBottom: 2 }}>{c.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminAnalyticsPage;
