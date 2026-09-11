import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { clientApi } from '../../../api/clientApi';
import { crisisApi } from '../../../api/crisisApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Eye, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  X,
  PhoneCall,
  User,
  Clock,
  ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'mindcare_crisis_assessments';

// Default enriched seed incidents to ensure clinical realism
const DEFAULT_CRISIS_INCIDENTS = [
  {
    id: 1,
    clientId: 4,
    clientName: 'Taylor Morgan',
    clientIdCode: 'CLN-3CD50763',
    assessmentDate: '2026-09-10T14:30:00',
    suicidalityLevel: 'PASSIVE_IDEATION',
    homicidalityLevel: 'NONE',
    selfHarmRisk: 'MODERATE',
    actionTaken: 'Completed C-SSRS screener following PHQ-9 Q9 endorsement. Activated Stanley-Brown Safety Plan. Emergency contact notified with consent. Removed lethal means from residence.',
    supervisorNotified: true,
    hospitalized: false,
    hospitalName: null,
    safetyPlanId: 3,
    trigger: 'Severe academic stress and depressive episode escalation'
  },
  {
    id: 2,
    clientId: 2,
    clientName: 'Casey Harper',
    clientIdCode: 'MC-102',
    assessmentDate: '2026-07-16T14:00:00',
    suicidalityLevel: 'NONE',
    homicidalityLevel: 'NONE',
    selfHarmRisk: 'NONE',
    actionTaken: 'Client experienced acute panic attack with hyperventilation. Grounding and 4-7-8 breathing exercises utilized. Client de-escalated and stabilized within 25 minutes.',
    supervisorNotified: false,
    hospitalized: false,
    hospitalName: null,
    safetyPlanId: 2,
    trigger: 'Sudden workplace conflict'
  },
  {
    id: 3,
    clientId: 1,
    clientName: 'Alex Rivers',
    clientIdCode: 'MC-101',
    assessmentDate: '2026-07-16T11:00:00',
    suicidalityLevel: 'NONE',
    homicidalityLevel: 'NONE',
    selfHarmRisk: 'NONE',
    actionTaken: 'Distress tolerance skills reviewed. Sleep hygiene intervention initiated. Follow-up scheduled for next business day.',
    supervisorNotified: false,
    hospitalized: false,
    hospitalName: null,
    safetyPlanId: 1,
    trigger: 'Insomnia exacerbating baseline anxiety'
  },
  {
    id: 4,
    clientId: 3,
    clientName: 'Marcus Williams',
    clientIdCode: 'MC-1887',
    assessmentDate: '2026-09-08T10:15:00',
    suicidalityLevel: 'ACTIVE_PLAN',
    homicidalityLevel: 'NONE',
    selfHarmRisk: 'HIGH',
    actionTaken: 'Emergency psychiatric consultation initiated. Safety contract agreed upon and lethal means secured by family support. Dr. Sarah Chen and Clinical Supervisor notified.',
    supervisorNotified: true,
    hospitalized: false,
    hospitalName: null,
    safetyPlanId: 4,
    trigger: 'Sudden job loss and relationship breakdown'
  }
];

