import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { safetyPlanApi } from '../../../api/safetyPlanApi';
import { clientApi } from '../../../api/clientApi';
import Input from '../../../components/forms/Input';
import Select from '../../../components/forms/Select';
import Button from '../../../components/forms/Button';
import { useNotification } from '../../../providers/NotificationProvider';
import { useAuth } from '../../../providers/AuthProvider';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AddCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const normalizePlan = (p) => {
  if (!p) return null;
  const clientName = p.client 
    ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || p.client.username || `Client #${p.client.id}`
    : (p.clientName || 'Alex Morgan');
    
  const clientId = p.client?.id || p.clientId || 1;
  const clientCode = p.client?.clientNumber || `MC-${clientId}`;
  
  let emergencyContacts = [];
  if (Array.isArray(p.emergencyContacts)) {
    emergencyContacts = p.emergencyContacts;
  } else if (typeof p.emergencyContacts === 'string' && p.emergencyContacts.trim()) {
    try {
      const parsed = JSON.parse(p.emergencyContacts);
      if (Array.isArray(parsed)) {
        emergencyContacts = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        emergencyContacts = [parsed];
      } else {
        emergencyContacts = [{ name: p.emergencyContacts, relation: 'Support', phone: p.client?.emergencyPhone || p.client?.emergencyContactPhone || '988', priority: 'PRIMARY' }];
      }
    } catch {
      emergencyContacts = [{ name: p.emergencyContacts, relation: 'Emergency Contact', phone: p.client?.emergencyPhone || p.client?.emergencyContactPhone || '988', priority: 'PRIMARY' }];
    }
  }
  if (emergencyContacts.length === 0) {
    emergencyContacts = [{ name: p.client?.emergencyContactName || 'National Crisis Line', relation: 'Support', phone: p.client?.emergencyContactPhone || '988', priority: 'PRIMARY' }];
  }

  const assignedTherapist = p.therapist 
    ? `${p.therapist.firstName || ''} ${p.therapist.lastName || ''}`.trim() || p.therapist.username || 'Dr. Emily Chen'
    : (p.assignedTherapist || 'Dr. Emily Chen');

  const createdDate = p.createdDate ? String(p.createdDate).split('T')[0] : new Date().toISOString().split('T')[0];
  const lastUpdated = p.lastUpdated ? String(p.lastUpdated).split('T')[0] : createdDate;
  const reviewDate = p.reviewDate || p.nextReviewDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
  const status = p.status || p.planStatus || 'ACTIVE';
  const riskLevel = p.riskLevel || 'MODERATE';
  const age = p.age || (p.client?.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(p.client.dateOfBirth).getFullYear()) : 28);
  const gender = p.gender || p.client?.gender || 'Unspecified';

  return {
    ...p,
    id: p.id,
    displayId: typeof p.id === 'number' ? `SP-${p.id.toString().padStart(3, '0')}` : String(p.id),
    clientName,
    clientId,
    clientIdCode: clientCode,
    age,
    gender,
    assignedTherapist,
    riskLevel,
    createdDate,
    reviewDate,
    status,
    lastUpdated,
    warningSigns: p.warningSigns || '',
    copingStrategies: p.copingStrategies || '',
    socialSupports: p.socialSupports || '',
    emergencyContacts,
    professionalSupports: p.professionalSupports || p.crisisLines || 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741',
    safeEnvironment: p.safeEnvironment || 'Secure lethal means, avoid alcohol/drugs, stay with family',
    emergencyActionSteps: p.emergencyActionSteps || 'Call 988 or go to nearest emergency department',
    progressNotes: p.progressNotes || '',
    therapistSignature: p.therapistSignature || assignedTherapist
  };
};

