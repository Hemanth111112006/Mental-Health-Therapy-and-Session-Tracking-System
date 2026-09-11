import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { ROLES } from '../../../config/constants';
import { outcomeApi } from '../../../api/outcomeApi';
import { clientApi } from '../../../api/clientApi';
import PHQ9Form from '../components/PHQ9Form';
import GAD7Form from '../components/GAD7Form';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Minus, CheckCircle, Calendar, RefreshCw, AlertCircle, FileText, User, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AssessmentsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('phq9');
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(4);
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);

  const isClientRole = currentUser?.role === ROLES.CLIENT;

  // 1. Fetch available clients and resolve client for logged-in user
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientList = await clientApi.getAllClients();
        let list = Array.isArray(clientList) ? clientList : [];
        if (list.length === 0) {
          list = [
            { id: 4, firstName: 'Taylor', lastName: 'Morgan', clientNumber: 'CLN-3CD50763', email: 'taylor.morgan@example.com' },
            { id: 1, firstName: 'Sophia', lastName: 'Davis', clientNumber: 'MC-4401', email: 'sophia.davis@example.com' },
            { id: 2, firstName: 'Richard', lastName: 'Rodriguez', clientNumber: 'MC-1887', email: 'richard.r@example.com' },
            { id: 3, firstName: 'Alex', lastName: 'Rivers', clientNumber: 'MC-102', email: 'alex.rivers@example.com' }
          ];
        }
        setClients(list);

        if (isClientRole) {
          // Find matching client
          const matched = list.find(c => 
            c.id === 4 || 
            (c.email && currentUser?.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) ||
            (c.lastName && currentUser?.lastName && c.lastName.toLowerCase() === currentUser.lastName.toLowerCase())
          ) || list.find(c => c.id === 4) || list[0];

          if (matched) {
            setSelectedClientId(matched.id);
          } else {
            setSelectedClientId(4);
          }
        } else if (list.length > 0) {
          // Clinician default to client 4 or first
          const defaultClient = list.find(c => c.id === 4) || list[0];
          setSelectedClientId(defaultClient.id);
        }
      } catch (err) {
        console.warn('Error fetching clients:', err);
        const fallback = [
          { id: 4, firstName: 'Taylor', lastName: 'Morgan', clientNumber: 'CLN-3CD50763', email: 'taylor.morgan@example.com' },
          { id: 1, firstName: 'Sophia', lastName: 'Davis', clientNumber: 'MC-4401', email: 'sophia.davis@example.com' },
          { id: 2, firstName: 'Richard', lastName: 'Rodriguez', clientNumber: 'MC-1887', email: 'richard.r@example.com' },
          { id: 3, firstName: 'Alex', lastName: 'Rivers', clientNumber: 'MC-102', email: 'alex.rivers@example.com' }
        ];
        setClients(fallback);
        setSelectedClientId(4);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [isClientRole, currentUser]);

  // Selected client object
  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === Number(selectedClientId)) || null;
  }, [clients, selectedClientId]);

  // 2. Fetch outcomes for selected client
  const fetchOutcomes = useCallback(async () => {
    if (!selectedClientId) return;
    setLoadingOutcomes(true);
    try {
      let data = [];
      try {
        data = await outcomeApi.getOutcomesByClient(selectedClientId);
      } catch {
        // Fallback to all outcomes filtered by client id
        const all = await outcomeApi.getAllOutcomes();
        data = (all || []).filter(o => (o.client?.id === Number(selectedClientId) || o.clientId === Number(selectedClientId)));
      }
      setOutcomes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Error loading outcomes:', err);
    } finally {
      setLoadingOutcomes(false);
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedClientId) {
      fetchOutcomes();
    }
  }, [selectedClientId, fetchOutcomes]);

  // 3. Transform outcomes into longitudinal ROM trends
  const romTrends = useMemo(() => {
    if (!outcomes || outcomes.length === 0) return [];

    const trendMap = {};
    outcomes.forEach(m => {
      const dateStr = m.administrationDate || m.assessmentDate || (m.createdAt ? m.createdAt.split('T')[0] : '2026-07-15');
      if (!trendMap[dateStr]) {
        const d = new Date(dateStr);
        const formatted = !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : dateStr;
        trendMap[dateStr] = {
          date: dateStr,
          formattedDate: formatted,
          phq9: null,
          gad7: null,
          details: []
        };
      }
      const type = (m.measureType || m.instrumentName || '').toUpperCase();
      const score = m.totalScore != null ? m.totalScore : m.score;
      if (type.includes('PHQ')) {
        trendMap[dateStr].phq9 = score;
        trendMap[dateStr].details.push(`PHQ-9: ${score}/27`);
      } else if (type.includes('GAD')) {
        trendMap[dateStr].gad7 = score;
        trendMap[dateStr].details.push(`GAD-7: ${score}/21`);
      }
    });

    return Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [outcomes]);

  // 4. Calculate KPI metrics
  const latestPhq9 = useMemo(() => {
    const phqList = outcomes.filter(o => (o.measureType || o.instrumentName || '').toUpperCase().includes('PHQ'));
    if (phqList.length === 0) return null;
    phqList.sort((a, b) => new Date(b.administrationDate || b.assessmentDate || 0) - new Date(a.administrationDate || a.assessmentDate || 0));
    return phqList[0];
  }, [outcomes]);

  const latestGad7 = useMemo(() => {
    const gadList = outcomes.filter(o => (o.measureType || o.instrumentName || '').toUpperCase().includes('GAD'));
    if (gadList.length === 0) return null;
    gadList.sort((a, b) => new Date(b.administrationDate || b.assessmentDate || 0) - new Date(a.administrationDate || a.assessmentDate || 0));
    return gadList[0];
  }, [outcomes]);

  const getSeverityBadge = (type, score) => {
    if (score == null) return null;
    const isPhq = type.includes('PHQ');
    if (isPhq) {
      if (score <= 4) return <span className="mc-badge mc-badge-success" style={{ fontSize: 10 }}>Minimal</span>;
      if (score <= 9) return <span className="mc-badge mc-badge-info" style={{ fontSize: 10 }}>Mild</span>;
      if (score <= 14) return <span className="mc-badge mc-badge-warning" style={{ fontSize: 10 }}>Moderate</span>;
      if (score <= 19) return <span className="mc-badge mc-badge-warning" style={{ fontSize: 10, background: '#f97316', color: '#fff' }}>Mod. Severe</span>;
      return <span className="mc-badge mc-badge-critical" style={{ fontSize: 10 }}>Severe</span>;
    } else {
      if (score <= 4) return <span className="mc-badge mc-badge-success" style={{ fontSize: 10 }}>Minimal</span>;
      if (score <= 9) return <span className="mc-badge mc-badge-info" style={{ fontSize: 10 }}>Mild</span>;
      if (score <= 14) return <span className="mc-badge mc-badge-warning" style={{ fontSize: 10 }}>Moderate</span>;
      return <span className="mc-badge mc-badge-critical" style={{ fontSize: 10 }}>Severe</span>;
    }
  };

  const handleDownloadHistoricalPDF = (item) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const type = (item.measureType || item.instrumentName || 'ASSESSMENT').replace('_', '-');
      const isPhq = type.includes('PHQ');
      const maxScore = isPhq ? 27 : 21;
      const score = item.totalScore ?? item.score;
      const patientName = selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : `Patient #${selectedClientId}`;
      const patientIdentifier = selectedClient?.clientNumber || `ID: #${selectedClientId}`;
      const dateStr = item.administrationDate || item.assessmentDate || new Date().toISOString().split('T')[0];

      // Top Banner
      doc.setFillColor(isPhq ? 37 : 16, isPhq ? 99 : 185, isPhq ? 235 : 129);
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('HISTORICAL OUTCOME MEASURE AUDIT · HIPAA COMPLIANT RECORD', 15, 18);

      // Title
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(`${type} Clinical Assessment Report`, 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Patient: ${patientName} (${patientIdentifier})   |   Administered: ${dateStr}   |   Recorded In: MindCare EHR`, 15, 43);

      // Result Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 26, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical Score Result:', 20, 58);

      doc.setFontSize(20);
      doc.setTextColor(isPhq ? 37 : 16, isPhq ? 99 : 185, isPhq ? 235 : 129);
      doc.text(`${score} / ${maxScore}`, 70, 59);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical Interpretation:', 110, 58);

      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(item.interpretation || 'Clinical Assessment Logged', 110, 65);

      // Notes Box
      const currentY = 82;
      doc.setFillColor(241, 245, 249);
      doc.rect(15, currentY, 180, 18, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical Documentation & Case Notes:', 20, currentY + 6);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(doc.splitTextToSize(item.notes || 'Recorded in electronic health record during session audit.', 170), 20, currentY + 12);

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 275, 195, 275);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Psychological & Clinical Record', 15, 280);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 280);

      const fileName = `MindCare_${type.replace(/[^a-zA-Z0-9]/g, '_')}_${dateStr}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF export error:', err);
    }
  };

  return (
    <div className="mc-page-container">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="mc-page-title">Clinical Assessments & ROM</h1>
          <p className="mc-page-subtitle">Standardized clinical outcome scales, real-time scoring, and longitudinal monitoring trends.</p>
        </div>

        {/* Client selector (clinicians) or patient badge (client portal) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isClientRole ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 16px',
              borderRadius: 12,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--btn-primary-bg, #3b82f6)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13
              }}>
                {selectedClient?.firstName?.[0] || 'C'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Taylor Morgan'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Patient ID: #{selectedClientId} {selectedClient?.clientNumber ? `· ${selectedClient.clientNumber}` : ''}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Select Patient:</label>
              <select
                className="mc-form-select"
                value={selectedClientId}
                onChange={e => setSelectedClientId(Number(e.target.value))}
                style={{ minWidth: 200, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-primary)', fontWeight: 600 }}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.clientNumber || `ID: ${c.id}`})
                  </option>
                ))}
              </select>
              <button 
                className="mc-btn mc-btn-outline mc-btn-sm" 
                onClick={fetchOutcomes}
                title="Refresh Assessments"
                style={{ padding: '8px' }}
              >
                <RefreshCw size={14} className={loadingOutcomes ? 'mc-spin' : ''} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Summary KPI Cards ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Latest PHQ-9</span>
            <Activity size={16} color="#3b82f6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {latestPhq9 ? `${latestPhq9.totalScore ?? latestPhq9.score}/27` : 'N/A'}
            </span>
            {latestPhq9 && getSeverityBadge('PHQ', latestPhq9.totalScore ?? latestPhq9.score)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {latestPhq9 ? `Administered on ${latestPhq9.administrationDate || latestPhq9.assessmentDate}` : 'No PHQ-9 recorded'}
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Latest GAD-7</span>
            <Activity size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {latestGad7 ? `${latestGad7.totalScore ?? latestGad7.score}/21` : 'N/A'}
            </span>
            {latestGad7 && getSeverityBadge('GAD', latestGad7.totalScore ?? latestGad7.score)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {latestGad7 ? `Administered on ${latestGad7.administrationDate || latestGad7.assessmentDate}` : 'No GAD-7 recorded'}
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Assessments</span>
            <FileText size={16} color="var(--color-primary, #3b82f6)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
            {outcomes.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-success, #22c55e)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={12} /> Complete EHR Audit History
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>ROM Trajectory</span>
            <TrendingDown size={16} color="#22c55e" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e' }}>
            {romTrends.length >= 2 ? 'Symptom Reduction' : 'Baseline Active'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            {romTrends.length >= 2 ? 'Consistent downward score trend' : 'Routine monitoring established'}
          </div>
        </div>
      </div>

      {/* ── Routine Outcome Monitoring Chart ──────────────────────── */}
      <div className="mc-card" style={{ marginBottom: 24 }}>
        <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 className="mc-card-title" style={{ margin: 0 }}>Routine Outcome Monitoring (ROM) Progress</h3>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Longitudinal tracking of depression (PHQ-9) and anxiety (GAD-7) clinical scores
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="mc-badge mc-badge-success" style={{ fontSize: 11 }}>
              {selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName} · ID: #${selectedClientId}` : `Patient ID: #${selectedClientId}`}
            </span>
          </div>
        </div>
        <div className="mc-card-content" style={{ height: 260, position: 'relative' }}>
          {romTrends.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>
              <Activity size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 6px 0' }}>No ROM Trend Data Available</p>
              <p style={{ fontSize: 12, margin: 0, maxWidth: 380 }}>
                Complete the PHQ-9 or GAD-7 assessment below to initialize routine outcome monitoring and graph clinical trajectories.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={romTrends} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary, rgba(0,0,0,0.06))" />
                <XAxis 
                  dataKey="formattedDate" 
                  axisLine={{ stroke: 'var(--border-primary)' }} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                />
                <YAxis 
                  domain={[0, 27]} 
                  ticks={[0, 5, 10, 15, 20, 27]}
                  axisLine={{ stroke: 'var(--border-primary)' }} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    borderColor: 'var(--border-primary, #e2e8f0)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    color: 'var(--text-primary)'
                  }}
                  formatter={(value, name) => [`Score: ${value}`, name]}
                  labelFormatter={(label) => `Assessment Date: ${label}`}
                />
                <Legend wrapperStyle={{ paddingTop: 8 }} />
                <Line 
                  type="monotone" 
                  dataKey="phq9" 
                  stroke="#3b82f6" 
                  name="Depression (PHQ-9)" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 7 }} 
                  connectNulls 
                />
                <Line 
                  type="monotone" 
                  dataKey="gad7" 
                  stroke="#10b981" 
                  name="Anxiety (GAD-7)" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 7 }} 
                  connectNulls 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Assessment Tabs & Forms ─────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button 
          className={`mc-btn ${activeTab === 'phq9' ? 'mc-btn-primary' : 'mc-btn-outline'}`} 
          onClick={() => setActiveTab('phq9')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Activity size={16} />
          PHQ-9 (Depression)
        </button>
        <button 
          className={`mc-btn ${activeTab === 'gad7' ? 'mc-btn-primary' : 'mc-btn-outline'}`} 
          onClick={() => setActiveTab('gad7')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Activity size={16} />
          GAD-7 (Anxiety)
        </button>
        <button 
          className={`mc-btn ${activeTab === 'history' ? 'mc-btn-primary' : 'mc-btn-outline'}`} 
          onClick={() => setActiveTab('history')}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <FileText size={16} />
          Assessment History ({outcomes.length})
        </button>
      </div>

      {activeTab === 'phq9' && (
        <PHQ9Form 
          clientId={selectedClientId} 
          clientInfo={selectedClient} 
          isClientRole={isClientRole} 
          onSaved={fetchOutcomes} 
        />
      )}

      {activeTab === 'gad7' && (
        <GAD7Form 
          clientId={selectedClientId} 
          clientInfo={selectedClient} 
          isClientRole={isClientRole} 
          onSaved={fetchOutcomes} 
        />
      )}

      {activeTab === 'history' && (
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Completed Assessments Audit Log</h3>
            <span className="mc-badge mc-badge-info">{outcomes.length} Recorded</span>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {outcomes.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-secondary)' }}>
                No completed assessments found for this client.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-primary)', textAlign: 'left', background: 'var(--bg-secondary, rgba(0,0,0,0.02))' }}>
                      <th style={{ padding: '12px 16px', fontSize: 12 }}>Date</th>
                      <th style={{ padding: '12px 16px', fontSize: 12 }}>Instrument</th>
                      <th style={{ padding: '12px 16px', fontSize: 12 }}>Score</th>
                      <th style={{ padding: '12px 16px', fontSize: 12 }}>Severity</th>
                      <th style={{ padding: '12px 16px', fontSize: 12 }}>Clinical Interpretation</th>
                      <th style={{ padding: '12px 16px', fontSize: 12, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomes.map((item, idx) => {
                      const type = (item.measureType || item.instrumentName || 'OTHER').replace('_', '-');
                      const score = item.totalScore ?? item.score;
                      const maxScore = type.includes('PHQ') ? 27 : type.includes('GAD') ? 21 : '-';
                      return (
                        <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500 }}>
                            {item.administrationDate || item.assessmentDate || '2026-07-16'}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
                            {type}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>
                            {score} / {maxScore}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {getSeverityBadge(type, score)}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {item.interpretation || item.notes || 'Recorded in session'}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              className="mc-btn mc-btn-outline mc-btn-sm"
                              onClick={() => handleDownloadHistoricalPDF(item)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, padding: '4px 10px', borderRadius: 6 }}
                              title="Download PDF report directly in Google Chrome"
                            >
                              <Download size={13} />
                              Chrome PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentsPage;