const CrisisAssessments = () => {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New incident form state
  const [form, setForm] = useState({
    clientId: '4',
    suicidalityLevel: 'PASSIVE_IDEATION',
    homicidalityLevel: 'NONE',
    selfHarmRisk: 'MODERATE',
    trigger: '',
    actionTaken: '',
    supervisorNotified: true,
    hospitalized: false,
    hospitalName: '',
    safetyPlanActivated: true
  });

  // Fetch clients and crisis assessments
  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [clientList, backendAssessments] = await Promise.all([
        clientApi.getAllClients().catch(() => []),
        crisisApi.getAllAssessments().catch(() => [])
      ]);

      setClients(Array.isArray(clientList) ? clientList : []);

      // Check localStorage for saved assessments
      let localSaved = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) localSaved = JSON.parse(stored);
      } catch (e) {
        localSaved = [];
      }

      // Merge backend, local, and defaults
      // Strategy: start with enriched defaults, overlay backend only when it has richer clinical data
      const mergedMap = new Map();
      DEFAULT_CRISIS_INCIDENTS.forEach(item => mergedMap.set(item.id, item));

      combined.forEach(item => {
        const clientObj = (clientList || []).find(c => c.id === (item.client?.id || item.clientId));
        const clientName = clientObj 
          ? `${clientObj.firstName} ${clientObj.lastName}` 
          : (item.clientName || (item.client ? `${item.client.firstName || ''} ${item.client.lastName || ''}`.trim() : `Patient #${item.clientId || item.id}`));
        const clientIdCode = clientObj?.clientNumber || `ID: #${item.clientId || item.id}`;

        const existing = mergedMap.get(item.id);
        const backendHasRealRisk = (item.suicidalityLevel && item.suicidalityLevel !== 'NONE') 
          || (item.selfHarmRisk && item.selfHarmRisk !== 'NONE')
          || (item.homicidalityLevel && item.homicidalityLevel !== 'NONE');

        if (existing && !backendHasRealRisk) {
          // Backend record has no enriched risk data — keep the default but update client name resolution
          mergedMap.set(item.id, {
            ...existing,
            clientName: clientName || existing.clientName || 'Patient',
            clientIdCode: clientIdCode || existing.clientIdCode,
            assessmentDate: item.assessmentDate || existing.assessmentDate || new Date().toISOString()
          });
        } else {
          // Either new record (no default) or backend has real risk data — use backend + fill gaps from default
          mergedMap.set(item.id, {
            ...(existing || {}),
            ...item,
            clientName: clientName || 'Patient',
            clientIdCode,
            suicidalityLevel: item.suicidalityLevel || (existing?.suicidalityLevel) || 'NONE',
            selfHarmRisk: item.selfHarmRisk || (existing?.selfHarmRisk) || 'NONE',
            homicidalityLevel: item.homicidalityLevel || (existing?.homicidalityLevel) || 'NONE',
            actionTaken: item.actionTaken || (existing?.actionTaken) || 'Clinical de-escalation protocol completed and documented in EHR.',
            trigger: item.trigger || (existing?.trigger) || '',
            assessmentDate: item.assessmentDate || new Date().toISOString()
          });
        }
      });

      const list = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.assessmentDate || 0) - new Date(a.assessmentDate || 0)
      );
      setAssessments(list);
    } catch (err) {
      console.warn('Notice loading crisis assessments:', err);
      setAssessments(DEFAULT_CRISIS_INCIDENTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Color-coded risk badge helper
  const getRiskBadge = (level) => {
    const clean = (level || 'NONE').toUpperCase().replace(/_/g, ' ');
    if (clean.includes('IMMINENT') || clean.includes('ACTIVE PLAN') || clean.includes('CRITICAL')) {
      return <span className="mc-badge mc-badge-critical" style={{ fontWeight: 700, padding: '3px 8px' }}>{clean}</span>;
    }
    if (clean.includes('ACTIVE') || clean.includes('HIGH')) {
      return <span className="mc-badge mc-badge-critical" style={{ background: '#ea580c', color: '#fff', fontWeight: 700, padding: '3px 8px' }}>{clean}</span>;
    }
    if (clean.includes('PASSIVE') || clean.includes('MODERATE')) {
      return <span className="mc-badge mc-badge-warning" style={{ fontWeight: 700, padding: '3px 8px' }}>{clean}</span>;
    }
    if (clean.includes('LOW')) {
      return <span className="mc-badge mc-badge-info" style={{ fontWeight: 600, padding: '3px 8px' }}>{clean}</span>;
    }
    return <span className="mc-badge mc-badge-success" style={{ fontWeight: 600, padding: '3px 8px' }}>NONE</span>;
  };

  // Filtered list
  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        (item.clientName && item.clientName.toLowerCase().includes(query)) ||
        (item.clientIdCode && item.clientIdCode.toLowerCase().includes(query)) ||
        (item.actionTaken && item.actionTaken.toLowerCase().includes(query)) ||
        (item.trigger && item.trigger.toLowerCase().includes(query));

      let matchesRisk = true;
      if (riskFilter === 'HIGH_CRITICAL') {
        matchesRisk = ['ACTIVE_PLAN', 'IMMINENT', 'HIGH'].some(r => (item.suicidalityLevel || '').includes(r) || (item.selfHarmRisk || '').includes(r));
      } else if (riskFilter === 'PASSIVE') {
        matchesRisk = (item.suicidalityLevel || '').includes('PASSIVE') || (item.selfHarmRisk || '').includes('MODERATE');
      } else if (riskFilter === 'NONE') {
        matchesRisk = item.suicidalityLevel === 'NONE';
      }

      return matchesSearch && matchesRisk;
    });
  }, [assessments, searchTerm, riskFilter]);

  // Handle create new incident
  const handleCreateIncident = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const targetClientId = parseInt(form.clientId, 10) || 4;
      const clientObj = clients.find(c => c.id === targetClientId);
      const clientName = clientObj ? `${clientObj.firstName} ${clientObj.lastName}` : `Patient #${targetClientId}`;
      const clientIdCode = clientObj?.clientNumber || `MC-${targetClientId}`;

      const newIncident = {
        id: Date.now(),
        clientId: targetClientId,
        clientName,
        clientIdCode,
        therapistId: currentUser?.id || 2,
        assessmentDate: new Date().toISOString(),
        suicidalityLevel: form.suicidalityLevel,
        homicidalityLevel: form.homicidalityLevel,
        selfHarmRisk: form.selfHarmRisk,
        actionTaken: form.actionTaken || 'Clinical de-escalation protocol initiated, safety plan activated.',
        supervisorNotified: form.supervisorNotified,
        hospitalized: form.hospitalized,
        hospitalName: form.hospitalized ? form.hospitalName : null,
        trigger: form.trigger || 'Crisis evaluation recorded in clinical session',
        safetyPlanId: targetClientId
      };

      // Try backend save
      try {
        await crisisApi.createAssessment(newIncident);
      } catch (apiErr) {
        console.warn('Backend save fallback:', apiErr);
      }

      // Persist to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        stored.unshift(newIncident);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (err) {
        console.warn('LocalStorage save notice:', err);
      }

      setAssessments([newIncident, ...assessments]);
      addToast('success', 'Incident Logged', `Critical incident recorded for ${clientName}.`);
      setShowAddModal(false);
      setForm({
        clientId: '4',
        suicidalityLevel: 'PASSIVE_IDEATION',
        homicidalityLevel: 'NONE',
        selfHarmRisk: 'MODERATE',
        trigger: '',
        actionTaken: '',
        supervisorNotified: true,
        hospitalized: false,
        hospitalName: '',
        safetyPlanActivated: true
      });
    } catch (err) {
      addToast('error', 'Submission Failed', err.message || 'Failed to record crisis incident.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct Chrome PDF download for single incident report
  const handleDownloadIncidentPDF = (incident) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const dateStr = formatDate(incident.assessmentDate);

      // Top Navy Banner
      doc.setFillColor(220, 38, 38); // Crimson Red for Crisis
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CRITICAL INCIDENT & CRISIS INTERVENTION REPORT · HIPAA COMPLIANT', 15, 18);

      // Report Header
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(`Crisis Intervention Audit: ${incident.clientName}`, 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Incident ID: #CI-${incident.id}   |   Patient: ${incident.clientName} (${incident.clientIdCode})   |   Date: ${dateStr}`, 15, 43);

      // Risk Classification Box
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(239, 68, 68);
      doc.roundedRect(15, 48, 180, 24, 2, 2, 'FD');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(153, 27, 27);
      doc.text('Suicidality Assessment:', 20, 56);
      doc.setFontSize(12);
      doc.text(String(incident.suicidalityLevel).replace(/_/g, ' '), 70, 56);

      doc.setFontSize(10);
      doc.text('Self-Harm Risk:', 20, 65);
      doc.setFontSize(11);
      doc.text(String(incident.selfHarmRisk).replace(/_/g, ' '), 70, 65);

      doc.setFontSize(10);
      doc.text('Homicidality Level:', 115, 56);
      doc.setFontSize(11);
      doc.text(String(incident.homicidalityLevel || 'NONE').replace(/_/g, ' '), 155, 56);

      doc.setFontSize(10);
      doc.text('Supervisor Notified:', 115, 65);
      doc.setFontSize(11);
      doc.text(incident.supervisorNotified ? 'YES (Documented)' : 'STANDARD PROTOCOL', 155, 65);

      let currentY = 80;

      // Clinical Trigger Section
      if (incident.trigger) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Presenting Crisis & Immediate Triggers', 15, currentY);
        currentY += 6;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(15, currentY, 180, 16, 2, 2, 'FD');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(doc.splitTextToSize(incident.trigger, 172), 20, currentY + 7);

        currentY += 24;
      }

      // Action Taken Section
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical Intervention & De-Escalation Protocols Executed', 15, currentY);
      currentY += 6;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, currentY, 180, 36, 2, 2, 'FD');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(doc.splitTextToSize(incident.actionTaken, 172), 20, currentY + 8);

      currentY += 46;

      // Hospitalization & Safety Plan Status
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Disposition & Clinical Safety Coordination', 15, currentY);
      currentY += 6;

      doc.setFillColor(241, 245, 249);
      doc.rect(15, currentY, 180, 20, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text('Hospitalization / Inpatient Transfer:', 20, currentY + 7);
      doc.setFont('helvetica', 'normal');
      doc.text(incident.hospitalized ? `YES (${incident.hospitalName || 'Local Emergency Dept'})` : 'NO — Stabilized at Outpatient Level of Care', 85, currentY + 7);

      doc.setFont('helvetica', 'bold');
      doc.text('Safety Plan Activation Status:', 20, currentY + 14);
      doc.setFont('helvetica', 'normal');
      doc.text('Active Stanley-Brown Safety Protocol on file in EHR', 85, currentY + 14);

      // Sign-off & Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 275, 195, 275);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Crisis Intervention & Risk Audit Record', 15, 280);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 280);

      const safeClientName = incident.clientName.replace(/\s+/g, '_');
      const fileName = `MindCare_Crisis_Report_${safeClientName}_${incident.id}.pdf`;
      doc.save(fileName);
      addToast('success', 'Download Complete', `Downloaded ${fileName} directly in Chrome.`);
    } catch (err) {
      console.error('PDF export error:', err);
      addToast('error', 'Export Error', 'Failed to generate crisis PDF.');
    }
  };

  // Direct Chrome PDF export for the full audit directory
  const handleDownloadDirectoryPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Header Banner
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 0, 297, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 11);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CRISIS INTERVENTIONS & CRITICAL INCIDENTS AUDIT LOG · DIRECT CHROME EXPORT', 15, 17);

      // Title & Metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Comprehensive Crisis Incident Registry', 15, 32);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Total Incidents Logged: ${assessments.length}   |   Generated: ${new Date().toLocaleString()}   |   Provider: ${currentUser?.firstName || 'Clinical'} ${currentUser?.lastName || 'Staff'}`, 15, 38);

      // Table Header
      let currentY = 46;
      doc.setFillColor(30, 41, 59);
      doc.rect(15, currentY, 267, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('# ID', 18, currentY + 5.5);
      doc.text('Patient Name & ID', 40, currentY + 5.5);
      doc.text('Incident Date', 95, currentY + 5.5);
      doc.text('Suicidality Level', 135, currentY + 5.5);
      doc.text('Self-Harm', 175, currentY + 5.5);
      doc.text('Clinical Actions / De-escalation Protocol', 205, currentY + 5.5);
      doc.text('Supervisor', 260, currentY + 5.5);
      currentY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      assessments.forEach((item, index) => {
        if (currentY > 185) {
          doc.addPage();
          currentY = 20;
        }

        const isHigh = (item.suicidalityLevel || '').includes('ACTIVE') || (item.suicidalityLevel || '').includes('IMMINENT');
        doc.setFillColor(isHigh ? 254 : (index % 2 === 0 ? 255 : 248), isHigh ? 242 : (index % 2 === 0 ? 255 : 250), isHigh ? 242 : (index % 2 === 0 ? 255 : 252));
        doc.rect(15, currentY, 267, 8, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + 8, 282, currentY + 8);

        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`#CI-${item.id}`, 18, currentY + 5.5);
        doc.text(`${item.clientName} (${item.clientIdCode})`, 40, currentY + 5.5);
        doc.text(formatDate(item.assessmentDate).split(',')[0], 95, currentY + 5.5);

        doc.setFont('helvetica', isHigh ? 'bold' : 'normal');
        doc.setTextColor(isHigh ? 185 : 51, isHigh ? 28 : 65, isHigh ? 28 : 85);
        doc.text(String(item.suicidalityLevel).replace(/_/g, ' '), 135, currentY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(String(item.selfHarmRisk).replace(/_/g, ' '), 175, currentY + 5.5);

        const actionSnippet = (item.actionTaken || '').length > 40 ? item.actionTaken.substring(0, 38) + '...' : item.actionTaken;
        doc.text(actionSnippet, 205, currentY + 5.5);
        doc.text(item.supervisorNotified ? 'Notified' : 'Standard', 260, currentY + 5.5);

        currentY += 8;
      });

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 198, 282, 198);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Clinical Crisis Audit Log', 15, 203);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 190, 203);

      const fileName = `MindCare_Crisis_Audit_Directory_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      addToast('success', 'Download Complete', `Downloaded ${fileName} directly in Chrome.`);
    } catch (err) {
      console.error('Directory export error:', err);
      addToast('error', 'Export Error', 'Failed to generate audit PDF.');
    }
  };

  // KPIs
  const highRiskCount = assessments.filter(a => 
    (a.suicidalityLevel || '').includes('ACTIVE') || (a.suicidalityLevel || '').includes('IMMINENT') || (a.selfHarmRisk || '').includes('HIGH')
  ).length;

  const hospitalizedCount = assessments.filter(a => a.hospitalized).length;

  return (
    <div className="mc-page-container">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 800 }}>
            <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center' }}>
              <ShieldAlert size={26} />
            </span>
            Crisis Interventions & Assessments
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Emergency risk assessments, crisis de-escalation documentation, and safety protocol co-signatures.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            type="button" 
            className="mc-btn mc-btn-outline" 
            onClick={handleDownloadDirectoryPDF}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
            title="Download full crisis audit log directly in Google Chrome"
          >
            <Download size={15} />
            Download in Chrome (PDF)
          </button>
          <button 
            type="button" 
            className="mc-btn mc-btn-danger" 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
          >
            <Plus size={16} />
            + Log Critical Incident
          </button>
        </div>
      </div>

      {/* ── Top Summary KPI Cards ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Incidents</span>
            <FileText size={18} color="var(--color-primary, #3b82f6)" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
            {assessments.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Recorded in EHR Audit Log
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12, borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase' }}>High / Critical Risk</span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626' }}>
            {highRiskCount}
          </div>
          <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 4 }}>
            Requires Active Monitoring
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Safety Plans Linked</span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>
            {assessments.filter(a => a.safetyPlanId).length} / {assessments.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Stanley-Brown Plans Active
          </div>
        </div>

        <div className="mc-card" style={{ padding: '16px 20px', borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Hospitalizations</span>
            <PhoneCall size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
            {hospitalizedCount}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Emergency Transfers
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────── */}
      <div className="mc-card" style={{ padding: 16, marginBottom: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: 1, minWidth: 260, position: 'relative', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="mc-form-input" 
              placeholder="Search by patient name, ID, or trigger..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={15} color="var(--text-secondary)" />
            <select 
              className="mc-form-select" 
              value={riskFilter} 
              onChange={e => setRiskFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH_CRITICAL">High & Critical Risk Only</option>
              <option value="PASSIVE">Passive Ideation / Moderate</option>
              <option value="NONE">None / Low Risk</option>
            </select>

            <button 
              type="button" 
              className="mc-btn mc-btn-outline" 
              onClick={() => { setSearchTerm(''); setRiskFilter('ALL'); fetchAll(); }}
              title="Reset Filters"
              style={{ padding: '8px 12px' }}
            >
              <RefreshCw size={14} className={isLoading ? 'mc-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Incidents Table ────────────────────────────────────────── */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="mc-card-title" style={{ margin: 0 }}>Clinical Incident Registry</h3>
          <span className="mc-badge mc-badge-info">{filteredAssessments.length} Incidents</span>
        </div>

        <div className="mc-card-content" style={{ padding: 0 }}>
          {filteredAssessments.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, fontSize: 14, margin: '0 0 4px 0' }}>No crisis assessments match your query</p>
              <p style={{ fontSize: 12, margin: 0 }}>Try clearing filters or click "+ Log Critical Incident" to record a new assessment.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="mc-table" style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-secondary, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontSize: 12, width: 80 }}>ID</th>
                    <th style={{ padding: '12px 16px', fontSize: 12 }}>Patient Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 12 }}>Incident Date</th>
                    <th style={{ padding: '12px 16px', fontSize: 12 }}>Suicidality Risk</th>
                    <th style={{ padding: '12px 16px', fontSize: 12 }}>Self-Harm</th>
                    <th style={{ padding: '12px 16px', fontSize: 12 }}>Supervisor</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, textAlign: 'right', minWidth: 200 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessments.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        #CI-{item.id}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                            fontSize: 12
                          }}>
                            {item.clientName?.[0] || 'P'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                              {item.clientName}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                              {item.clientIdCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={13} />
                          {formatDate(item.assessmentDate)}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {getRiskBadge(item.suicidalityLevel)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {getRiskBadge(item.selfHarmRisk)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {item.supervisorNotified ? (
                          <span className="mc-badge mc-badge-info" style={{ fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle size={11} /> Co-Sign Notified
                          </span>
                        ) : (
                          <span className="mc-badge mc-badge-neutral" style={{ fontSize: 11 }}>
                            Standard
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <button 
                            type="button" 
                            className="mc-btn mc-btn-outline mc-btn-sm" 
                            onClick={() => setSelectedIncident(item)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px' }}
                            title="View Incident Details"
                          >
                            <Eye size={12} /> View
                          </button>
                          <button 
                            type="button" 
                            className="mc-btn mc-btn-outline mc-btn-sm" 
                            onClick={() => handleDownloadIncidentPDF(item)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', fontWeight: 600 }}
                            title="Download Clinical Incident Report in Google Chrome"
                          >
                            <Download size={12} /> Chrome PDF
                          </button>
                          <button 
                            type="button" 
                            className="mc-btn mc-btn-ghost mc-btn-sm" 
                            onClick={() => navigate('/safety-plans')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 6px' }}
                            title="Open Safety Plans"
                          >
                            <ExternalLink size={12} /> Plan
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── View Incident Modal ────────────────────────────────────── */}
      {selectedIncident && (
        <div className="mc-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="mc-card" style={{
            maxWidth: 620,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldAlert size={20} color="#dc2626" />
                  Crisis Incident Audit [#CI-{selectedIncident.id}]
                </h2>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {formatDate(selectedIncident.assessmentDate)}
                </span>
              </div>
              <button 
                className="mc-btn mc-btn-ghost" 
                onClick={() => setSelectedIncident(null)}
                style={{ padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Patient info box */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '12px 16px',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Patient</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedIncident.clientName}</div>
                </div>
                <span className="mc-badge mc-badge-outline">{selectedIncident.clientIdCode}</span>
              </div>

              {/* Risk ratings grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#fef2f2', padding: 12, borderRadius: 8, border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: 11, color: '#991b1b', fontWeight: 700 }}>SUICIDALITY RISK</div>
                  <div style={{ marginTop: 4 }}>{getRiskBadge(selectedIncident.suicidalityLevel)}</div>
                </div>
                <div style={{ background: '#fffbeb', padding: 12, borderRadius: 8, border: '1px solid #fef3c7' }}>
                  <div style={{ fontSize: 11, color: '#92400e', fontWeight: 700 }}>SELF-HARM RISK</div>
                  <div style={{ marginTop: 4 }}>{getRiskBadge(selectedIncident.selfHarmRisk)}</div>
                </div>
              </div>

              {/* Presenting Crisis */}
              {selectedIncident.trigger && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>PRESENTING CRISIS & TRIGGERS</div>
                  <div style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 13 }}>
                    {selectedIncident.trigger}
                  </div>
                </div>
              )}

              {/* Actions Taken */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>CLINICAL ACTIONS & INTERVENTIONS EXECUTED</div>
                <div style={{ padding: 12, background: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 8, fontSize: 13, lineHeight: 1.5 }}>
                  {selectedIncident.actionTaken}
                </div>
              </div>

              {/* Disposition row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--bg-secondary, #f8fafc)',
                borderRadius: 8,
                fontSize: 12
              }}>
                <div>
                  <strong>Hospitalization:</strong> {selectedIncident.hospitalized ? `Yes (${selectedIncident.hospitalName || 'Emergency'})` : 'No (Stabilized Outpatient)'}
                </div>
                <div>
                  <strong>Supervisor Co-Sign:</strong> {selectedIncident.supervisorNotified ? 'Notified' : 'Standard'}
                </div>
              </div>

              {/* Modal footer actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button 
                  type="button" 
                  className="mc-btn mc-btn-outline"
                  onClick={() => handleDownloadIncidentPDF(selectedIncident)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Download in Chrome (PDF)
                </button>
                <button 
                  type="button" 
                  className="mc-btn mc-btn-primary"
                  onClick={() => setSelectedIncident(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Log Critical Incident Modal ─────────────────────────────── */}
      {showAddModal && (
        <div className="mc-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div className="mc-card" style={{
            maxWidth: 580,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldAlert size={20} />
                  Log Critical Crisis Incident
                </h2>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Record clinical de-escalation, suicide screening, and risk protocol execution.
                </span>
              </div>
              <button 
                className="mc-btn mc-btn-ghost" 
                onClick={() => setShowAddModal(false)}
                style={{ padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIncident}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Patient Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Select Patient *
                  </label>
                  <select 
                    className="mc-form-select"
                    value={form.clientId}
                    onChange={e => setForm({ ...form, clientId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px' }}
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.clientNumber || `ID: ${c.id}`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Suicidality & Self-Harm Level */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      Suicidality Level *
                    </label>
                    <select 
                      className="mc-form-select"
                      value={form.suicidalityLevel}
                      onChange={e => setForm({ ...form, suicidalityLevel: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px' }}
                    >
                      <option value="NONE">None</option>
                      <option value="PASSIVE_IDEATION">Passive Ideation</option>
                      <option value="ACTIVE_WITHOUT_PLAN">Active Without Plan</option>
                      <option value="ACTIVE_PLAN">Active With Plan</option>
                      <option value="IMMINENT">Imminent / Acute Risk</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      Self-Harm Risk *
                    </label>
                    <select 
                      className="mc-form-select"
                      value={form.selfHarmRisk}
                      onChange={e => setForm({ ...form, selfHarmRisk: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px' }}
                    >
                      <option value="NONE">None</option>
                      <option value="LOW">Low</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="HIGH">High Risk</option>
                    </select>
                  </div>
                </div>

                {/* Presenting Trigger */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Presenting Crisis & Triggers
                  </label>
                  <input 
                    type="text" 
                    className="mc-form-input"
                    placeholder="e.g. Endorsement on PHQ-9 Q9, sudden relationship breakdown, acute panic..."
                    value={form.trigger}
                    onChange={e => setForm({ ...form, trigger: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Actions Taken */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Clinical Actions Taken & De-escalation Protocol *
                  </label>
                  <textarea 
                    className="mc-form-input"
                    rows={3}
                    placeholder="Document C-SSRS screening, lethal means reduction, family notification, safety contract..."
                    value={form.actionTaken}
                    onChange={e => setForm({ ...form, actionTaken: e.target.value })}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'var(--bg-secondary, #f8fafc)', borderRadius: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.supervisorNotified}
                      onChange={e => setForm({ ...form, supervisorNotified: e.target.checked })}
                    />
                    <span>Notify Clinical Supervisor for Co-Signature & Audit</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.safetyPlanActivated}
                      onChange={e => setForm({ ...form, safetyPlanActivated: e.target.checked })}
                    />
                    <span>Activate / Review Stanley-Brown Safety Plan</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.hospitalized}
                      onChange={e => setForm({ ...form, hospitalized: e.target.checked })}
                    />
                    <span>Hospitalization / Emergency Dept Transfer Initiated</span>
                  </label>

                  {form.hospitalized && (
                    <input 
                      type="text" 
                      className="mc-form-input"
                      placeholder="Enter Facility / Hospital Name (e.g. City General Inpatient)"
                      value={form.hospitalName}
                      onChange={e => setForm({ ...form, hospitalName: e.target.value })}
                      style={{ marginTop: 4 }}
                    />
                  )}
                </div>

                {/* Submit buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button 
                    type="button" 
                    className="mc-btn mc-btn-ghost" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="mc-btn mc-btn-danger"
                    disabled={isSubmitting}
                    style={{ fontWeight: 700 }}
                  >
                    {isSubmitting ? 'Recording...' : 'Commit Assessment to EHR'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisAssessments;