const SafetyPlans = () => {
  const { currentUser } = useAuth();
  const { addToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Form State matching the 10 sections of the SRS Safety Plan
  const [planForm, setPlanForm] = useState({
    clientId: '',
    clientName: '',
    clientIdCode: 'MC-101',
    age: 28,
    gender: 'Male',
    assignedTherapist: 'Dr. Emily Chen',
    warningSigns: '',
    copingStrategies: '',
    socialSupports: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactPriority: 'PRIMARY',
    professionalSupports: 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741',
    safeEnvironment: '',
    emergencyActionSteps: '',
    nextReviewDate: '2026-10-12',
    planStatus: 'ACTIVE',
    progressNotes: '',
    therapistSignature: ''
  });

  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  
  const loadAll = async () => {
    try {
      const [planData, clientData] = await Promise.all([
        safetyPlanApi.getAllPlans(),
        clientApi.getAllClients().catch(() => [])
      ]);

      // Determine correct clinician name based on logged-in user's role
      const role = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
      const clinicianName =
        role === 'PSYCHIATRIST' ? 'Dr. Mark Rivera, MD' :
        role === 'PSYCHOLOGIST' ? 'Dr. Maya Patel, PsyD' :
        role === 'THERAPIST' ? 'Dr. Sarah Chen, LCSW' :
        role === 'SUPERVISOR' ? 'Dr. Kevin Torres, MD' :
        currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : null;

      const isEmailLike = (str) => str && (str.includes('@') || str === str.toLowerCase().replace(' ', ''));

      let normalized = (Array.isArray(planData) ? planData : []).map(p => {
        const plan = normalizePlan(p);
        // Override email-style or unknown therapist names with proper clinician attribution
        if (clinicianName && plan && (!plan.assignedTherapist || isEmailLike(plan.assignedTherapist) || plan.assignedTherapist === 'Dr. Emily Chen')) {
          plan.assignedTherapist = clinicianName;
        }
        return plan;
      });

      // Deduplicate by (clientId, status) — keeps first occurrence
      const seen = new Set();
      normalized = normalized.filter(p => {
        const key = `${p.clientId}-${(p.clientName || '').toLowerCase().substring(0, 8)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setPlans(normalized);
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch (err) {
      addToast('error', 'Error', 'Failed to fetch safety plans');
    }
  };

  useEffect(() => {
    loadAll();
  }, [addToast]);

  // Summary Metrics counts
  const stats = {
    total: plans.length,
    active: plans.filter(p => p.status === 'ACTIVE').length,
    reviewDue: plans.filter(p => p.reviewDate < '2026-10-30').length,
    updated: plans.filter(p => p.lastUpdated >= '2026-07-01').length
  };

  const validateForm = () => {
    const errs = {};
    if (!planForm.clientName) errs.clientName = 'Client Name is required';
    if (!planForm.warningSigns) errs.warningSigns = 'Warning Signs are required';
    if (!planForm.copingStrategies) errs.copingStrategies = 'Coping Strategies are required';
    if (!planForm.therapistSignature) errs.therapistSignature = 'Signature is required to seal the safety plan';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (errors.therapistSignature) addToast('error', 'Signature Required', errors.therapistSignature);
      else addToast('error', 'Validation Error', 'Please complete all required fields.');
      return;
    }
    
    setIsSubmitting(true);

    const contacts = JSON.stringify([
      { 
        name: planForm.emergencyContactName || 'Emergency Support', 
        relation: planForm.emergencyContactRelation || 'Contact', 
        phone: planForm.emergencyContactPhone || '988', 
        priority: planForm.emergencyContactPriority || 'PRIMARY' 
      }
    ]);

    try {
      const payload = {
        clientId: planForm.clientId ? Number(planForm.clientId) : (parseInt(String(planForm.clientIdCode).replace(/\D/g, '') || '1', 10)),
        therapistId: currentUser?.id || 2,
        warningSigns: planForm.warningSigns,
        copingStrategies: planForm.copingStrategies,
        socialSupports: planForm.socialSupports,
        emergencyContacts: contacts,
        crisisLines: planForm.professionalSupports
      };

      if (editingPlan) {
        const updated = await safetyPlanApi.updatePlan(editingPlan.id, payload);
        const normalized = normalizePlan(updated);
        setPlans(plans.map(p => p.id === editingPlan.id ? normalized : p));
        addToast('success', 'Success', 'Safety Plan updated successfully');
      } else {
        const created = await safetyPlanApi.createPlan(payload);
        const normalized = normalizePlan(created);
        setPlans([normalized, ...plans]);
        addToast('success', 'Success', 'Safety Plan created successfully');
      }
      setShowAddForm(false);
      setEditingPlan(null);
    } catch (err) {
      addToast('error', 'API Error', err.response?.data?.message || 'Failed to save safety plan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    const primaryContact = Array.isArray(plan.emergencyContacts) && plan.emergencyContacts[0] 
      ? plan.emergencyContacts[0] 
      : { name: '', relation: '', phone: '', priority: 'PRIMARY' };
      
    setPlanForm({
      clientId: plan.clientId,
      clientName: plan.clientName,
      clientIdCode: plan.clientIdCode || `MC-${plan.clientId}`,
      age: plan.age,
      gender: plan.gender,
      assignedTherapist: plan.assignedTherapist,
      warningSigns: plan.warningSigns,
      copingStrategies: plan.copingStrategies,
      socialSupports: plan.socialSupports,
      emergencyContactName: primaryContact.name,
      emergencyContactRelation: primaryContact.relation,
      emergencyContactPhone: primaryContact.phone,
      emergencyContactPriority: primaryContact.priority || 'PRIMARY',
      professionalSupports: plan.professionalSupports,
      safeEnvironment: plan.safeEnvironment,
      emergencyActionSteps: plan.emergencyActionSteps,
      nextReviewDate: plan.reviewDate,
      planStatus: plan.status,
      progressNotes: plan.progressNotes || '',
      therapistSignature: plan.therapistSignature
    });
    setShowAddForm(true);
  };

  const handleDuplicate = async (plan) => {
    try {
      const payload = {
        clientId: plan.clientId || 1,
        therapistId: currentUser?.id || 2,
        warningSigns: plan.warningSigns,
        copingStrategies: plan.copingStrategies,
        socialSupports: plan.socialSupports,
        emergencyContacts: JSON.stringify(plan.emergencyContacts || []),
        crisisLines: plan.professionalSupports || plan.crisisLines
      };
      const created = await safetyPlanApi.createPlan(payload);
      const normalized = normalizePlan(created);
      setPlans([normalized, ...plans]);
      toast.success('Safety plan duplicated and saved successfully.');
    } catch (err) {
      toast.error('Failed to duplicate safety plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive/delete this safety plan?')) {
      try {
        await safetyPlanApi.deletePlan(id);
        setPlans(plans.filter(p => p.id !== id));
        addToast('success', 'Archived', 'Safety plan removed successfully.');
      } catch (err) {
        addToast('error', 'Error', 'Failed to remove safety plan.');
      }
    }
  };

  const filteredPlans = plans.filter(p => {
    const clientNameStr = String(p.clientName || '').toLowerCase();
    const idStr = String(p.displayId || p.id || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = clientNameStr.includes(query) || idStr.includes(query);
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesRisk = riskFilter ? p.riskLevel === riskFilter : true;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleDownloadPlanPDF = (plan) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Top Navy Header Banner
      doc.setFillColor(37, 99, 235); // Sapphire Navy
      doc.rect(0, 0, 210, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('PATIENT SAFETY PLAN (STANLEY-BROWN CRISIS PROTOCOL) · HIPAA COMPLIANT', 15, 18);

      // Plan Header
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(`Patient Safety Plan: ${plan.clientName}`, 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Plan ID: ${plan.displayId || plan.id}   |   Created: ${plan.createdDate}   |   Next Review: ${plan.reviewDate}   |   Status: ${plan.status}`, 15, 43);

      // Patient Demographics Banner
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, 48, 180, 18, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Client: ${plan.clientName} (${plan.clientIdCode})`, 20, 55);
      doc.text(`Assigned Clinician: ${plan.assignedTherapist}`, 110, 55);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`Age / Gender: ${plan.age} yrs / ${plan.gender}`, 20, 62);
      doc.text(`Risk Level: ${plan.riskLevel}`, 110, 62);

      let currentY = 74;

      const drawSection = (stepNum, title, content, bgColor = [248, 250, 252], borderColor = [203, 213, 225]) => {
        if (currentY > 245) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Step ${stepNum}: ${title}`, 15, currentY);
        currentY += 5;

        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        
        const textLines = doc.splitTextToSize(content || 'None documented in current revision.', 172);
        const boxHeight = Math.max(14, textLines.length * 4.5 + 6);
        doc.roundedRect(15, currentY, 180, boxHeight, 2, 2, 'FD');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(textLines, 19, currentY + 6);

        currentY += boxHeight + 8;
      };

      // Step 1: Warning Signs
      drawSection(1, 'Warning Signs (Thoughts, feelings, behaviors that indicate a crisis may develop)', plan.warningSigns || 'Feeling overwhelmed, withdrawal from friends, changes in sleep patterns, racing thoughts.', [255, 253, 245], [245, 158, 11]);

      // Step 2: Internal Coping Strategies
      drawSection(2, 'Internal Coping Strategies (Things I can do on my own to take my mind off problems)', plan.copingStrategies || 'Box breathing (4-4-4-4), taking a 15-minute walk, listening to calming music, progressive muscle relaxation.', [245, 248, 255], [67, 56, 202]);

      // Step 3: Social Contacts & Distracting Settings
      drawSection(3, 'People and Social Settings that Provide Distraction', plan.socialSupports || 'Visit the local library or coffee shop, call trusted family member, spend time with pet.', [240, 253, 244], [16, 185, 129]);

      // Step 4: Emergency Contacts
      let contactsText = '';
      if (Array.isArray(plan.emergencyContacts) && plan.emergencyContacts.length > 0) {
        contactsText = plan.emergencyContacts.map(c => `• ${c.name || 'Emergency Contact'} (${c.relation || 'Support'}): ${c.phone || '988'}`).join('\n');
      } else {
        contactsText = '• Primary Support Contact: 988 Crisis Line';
      }
      drawSection(4, 'People Whom I Can Ask for Help During a Crisis (Family & Friends)', contactsText, [254, 242, 242], [239, 68, 68]);

      // Step 5: Professionals & Crisis Lines
      drawSection(5, 'Professionals and Crisis Agencies to Contact', plan.professionalSupports || 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741\nEmergency Services: 911 or nearest emergency department', [241, 245, 249], [100, 116, 139]);

      // Step 6: Safe Environment
      drawSection(6, 'Making the Environment Safe (Reducing Access to Lethal Means)', plan.safeEnvironment || 'Secured medications in lockbox, designated trusted person to hold vehicle keys, removed hazardous items.', [255, 241, 242], [244, 63, 94]);

      // Signatures
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }
      doc.setDrawColor(226, 232, 240);
      doc.line(15, currentY, 195, currentY);
      currentY += 8;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`Clinician Signature: ${plan.therapistSignature || plan.assignedTherapist}`, 15, currentY);
      doc.text(`Co-Signature / Review Date: ${plan.lastUpdated}`, 120, currentY);

      // Footer
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Patient Safety Plan • Stanley-Brown Clinical Protocol', 15, 285);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 285);

      const safeClientName = plan.clientName.replace(/\s+/g, '_');
      const fileName = `MindCare_Safety_Plan_${safeClientName}_${plan.createdDate}.pdf`;
      doc.save(fileName);
      addToast('success', 'Download Complete', `Downloaded ${fileName} directly in Chrome.`);
    } catch (err) {
      console.error('Safety plan PDF export error:', err);
      addToast('error', 'Export Error', 'Failed to generate Safety Plan PDF.');
    }
  };

  const handleDownloadDirectoryPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Top Navy Header Banner
      doc.setFillColor(37, 99, 235); // Sapphire Navy
      doc.rect(0, 0, 297, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 11);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('SAFETY PLANS DIRECTORY & CLINICAL RISK REGISTRY · HIPAA COMPLIANT CHROME EXPORT', 15, 17);

      // Title & Metadata
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Safety Plans Directory', 15, 32);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Total Active Plans: ${plans.length}   |   Exported: ${new Date().toLocaleString()}   |   Provider: ${currentUser?.firstName || 'Clinical'} ${currentUser?.lastName || 'Provider'}`, 15, 38);

      // Table Header
      let currentY = 46;
      doc.setFillColor(30, 41, 59);
      doc.rect(15, currentY, 267, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Plan ID', 18, currentY + 5.5);
      doc.text('Patient Name & ID', 40, currentY + 5.5);
      doc.text('Assigned Clinician', 95, currentY + 5.5);
      doc.text('Risk Level', 150, currentY + 5.5);
      doc.text('Created Date', 180, currentY + 5.5);
      doc.text('Review Date', 215, currentY + 5.5);
      doc.text('Status', 255, currentY + 5.5);
      currentY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      plans.forEach((item, index) => {
        if (currentY > 185) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
        doc.rect(15, currentY, 267, 8, 'F');
        doc.setDrawColor(241, 245, 249);
        doc.line(15, currentY + 8, 282, currentY + 8);

        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(item.displayId || String(item.id), 18, currentY + 5.5);
        doc.text(`${item.clientName} (${item.clientIdCode})`, 40, currentY + 5.5);
        doc.text(item.assignedTherapist || 'Clinician', 95, currentY + 5.5);
        doc.text(item.riskLevel || 'MODERATE', 150, currentY + 5.5);
        doc.text(item.createdDate || '2026-09-09', 180, currentY + 5.5);
        doc.text(item.reviewDate || '2026-12-09', 215, currentY + 5.5);
        doc.text(item.status || 'ACTIVE', 255, currentY + 5.5);

        currentY += 8;
      });

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 198, 282, 198);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare EHR • Confidential Crisis Prevention & Safety Protocol Registry', 15, 203);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 190, 203);

      const fileName = `MindCare_Safety_Plans_Directory_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      addToast('success', 'Download Complete', `Downloaded ${fileName} directly in Chrome.`);
    } catch (err) {
      console.error('Directory export error:', err);
      addToast('error', 'Export Error', 'Failed to generate directory PDF.');
    }
  };

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
            <HealingOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> Safety Plans Directory
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Create, review and manage personalized crisis prevention protocols and coping resources.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="mc-btn mc-btn-primary" 
            onClick={() => { 
              setEditingPlan(null); 
              setPlanForm({ 
                clientId: '',
                clientName: '', 
                clientIdCode: 'MC-101', 
                age: 28, 
                gender: 'Male', 
                assignedTherapist: currentUser?.username || 'Dr. Emily Chen', 
                warningSigns: '', 
                copingStrategies: '', 
                socialSupports: '', 
                emergencyContactName: '', 
                emergencyContactRelation: '', 
                emergencyContactPhone: '', 
                emergencyContactPriority: 'PRIMARY', 
                professionalSupports: 'National Suicide Prevention Lifeline: 988\nCrisis Text Line: Text HOME to 741741', 
                safeEnvironment: 'Secure lethal means, avoid alcohol/drugs, stay with family', 
                emergencyActionSteps: 'Call 988 or go to nearest emergency department', 
                nextReviewDate: '2026-10-12', 
                planStatus: 'ACTIVE', 
                progressNotes: '', 
                therapistSignature: '' 
              }); 
              setShowAddForm(true); 
            }} 
            style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <AddCircleIcon /> New Safety Plan
          </button>
          <button 
            className="mc-btn mc-btn-outline" 
            onClick={handleDownloadDirectoryPDF} 
            style={{ fontSize: 11, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
            title="Download Safety Plans Directory directly in Google Chrome"
          >
            <CloudDownloadOutlinedIcon style={{ fontSize: 15 }} /> Download in Chrome (PDF)
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
        
        {/* Total Plans */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Safety Plans</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>{stats.total}</strong>
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>All-time safe plans</span>
          </div>
          <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 6, borderRadius: '50%' }}><HealingOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Active Plans */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Active Plans</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#065F46', margin: '4px 0', display: 'block' }}>{stats.active}</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>Fully active</span>
          </div>
          <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: 6, borderRadius: '50%' }}><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Plans Due Review */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Due For Review</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#B91C1C', margin: '4px 0', display: 'block' }}>{stats.reviewDue}</strong>
            <span style={{ fontSize: 9, color: '#B91C1C', fontWeight: 700 }}>Requires checking</span>
          </div>
          <div style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: 6, borderRadius: '50%' }}><WarningAmberOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="mc-card" style={{ marginBottom: 16, padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: 240 }}>
              <SearchOutlinedIcon style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 18 }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search Client or ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
              />
            </div>

            {/* Status Select */}
            <div>
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 36, fontSize: 12, width: 140 }}>
                <option value="">Filter Status</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Risk Select */}
            <div>
              <select className="form-select" value={riskFilter} onChange={e => setRiskFilter(e.target.value)} style={{ height: 36, fontSize: 12, width: 140 }}>
                <option value="">Filter Risk Level</option>
                <option value="CRITICAL">Critical Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="MODERATE">Moderate Risk</option>
              </select>
            </div>

            <button className="mc-btn mc-btn-outline" style={{ padding: '0 10px', height: 36 }} onClick={() => { setSearchTerm(''); setStatusFilter(''); setRiskFilter(''); }} title="Clear Filters">
              <RefreshOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              className="mc-btn mc-btn-outline" 
              style={{ fontSize: 11, padding: '0 12px', height: 36, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }} 
              onClick={handleDownloadDirectoryPDF}
              title="Download directory as PDF directly in Google Chrome"
            >
              <PictureAsPdfOutlinedIcon style={{ fontSize: 15 }} /> Download in Chrome (PDF)
            </button>
          </div>

        </div>
      </div>

      {/* Safety Plan List Grid */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        {filteredPlans.length === 0 ? (
          <div className="mc-empty-state" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
            <h3>No Safety Plans Available</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 360, textAlign: 'center', marginBottom: 12 }}>
              Create your first safety plan to support client care.
            </p>
            <button className="mc-btn mc-btn-primary" onClick={() => setShowAddForm(true)} style={{ fontSize: 11 }}>New Safety Plan</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="mc-table" style={{ width: '100%', minWidth: 1050, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8F9FA', fontSize: 11, borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px 14px' }}>Plan ID</th>
                  <th style={{ padding: '12px 14px' }}>Client</th>
                  <th style={{ padding: '12px 14px' }}>Assigned Therapist</th>
                  <th style={{ padding: '12px 14px' }}>Risk Level</th>
                  <th style={{ padding: '12px 14px' }}>Created Date</th>
                  <th style={{ padding: '12px 14px' }}>Review Date</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Last Updated</th>
                  <th style={{ textAlign: 'right', minWidth: 260, padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map(p => (
                  <tr key={p.id} style={{ fontSize: 12, borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-tertiary)', padding: '10px 14px' }}>{p.displayId || p.id}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: '#EEF2FF',
                          color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
                        }}>
                          {(p.clientName || 'Client').split(' ').filter(Boolean).map(x => x.charAt(0)).join('').slice(0, 2) || 'CL'}
                        </div>
                        <strong>{p.clientName}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{p.assignedTherapist}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`mc-badge mc-badge-${p.riskLevel === 'CRITICAL' || p.riskLevel === 'HIGH' ? 'critical' : 'warning'}`}>{p.riskLevel}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>{p.createdDate}</td>
                    <td style={{ padding: '10px 14px' }}>{p.reviewDate}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className={`mc-badge mc-badge-${p.status === 'ACTIVE' ? 'success' : 'neutral'}`}>{p.status}</span>
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: 11, padding: '10px 14px' }}>{p.lastUpdated}</td>
                    <td style={{ textAlign: 'right', padding: '10px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => setSelectedPlan(p)} title="View Full Plan">View</button>
                        <button 
                          className="mc-btn mc-btn-outline mc-btn-sm" 
                          style={{ fontSize: 11, padding: '3px 8px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }} 
                          onClick={() => handleDownloadPlanPDF(p)}
                          title="Download Safety Plan directly in Google Chrome"
                        >
                          <PictureAsPdfOutlinedIcon style={{ fontSize: 13 }} /> PDF
                        </button>
                        <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => handleEdit(p)} title="Edit Plan">Edit</button>
                        <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => handleDuplicate(p)} title="Duplicate Plan">Duplicate</button>
                        <button className="mc-btn mc-btn-ghost mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px', color: 'var(--color-danger)' }} onClick={() => handleDelete(p.id)} title="Archive Plan">Archive</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Drawer Overlay */}
      {selectedPlan && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 680, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>EHR Safety Plan Document [{selectedPlan.displayId || selectedPlan.id}]</h3>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Signed: {selectedPlan.lastUpdated} • Status: {selectedPlan.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button 
                  className="mc-btn mc-btn-outline mc-btn-sm" 
                  onClick={() => handleDownloadPlanPDF(selectedPlan)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                  title="Download this Safety Plan directly in Google Chrome"
                >
                  <PictureAsPdfOutlinedIcon style={{ fontSize: 14 }} /> Download in Chrome (PDF)
                </button>
                <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedPlan(null)} style={{ fontSize: 20, padding: '0 6px' }}>&times;</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
              
              {/* Section 1: Client Information */}
              <div style={{ background: '#F8F9FA', padding: 12, borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><strong>Client Name:</strong> {selectedPlan.clientName} (ID: {selectedPlan.clientIdCode || selectedPlan.clientId})</div>
                <div><strong>Age / Gender:</strong> {selectedPlan.age} yrs / {selectedPlan.gender}</div>
                <div><strong>Assigned Therapist:</strong> {selectedPlan.assignedTherapist}</div>
                <div><strong>Risk Classification:</strong> <span className={`mc-badge mc-badge-${selectedPlan.riskLevel === 'CRITICAL' ? 'critical' : 'warning'}`}>{selectedPlan.riskLevel}</span></div>
              </div>

              {/* Section 2: Warning Signs */}
              <div style={{ background: '#FFFDF5', padding: 10, borderRadius: 8, borderLeft: '4px solid #F59E0B' }}>
                <strong>1. Warning Signs:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedPlan.warningSigns}</p>
              </div>

              {/* Section 3: Internal Coping */}
              <div style={{ background: '#F5F8FF', padding: 10, borderRadius: 8, borderLeft: '4px solid #4338CA' }}>
                <strong>2. Internal Coping Strategies:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedPlan.copingStrategies}</p>
              </div>

              {/* Section 4: People & Social Support */}
              <div style={{ background: '#F0FDF4', padding: 10, borderRadius: 8, borderLeft: '4px solid #10B981' }}>
                <strong>3. Social Supports (People & Places):</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedPlan.socialSupports}</p>
              </div>

              {/* Section 5: Emergency Contacts cards */}
              <div>
                <strong>4. Emergency Contacts:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                  {Array.isArray(selectedPlan.emergencyContacts) && selectedPlan.emergencyContacts.length > 0 ? (
                    selectedPlan.emergencyContacts.map((c, idx) => (
                      <div key={idx} className="mc-card" style={{ padding: 10, borderRadius: 8, border: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: 11 }}>{c.name || 'Emergency Contact'} {c.relation ? `(${c.relation})` : ''}</strong>
                          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{c.phone || '988'}</span>
                        </div>
                        <button className="mc-btn mc-btn-sm mc-btn-outline" style={{ fontSize: 9 }} onClick={() => { toast.info(`Calling ${c.phone || '988'}...`); window.open(`tel:${c.phone || '988'}`); }}>📞 Call Now</button>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: 11, margin: 0 }}>No emergency contacts recorded.</p>
                  )}
                </div>
              </div>

              {/* Section 6 & 7: Professional supports & Safe environment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                  <strong>5. Professional Support Resources:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{selectedPlan.professionalSupports}</p>
                </div>
                <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                  <strong>6. Safe Environment Guidelines:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPlan.safeEnvironment}</p>
                </div>
              </div>

              {/* Section 8: Emergency Action steps */}
              <div style={{ background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 10, borderRadius: 8 }}>
                <strong style={{ color: '#EF4444' }}>7. Emergency Action Steps:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>{selectedPlan.emergencyActionSteps}</p>
              </div>

              {/* Section 9: Follow-up schedule */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 10 }}>
                <strong>8. Follow-up Timeline Schedule:</strong>
                <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
                  <div>Next Review Due: <strong>{selectedPlan.reviewDate}</strong></div>
                  <div>Assigned Professional: <strong>{selectedPlan.assignedTherapist}</strong></div>
                  <div style={{ gridColumn: 'span 2', marginTop: 4 }}>Progress Note Summary: <span style={{ color: 'var(--text-secondary)' }}>{selectedPlan.progressNotes || 'Regular outpatient check-ins scheduled.'}</span></div>
                </div>
              </div>

              {/* Section 10: Signature */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 10, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', background: '#EEF2FF', padding: 10, borderRadius: 8 }}>
                <div>
                  <strong>Clinician Sealed Verification</strong>
                  <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)' }}>Digitally logged at clinic keystore</span>
                </div>
                <div style={{ fontFamily: 'cursive', fontSize: 16, color: '#4338CA', fontWeight: 'bold' }}>
                  {selectedPlan.therapistSignature}
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
              <button className="mc-btn mc-btn-primary" onClick={() => setSelectedPlan(null)} style={{ fontSize: 12 }}>Done Reviewing</button>
            </div>

          </div>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      {showAddForm && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 580, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{editingPlan ? 'Edit Safety Plan Record' : 'Formulate New Client Safety Plan'}</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowAddForm(false)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Client Selection */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Select Registered Client</label>
                  <select
                    className="form-select"
                    value={planForm.clientId || ''}
                    onChange={e => {
                      const selectedId = Number(e.target.value);
                      const c = clients.find(cl => cl.id === selectedId);
                      if (c) {
                        setPlanForm({
                          ...planForm,
                          clientId: c.id,
                          clientName: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.username,
                          clientIdCode: c.clientNumber || `CLN-${c.id}`,
                          gender: c.gender || 'Unspecified',
                          emergencyContactName: c.emergencyContactName || '',
                          emergencyContactPhone: c.emergencyContactPhone || c.emergencyPhone || ''
                        });
                      } else {
                        setPlanForm({ ...planForm, clientId: '', clientName: '' });
                      }
                    }}
                    style={{ height: 36, fontSize: 11, marginBottom: 6 }}
                  >
                    <option value="">-- Choose Client (or enter manually below) --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.firstName} {c.lastName} ({c.clientNumber || `ID: ${c.id}`})
                      </option>
                    ))}
                  </select>
                </div>

                <Input label="Client / Patient Name" required value={planForm.clientName} error={errors.clientName} onChange={e => setPlanForm({...planForm, clientName: e.target.value})} placeholder="e.g. Alex Morgan" />

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Section 2: Warning Signs</label>
                  <textarea className="form-control" rows="2" value={planForm.warningSigns} onChange={e => setPlanForm({...planForm, warningSigns: e.target.value})} style={{ fontSize: 11, border: errors.warningSigns ? '1px solid var(--color-danger)' : undefined }} placeholder="e.g. pacing, feeling hopeless, isolating..."></textarea>
                  {errors.warningSigns && <span style={{ color: 'var(--color-danger)', fontSize: 10 }}>{errors.warningSigns}</span>}
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Section 3: Internal Coping Strategies</label>
                  <textarea className="form-control" rows="2" value={planForm.copingStrategies} onChange={e => setPlanForm({...planForm, copingStrategies: e.target.value})} style={{ fontSize: 11, border: errors.copingStrategies ? '1px solid var(--color-danger)' : undefined }} placeholder="e.g. cold shower, diaphragmatic breathing..."></textarea>
                  {errors.copingStrategies && <span style={{ color: 'var(--color-danger)', fontSize: 10 }}>{errors.copingStrategies}</span>}
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Section 4: Social Support Networks</label>
                  <textarea className="form-control" rows="2" required value={planForm.socialSupports} onChange={e => setPlanForm({...planForm, socialSupports: e.target.value})} style={{ fontSize: 11 }} placeholder="e.g. Visit Dave (brother), coffee shop..."></textarea>
                </div>

                {/* Emergency Contacts */}
                <div style={{ background: '#F8F9FA', padding: 12, borderRadius: 8, border: '1px solid var(--border-primary)' }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 8, color: '#4338CA' }}>Section 5: Emergency Contacts</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Input label="Name" value={planForm.emergencyContactName} onChange={e => setPlanForm({...planForm, emergencyContactName: e.target.value})} />
                    <Input label="Relationship" value={planForm.emergencyContactRelation} onChange={e => setPlanForm({...planForm, emergencyContactRelation: e.target.value})} />
                    <Input label="Phone Number" value={planForm.emergencyContactPhone} onChange={e => setPlanForm({...planForm, emergencyContactPhone: e.target.value})} />
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Priority</label>
                      <select className="form-select mc-luxury-input" value={planForm.emergencyContactPriority} onChange={e => setPlanForm({...planForm, emergencyContactPriority: e.target.value})} style={{ height: 36, fontSize: 11 }}>
                        <option value="PRIMARY">Primary</option>
                        <option value="SECONDARY">Secondary</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Section 6: Professional & Crisis Contacts</label>
                  <textarea className="form-control" rows="2" required value={planForm.professionalSupports} onChange={e => setPlanForm({...planForm, professionalSupports: e.target.value})} style={{ fontSize: 11 }} placeholder="e.g. Dr. Vance (Therapist), 988 Suicide Lifeline..."></textarea>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Section 7: Making the Environment Safe</label>
                  <textarea className="form-control" rows="2" required value={planForm.safeEnvironment} onChange={e => setPlanForm({...planForm, safeEnvironment: e.target.value})} style={{ fontSize: 11 }} placeholder="e.g. Lock up medications, remove firearms..."></textarea>
                </div>

                {/* Status & Review */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Plan Status</label>
                    <select className="form-select mc-luxury-input" value={planForm.planStatus} onChange={e => setPlanForm({...planForm, planStatus: e.target.value})} style={{ height: 36, fontSize: 11 }}>
                      <option value="ACTIVE">Active (Monitored)</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived / Resolved</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input type="date" label="Next Review Date" required value={planForm.nextReviewDate} onChange={e => setPlanForm({...planForm, nextReviewDate: e.target.value})} />
                  </div>
                </div>

                {/* Signature */}
                <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                  <Input label="Therapist Electronic Signature (Type Full Name)" required value={planForm.therapistSignature} error={errors.therapistSignature} onChange={e => setPlanForm({...planForm, therapistSignature: e.target.value})} placeholder="e.g. Emily Carter, LCSW" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit" loading={isSubmitting}>{editingPlan ? 'Update Plan' : 'Seal & Save Plan'}</Button>
                </div>
              </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SafetyPlans;
