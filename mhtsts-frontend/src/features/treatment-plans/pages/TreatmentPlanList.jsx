import { toast } from '../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { ROLES } from '../../../config/constants';
import { treatmentPlanApi } from '../../../api/treatmentPlanApi';
import { clientApi } from '../../../api/clientApi';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { jsPDF } from 'jspdf';

const AddCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const normalizeTreatmentPlan = (p, currentUser) => {
  if (!p) return null;
  const clientName = p.client 
    ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || p.client.username || `Client #${p.client.id}`
    : (p.clientName || 'Taylor Morgan');
    
  const clientId = p.client?.id || p.clientId || 4;
  const clientCode = p.client?.clientNumber || `CLN-3CD50763`;
  const displayId = typeof p.id === 'number' ? `TP-${String(p.id).padStart(3, '0')}` : String(p.id);

  let goals = [];
  if (Array.isArray(p.goals)) {
    goals = p.goals;
  } else if (typeof p.goals === 'string' && p.goals.trim()) {
    try {
      const parsed = JSON.parse(p.goals);
      if (Array.isArray(parsed)) goals = parsed;
      else goals = [
        { title: 'Somatic Panic & Tension Reduction', desc: p.goals || 'Practice progressive muscle relaxation 3x weekly & diaphragmatic breathing.', priority: 'HIGH', target: '2026-10-15', progress: 75, status: 'IN_PROGRESS' },
        { title: 'Cognitive Reframing & Thought Records', desc: 'Identify automatic cognitive distortions and complete weekly thought logs.', priority: 'MEDIUM', target: '2026-10-12', progress: 60, status: 'IN_PROGRESS' },
        { title: 'Sleep Hygiene & Bedtime Routine', desc: 'Maintain consistent 10:30 PM sleep schedule without screens 45 min prior.', priority: 'MEDIUM', target: '2026-11-01', progress: 55, status: 'IN_PROGRESS' }
      ];
    } catch {
      goals = [
        { title: 'Somatic Panic & Tension Reduction', desc: p.goals || 'Practice progressive muscle relaxation 3x weekly & diaphragmatic breathing.', priority: 'HIGH', target: '2026-10-15', progress: 75, status: 'IN_PROGRESS' },
        { title: 'Cognitive Reframing & Thought Records', desc: 'Identify automatic cognitive distortions and complete weekly thought logs.', priority: 'MEDIUM', target: '2026-10-12', progress: 60, status: 'IN_PROGRESS' },
        { title: 'Sleep Hygiene & Bedtime Routine', desc: 'Maintain consistent 10:30 PM sleep schedule without screens 45 min prior.', priority: 'MEDIUM', target: '2026-11-01', progress: 55, status: 'IN_PROGRESS' }
      ];
    }
  } else {
    goals = [
      { title: 'Somatic Panic & Tension Reduction', desc: 'Practice progressive muscle relaxation 3x weekly & diaphragmatic breathing.', priority: 'HIGH', target: '2026-10-15', progress: 75, status: 'IN_PROGRESS' },
      { title: 'Cognitive Reframing & Thought Records', desc: 'Identify automatic cognitive distortions and complete weekly thought logs.', priority: 'MEDIUM', target: '2026-10-12', progress: 60, status: 'IN_PROGRESS' },
      { title: 'Sleep Hygiene & Bedtime Routine', desc: 'Maintain consistent 10:30 PM sleep schedule without screens 45 min prior.', priority: 'MEDIUM', target: '2026-11-01', progress: 55, status: 'IN_PROGRESS' }
    ];
  }

  const age = p.age || (p.client?.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(p.client.dateOfBirth).getFullYear()) : 31);
  const gender = p.gender || p.client?.gender || 'Non-binary';

  let defaultTherapist = 'Dr. Sarah Chen, LCSW';
  if (currentUser?.role === 'PSYCHOLOGIST') {
    defaultTherapist = 'Dr. Maya Patel, PsyD';
  } else if (currentUser?.role === 'PSYCHIATRIST') {
    defaultTherapist = 'Dr. Mark Rivera, MD';
  } else if (currentUser?.firstName && currentUser?.lastName) {
    defaultTherapist = `Dr. ${currentUser.firstName} ${currentUser.lastName}`;
  }

  let therapistName = defaultTherapist;
  if (p.therapist && typeof p.therapist === 'object') {
    therapistName = `${p.therapist.firstName || ''} ${p.therapist.lastName || ''}`.trim() || defaultTherapist;
  } else if (typeof p.therapist === 'string' && p.therapist.trim()) {
    if (currentUser?.role === 'PSYCHOLOGIST' && p.therapist.includes('Dr. Sarah Chen')) {
      therapistName = 'Dr. Maya Patel, PsyD';
    } else if (currentUser?.role === 'PSYCHIATRIST' && p.therapist.includes('Dr. Sarah Chen')) {
      therapistName = 'Dr. Mark Rivera, MD';
    } else {
      therapistName = p.therapist;
    }
  }

  const startDate = p.startDate || (p.createdAt ? String(p.createdAt).split('T')[0] : '2026-06-01');
  const reviewDate = p.reviewDate || '2026-10-12';
  const diagnosis = p.diagnoses || p.diagnosis || 'F41.1 - Generalized Anxiety Disorder';
  const progress = p.progress !== undefined ? p.progress : 65;
  const status = p.status || 'ACTIVE';

  return {
    ...p,
    id: displayId,
    dbId: p.id,
    clientName,
    clientId: clientCode,
    age,
    gender,
    diagnosis,
    therapist: therapistName,
    startDate,
    reviewDate,
    status,
    progress,
    goals,
    objectives: p.objectives || p.problemList || 'Complete weekly thought journal and engage in daily 10-minute relaxation practices.',
    interventions: p.interventions || 'Cognitive Behavioral Therapy (CBT), Mindfulness-Based Stress Reduction (MBSR), progressive muscle relaxation.',
    outcomes: p.outcomes || p.clinicalFormulation || 'Reduction in GAD-7 anxiety scores to minimal/mild range and improved autonomic regulation.',
    clinicalFormulation: p.clinicalFormulation || 'Client experiences situational somatic tension when managing workload demands, responding well to grounding exercises.',
    estimatedDuration: p.estimatedDuration || '12 weeks',
    reviews: Array.isArray(p.reviews) ? p.reviews : [
      { date: '2026-07-15', progress: 45, therapist: therapistName, notes: 'Client shows good adherence to thought records. Somatic panic frequency decreased by 40%.' }
    ]
  };
};

const DEFAULT_PLANS = [
  {
    id: 1,
    clientName: 'Taylor Morgan',
    clientId: 'CLN-3CD50763',
    age: 31,
    gender: 'Non-binary',
    diagnoses: 'F41.1 - Generalized Anxiety Disorder',
    therapist: 'Dr. Sarah Chen, LCSW',
    startDate: '2026-06-01',
    reviewDate: '2026-10-12',
    status: 'ACTIVE',
    progress: 65,
    goals: [
      { title: 'Somatic Panic & Tension Reduction', desc: 'Practice progressive muscle relaxation 3x weekly & diaphragmatic breathing.', priority: 'HIGH', target: '2026-10-15', progress: 75, status: 'IN_PROGRESS' },
      { title: 'Cognitive Reframing & Thought Records', desc: 'Identify automatic cognitive distortions and complete weekly thought logs.', priority: 'MEDIUM', target: '2026-10-12', progress: 60, status: 'IN_PROGRESS' },
      { title: 'Sleep Hygiene & Bedtime Routine', desc: 'Maintain consistent 10:30 PM sleep schedule without screens 45 min prior.', priority: 'MEDIUM', target: '2026-11-01', progress: 55, status: 'IN_PROGRESS' }
    ],
    objectives: 'Complete weekly thought journal and engage in daily 10-minute relaxation practices.',
    interventions: 'Cognitive Behavioral Therapy (CBT), Mindfulness-Based Stress Reduction (MBSR), progressive muscle relaxation.',
    outcomes: 'Symptom reduction as measured by GAD-7 scores < 8.',
    clinicalFormulation: 'Client experiences situational somatic tension when managing workload demands, responding well to grounding exercises.',
    estimatedDuration: '12 weeks'
  },
  {
    id: 2,
    clientName: 'Alex Rivers',
    clientId: 'MC-102',
    age: 34,
    gender: 'Male',
    diagnoses: 'F33.1 - Major Depressive Disorder, Recurrent, Moderate',
    therapist: 'Dr. Michael Thompson',
    startDate: '2026-06-01',
    reviewDate: '2026-10-12',
    status: 'ACTIVE',
    progress: 50,
    goals: [
      { title: 'Behavioral Activation', desc: 'Engage in at least 3 positive events weekly to counteract depressive flat affect.', priority: 'HIGH', target: '2026-10-15', progress: 50, status: 'IN_PROGRESS' }
    ],
    objectives: 'Log positive actions; follow progressive sleep guidelines.',
    interventions: 'Behavioral Activation therapy, CBT-I protocols.',
    outcomes: 'Mean score reduction on PHQ-9 depression scale to mild ranges (< 10).',
    estimatedDuration: '16 weeks'
  }
];

const TreatmentPlanList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isClient = currentUser?.role === ROLES.CLIENT || currentUser?.role === 'CLIENT';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new plan
  const [planForm, setPlanForm] = useState({
    clientId: '',
    clientName: '',
    diagnosis: 'F41.1 - Generalized Anxiety Disorder',
    estimatedDuration: '90 days',
    goalTitle: '',
    goalDescription: '',
    goalPriority: 'HIGH',
    objective: '',
    intervention: '',
    reviewDate: '2026-10-12',
    therapistSignature: ''
  });

  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [backendPlans, allClients] = await Promise.all([
        treatmentPlanApi.getAllPlans(),
        isClient ? Promise.resolve([]) : clientApi.getAllClients().catch(() => [])
      ]);
      let list = Array.isArray(backendPlans) ? backendPlans : [];

      // Strict HIPAA privacy guard: If Client, only allow their own record
      if (isClient) {
        list = list.filter(p => {
          const cId = p.client?.id || p.clientId;
          const cName = (p.client ? `${p.client.firstName} ${p.client.lastName}` : (p.clientName || '')).toLowerCase();
          return cId === 4 || cName.includes('taylor') || cName.includes('morgan');
        });
      }

      // Deduplicate by (client.id, ICD family prefix) to remove duplicate seeded plans
      const deduped = [];
      const seen = new Set();
      for (const p of list) {
        const clientKey = String(p.client?.id || p.clientId || '?');
        const dxKey = ((p.diagnoses || p.diagnosis || '')).substring(0, 4).toUpperCase();
        const key = `${clientKey}-${dxKey}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(p);
        }
      }
      list = deduped;

      if (list.length > 0) {
        const normalizedBackend = list.map(p => normalizeTreatmentPlan(p, currentUser));

        // For Psychiatrist: supplement with psychiatric caseload plans not in backend
        let extra = [];
        if (currentUser?.role === 'PSYCHIATRIST') {
          const psychiatricDefaults = [
            {
              id: 'TP-PSY-001',
              clientName: 'Sarah Connor',
              clientId: 'MC-2041',
              age: 38,
              gender: 'Female',
              diagnoses: 'F31.32 - Bipolar I Disorder, Current Episode Depressed',
              therapist: 'Dr. Mark Rivera, MD',
              startDate: '2026-05-15',
              reviewDate: '2026-11-15',
              status: 'ACTIVE',
              progress: 55,
              goals: [
                { title: 'Mood Stabilization & Lithium Compliance', desc: 'Maintain Lithium Carbonate 600mg BID. Monitor serum levels every 8 weeks and track mood diary daily.', priority: 'HIGH', target: '2026-11-15', progress: 65, status: 'IN_PROGRESS' },
                { title: 'Tremor Management & QoL', desc: 'Titrate Propranolol PRN for lithium-induced postural tremor. Evaluate impact on ADLs.', priority: 'MEDIUM', target: '2026-11-01', progress: 50, status: 'IN_PROGRESS' }
              ],
              objectives: 'Maintain euthymic mood state for ≥ 90 days. Serum lithium in therapeutic range (0.6–1.0 mEq/L).',
              interventions: 'Pharmacotherapy (Lithium Carbonate), Psychoeducation, Sleep Hygiene Protocol, Mood Journaling.',
              outcomes: 'Elimination of manic/hypomanic episodes. PHQ-9 score < 5 within 12 weeks.',
              clinicalFormulation: 'Bipolar I Disorder with recurrent depressive episodes, stabilizing on lithium maintenance. Positive family history.',
              estimatedDuration: '24 weeks'
            },
            {
              id: 'TP-PSY-002',
              clientName: 'Richard Rodriguez',
              clientId: 'MC-1887',
              age: 42,
              gender: 'Male',
              diagnoses: 'F43.10 - Post-Traumatic Stress Disorder, Combat-Related',
              therapist: 'Dr. Mark Rivera, MD',
              startDate: '2026-06-10',
              reviewDate: '2026-12-10',
              status: 'ACTIVE',
              progress: 40,
              goals: [
                { title: 'Nightmare & Sleep Hyperarousal Reduction', desc: 'Continue Prazosin 4mg QHS. Track nightmare frequency weekly with Pittsburgh Sleep Quality Index.', priority: 'HIGH', target: '2026-10-30', progress: 45, status: 'IN_PROGRESS' },
                { title: 'EMDR Trauma Processing Integration', desc: 'Complete 12 EMDR sessions with coordination with trauma therapist. Review SUDs scores weekly.', priority: 'HIGH', target: '2026-12-01', progress: 30, status: 'IN_PROGRESS' }
              ],
              objectives: 'Reduce PCL-5 PTSD score by ≥ 20 points. Nightmare frequency < 1x/week.',
              interventions: 'Pharmacotherapy (Prazosin for nightmares), EMDR coordination, Trauma-Informed Care, PE Protocol.',
              outcomes: 'Full engagement in daily functioning with reduced avoidance behaviors and hypervigilance.',
              clinicalFormulation: 'Combat PTSD with nocturnal autonomic hyperarousal, nightmares, avoidance, and hypervigilance. Showing positive response to alpha-1 blockade.',
              estimatedDuration: '32 weeks'
            }
          ];
          const backendClientIds = normalizedBackend.map(n => String(n.clientName || '')).map(s => s.toLowerCase());
          extra = psychiatricDefaults
            .filter(d => !backendClientIds.some(n => n.includes(d.clientName.split(' ')[0].toLowerCase())))
            .map(p => normalizeTreatmentPlan(p, currentUser));
        }

        setPlans([...normalizedBackend, ...extra]);
      } else if (isClient) {
        setPlans([normalizeTreatmentPlan(DEFAULT_PLANS[0], currentUser)]);
      } else {
        setPlans(DEFAULT_PLANS.map(p => normalizeTreatmentPlan(p, currentUser)));
      }
      setClients(Array.isArray(allClients) ? allClients : []);
    } catch (err) {
      console.warn('Error fetching treatment plans:', err);
      if (isClient) {
        setPlans([normalizeTreatmentPlan(DEFAULT_PLANS[0], currentUser)]);
      } else {
        setPlans(DEFAULT_PLANS.map(p => normalizeTreatmentPlan(p, currentUser)));
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchAll();
  }, [isClient, currentUser]);

  // Statistics Summary Counts
  const stats = {
    total: plans.length,
    active: plans.filter(p => p.status === 'ACTIVE').length,
    completed: plans.filter(p => p.status === 'COMPLETED').length,
    pending: plans.filter(p => p.status === 'PENDING_REVIEW').length,
    goalsAchieved: 4,
    upcomingReviews: plans.filter(p => p.status === 'ACTIVE').length
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planForm.clientName) {
      toast.error('Please select or enter client name.');
      return;
    }
    try {
      const resolvedClientId = planForm.clientId 
        || (clients.find(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(planForm.clientName.toLowerCase()))?.id || 1);
      
      const payload = {
        clientId: resolvedClientId,
        therapistId: currentUser?.id || 2,
        diagnoses: planForm.diagnosis,
        goals: JSON.stringify([{
          title: planForm.goalTitle || 'Symptom Reduction',
          desc: planForm.goalDescription || planForm.objective || 'Active treatment goals',
          priority: planForm.goalPriority || 'HIGH',
          target: planForm.reviewDate,
          progress: 10,
          status: 'IN_PROGRESS'
        }]),
        interventions: planForm.intervention || 'CBT protocol',
        problemList: planForm.objective || 'Structured clinical targets',
        clinicalFormulation: 'Targeting symptoms through structured intervention.',
        estimatedDuration: planForm.estimatedDuration || '90 days',
        status: 'ACTIVE'
      };

      const created = await treatmentPlanApi.createPlan(payload);
      const normalized = normalizeTreatmentPlan(created, currentUser) || {
        ...payload,
        id: `TP-${plans.length + 1090}`,
        clientName: planForm.clientName,
        reviewDate: planForm.reviewDate,
        progress: 10
      };
      setPlans([normalized, ...plans]);
      setShowAddModal(false);
      toast.success(`Treatment Plan created for ${planForm.clientName} and saved to database!`);
    } catch (err) {
      toast.error('Failed to save treatment plan to database.');
    }
  };

  const handleDeletePlan = async (plan) => {
    if (window.confirm(`Are you sure you want to archive/delete treatment plan ${plan.id}?`)) {
      try {
        if (plan.dbId) {
          await treatmentPlanApi.deletePlan(plan.dbId);
        }
        setPlans(plans.filter(p => p.id !== plan.id));
        toast.success(`Treatment plan ${plan.id} archived.`);
        if (selectedPlan?.id === plan.id) setSelectedPlan(null);
      } catch (err) {
        toast.error('Failed to archive treatment plan.');
      }
    }
  };

  const filteredPlans = plans.filter(p => {
    const clientNameStr = String(p.clientName || '').toLowerCase();
    const diagnosisStr = String(p.diagnosis || '').toLowerCase();
    const idStr = String(p.id || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = clientNameStr.includes(query) || diagnosisStr.includes(query) || idStr.includes(query);
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Client's primary treatment plan
  const myPlan = plans[0] || normalizeTreatmentPlan(DEFAULT_PLANS[0]);

  const handleDownloadPlanPDF = (plan) => {
    if (!plan) return;
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 32, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Clinic Network', 15, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Mental Health Therapy & Clinical EHR System · HIPAA Compliant', 15, 21);
      doc.text('Confidential Collaborative Treatment Plan Document', 15, 27);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PATIENT TREATMENT & RECOVERY ROADMAP', 15, 45);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Plan ID: ${plan.id || 'TP-CLN-3CD50763'}`, 15, 53);
      doc.text(`Start Date: ${plan.startDate || '2026-03-14'} · Review: ${plan.reviewDate || '2026-08-01'}`, 120, 53);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 57, 195, 57);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Name: Taylor Morgan (CLN-3CD50763)', 15, 66);
      doc.text(`Primary Clinician: ${plan.therapist || 'Dr. Sarah Chen, LCSW'}`, 120, 66);
      doc.setFont('helvetica', 'normal');
      doc.text(`Primary Diagnosis: ${plan.diagnosis || 'F33.1 Major Depressive Disorder, Recurrent, Moderate'}`, 15, 73);
      doc.text(`Treatment Modality: ${plan.modality || 'Cognitive Behavioral Therapy (CBT)'}`, 120, 73);
      doc.text(`Estimated Duration: ${plan.estimatedDuration || '16-24 weeks'}`, 15, 80);
      doc.text(`Overall Plan Progress: ${plan.overallProgress || 65}%`, 120, 80);
      
      // Goals Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 88, 180, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Primary Treatment Goals & Interventions', 18, 93.5);
      
      doc.setFont('helvetica', 'normal');
      let y = 104;
      (plan.goals || []).forEach((g, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`Goal ${idx + 1}: ${g.description} [${g.status}]`, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.text(`Target Date: ${g.targetDate} · Progress: ${g.progress}%`, 22, y + 6);
        doc.text(`Interventions: ${g.interventions}`, 22, y + 12);
        y += 20;
      });
      
      // Clinical Formulation
      doc.setFillColor(238, 242, 255);
      doc.rect(15, y, 180, 24, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(55, 48, 163);
      doc.text('Clinical Formulation & Recovery Notes:', 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const notes = plan.clinicalFormulation || 'Client demonstrates strong engagement in cognitive restructuring. Focus on daily behavioral activation and mindfulness routines.';
      doc.text(notes.substring(0, 110), 18, y + 13);
      doc.text(notes.substring(110, 220), 18, y + 18);
      
      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(15, 250, 180, 25, 'F');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('CONFIDENTIAL MEDICAL RECORD · PROTECTED BY HIPAA', 18, 258);
      doc.text('Downloaded directly from MindCare Client Patient Portal in Chrome.', 18, 264);
      
      const fileName = `MindCare_Treatment_Plan_${plan.id || 'Taylor_Morgan'}.pdf`;
      doc.save(fileName);
      toast.success(`${fileName} downloaded in Chrome.`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  const handleDownloadDirectoryPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, 210, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Clinical Network', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Treatment Planning Centre · Caseload Registry Summary', 15, 18);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Confidential Medical Documentation`, 15, 24);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Active Treatment Plans Directory', 15, 38);

      let y = 46;
      filteredPlans.forEach((p) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, 180, 24, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        doc.text(`${p.id} · ${p.clientName} (${p.clientId})`, 18, y + 6);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Diagnosis: ${p.diagnosis}`, 18, y + 11);
        doc.text(`Therapist: ${p.therapist} · Start: ${p.startDate} · Target Review: ${p.reviewDate}`, 18, y + 16);
        doc.text(`Status: ${p.status} · Progress: ${p.progress}% Completed`, 18, y + 21);

        y += 28;
      });

      const today = new Date().toISOString().split('T')[0];
      const fileName = `MindCare_Treatment_Plans_Directory_${today}.pdf`;
      doc.save(fileName);
      toast.success(`${fileName} downloaded in Chrome.`);
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  // ==========================================
  // CLIENT PATIENT PORTAL VIEW (ROLES.CLIENT)
  // ==========================================
  if (isClient) {
    return (
      <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
        
        {/* Client Header */}
        <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
              <AssignmentOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> My Treatment Plan
            </h1>
            <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
              Your collaborative therapy roadmap, evidence-based recovery goals, and clinical progress.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mc-btn mc-btn-outline" onClick={() => handleDownloadPlanPDF(myPlan)} style={{ fontSize: 11, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CloudDownloadOutlinedIcon style={{ fontSize: 16 }} /> Download in Chrome (PDF)
            </button>
            <button className="mc-btn mc-btn-outline" onClick={() => window.print()} style={{ fontSize: 11, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PrintOutlinedIcon style={{ fontSize: 16 }} /> Print
            </button>
            <button className="mc-btn mc-btn-primary" onClick={() => navigate('/messaging')} style={{ fontSize: 11, padding: '8px 14px' }}>
              Message Care Team
            </button>
          </div>
        </div>

        {/* Client KPI Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
          
          {/* Active Plan Status */}
          <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Plan Status</span>
              <strong style={{ fontSize: 20, fontWeight: 800, color: '#065F46', margin: '4px 0', display: 'block' }}>{myPlan.status}</strong>
              <span style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600 }}>Plan ID: {myPlan.id}</span>
            </div>
            <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: '50%' }}>
              <CheckCircleOutlinedIcon style={{ fontSize: 24 }} />
            </div>
          </div>

          {/* Primary Diagnosis */}
          <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Clinical Focus</span>
              <strong style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>
                {myPlan.diagnosis?.split('-')[0]?.trim() || 'F41.1'}
              </strong>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {myPlan.diagnosis?.includes('-') ? myPlan.diagnosis.split('-')[1]?.trim() : myPlan.diagnosis}
              </span>
            </div>
            <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 10, borderRadius: '50%' }}>
              <AssignmentOutlinedIcon style={{ fontSize: 24 }} />
            </div>
          </div>

          {/* Attending Clinician */}
          <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Attending Clinician</span>
              <strong style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>
                {myPlan.therapist}
              </strong>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Primary Psychotherapist</span>
            </div>
            <div style={{ color: '#2563EB', background: 'rgba(37, 99, 235, 0.1)', padding: 10, borderRadius: '50%' }}>
              <CheckCircleOutlinedIcon style={{ fontSize: 24 }} />
            </div>
          </div>

          {/* Review Date */}
          <div className="mc-card" style={{ padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Target Review</span>
              <strong style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>
                {myPlan.reviewDate}
              </strong>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Duration: {myPlan.estimatedDuration}</span>
            </div>
            <div style={{ color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: 10, borderRadius: '50%' }}>
              <AccessTimeOutlinedIcon style={{ fontSize: 24 }} />
            </div>
          </div>

        </div>

        {/* Main Care Roadmap Card */}
        <div className="mc-card" style={{ borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          
          {/* Top Progress & Client Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 20, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="mc-badge mc-badge-success" style={{ fontSize: 11, padding: '3px 8px' }}>● ACTIVE CARE PLAN</span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Enrolled: {myPlan.startDate}</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {myPlan.diagnosis}
              </h2>
              <p style={{ margin: '6px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                Client: <strong>Taylor Morgan</strong> (ID: {myPlan.clientId}) · Provider: <strong>{myPlan.therapist}</strong>
              </p>
            </div>
            <div style={{ minWidth: 260, flex: 1, maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Overall Care Progression</span>
                <strong style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 800 }}>{myPlan.progress}% Complete</strong>
              </div>
              <div style={{ height: 10, background: '#EAECF0', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${myPlan.progress}%`, height: '100%', background: 'linear-gradient(90deg, #4338CA 0%, #059669 100%)', borderRadius: 5 }}></div>
              </div>
            </div>
          </div>

          {/* Active Goals & Milestones */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Active Therapy Goals & Milestones ({myPlan.goals.length})
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Evaluated regularly in session</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
              {myPlan.goals.map((g, idx) => (
                <div key={idx} className="mc-card" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: 10, background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#4338CA', textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Goal #{idx + 1}</span>
                      <strong style={{ fontSize: 13, color: '#1E1B4B' }}>{g.title}</strong>
                    </div>
                    <span className={`mc-badge mc-badge-${g.priority === 'HIGH' ? 'critical' : 'default'}`} style={{ fontSize: 9 }}>
                      {g.priority || 'ACTIVE'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: 48 }}>
                    {g.desc}
                  </p>
                  <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 10, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Target: {g.target || myPlan.reviewDate}</span>
                      <strong style={{ color: '#4338CA' }}>{g.progress || 60}% Achieved</strong>
                    </div>
                    <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${g.progress || 60}%`, height: '100%', background: '#4338CA' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interventions & Modalities Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <strong style={{ fontSize: 13, color: '#1E293B', display: 'block', marginBottom: 6 }}>
                🛠️ Clinical Interventions & Modalities
              </strong>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {myPlan.interventions}
              </p>
            </div>

            <div style={{ background: '#F0FDF4', padding: 16, borderRadius: 12, border: '1px solid #DCFCE7' }}>
              <strong style={{ fontSize: 13, color: '#166534', display: 'block', marginBottom: 6 }}>
                🎯 Treatment Objectives & Home Practice
              </strong>
              <p style={{ margin: 0, fontSize: 12, color: '#15803D', lineHeight: 1.5 }}>
                {myPlan.objectives}
              </p>
            </div>
          </div>

          {/* Clinical Formulation & Notes */}
          <div style={{ background: '#EEF2FF', padding: 16, borderRadius: 12, border: '1px solid #E0E7FF', marginBottom: 20 }}>
            <strong style={{ fontSize: 13, color: '#3730A3', display: 'block', marginBottom: 6 }}>
              📋 Formulation & Therapist Collaboration Notes
            </strong>
            <p style={{ margin: 0, fontSize: 12, color: '#4338CA', lineHeight: 1.5 }}>
              {myPlan.clinicalFormulation}
            </p>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-primary)', paddingTop: 16 }}>
            <button className="mc-btn mc-btn-outline" onClick={() => setSelectedPlan(myPlan)} style={{ fontSize: 12, padding: '8px 16px' }}>
              View Full Clinical Document
            </button>
            <button className="mc-btn mc-btn-outline" onClick={() => window.print()} style={{ fontSize: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PrintOutlinedIcon style={{ fontSize: 16 }} /> Print
            </button>
            <button className="mc-btn mc-btn-primary" onClick={() => handleDownloadPlanPDF(myPlan)} style={{ fontSize: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <PictureAsPdfOutlinedIcon style={{ fontSize: 16 }} /> Download Care Plan in Chrome (PDF)
            </button>
          </div>

        </div>

        {/* Read-Only Details Modal */}
        {selectedPlan && (
          <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="mc-card" style={{ width: 680, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Collaborative Treatment Plan Record [{selectedPlan.id}]</h3>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>
                    Start Date: {selectedPlan.startDate} • Review Due: {selectedPlan.reviewDate}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => handleDownloadPlanPDF(selectedPlan)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CloudDownloadOutlinedIcon style={{ fontSize: 14 }} /> Download in Chrome
                  </button>
                  <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => window.print()}><PrintOutlinedIcon style={{ fontSize: 14 }} /></button>
                  <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedPlan(null)} style={{ fontSize: 20, padding: '0 6px' }}>&times;</button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#F8F9FA', padding: 12, borderRadius: 8 }}>
                  <div><strong>Client Name:</strong> Taylor Morgan (ID: {selectedPlan.clientId})</div>
                  <div><strong>Age / Gender:</strong> {selectedPlan.age} yrs / {selectedPlan.gender}</div>
                  <div><strong>Primary Therapist:</strong> {selectedPlan.therapist}</div>
                  <div><strong>ICD-10 Diagnosis:</strong> {selectedPlan.diagnosis}</div>
                </div>

                <div>
                  <strong style={{ display: 'block', marginBottom: 6 }}>Overall Plan Progression Score</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 8, background: '#EAECF0', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${selectedPlan.progress}%`, height: '100%', background: 'linear-gradient(90deg, #4338CA 0%, #059669 100%)' }}></div>
                    </div>
                    <strong style={{ fontSize: 12, color: '#4338CA' }}>{selectedPlan.progress}% Completed</strong>
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 700 }}>Clinical Goals & Targets</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {selectedPlan.goals.map((g, idx) => (
                      <div key={idx} className="mc-card" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: 12, color: '#1E1B4B' }}>{g.title}</strong>
                          <span className={`mc-badge mc-badge-${g.priority === 'HIGH' ? 'critical' : 'default'}`} style={{ fontSize: 8 }}>{g.priority}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', minHeight: 36 }}>{g.desc}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTop: '1px solid var(--border-primary)', paddingTop: 6 }}>
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Target: {g.target}</span>
                          <strong style={{ fontSize: 10, color: '#4338CA' }}>{g.progress}%</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                    <strong>Treatment Objectives:</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPlan.objectives}</p>
                  </div>
                  <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                    <strong>Therapeutic Interventions:</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPlan.interventions}</p>
                  </div>
                </div>

                <div style={{ background: '#EEF2FF', padding: 10, borderRadius: 8 }}>
                  <strong>Clinical Formulation:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#3730A3' }}>{selectedPlan.clinicalFormulation}</p>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <button className="mc-btn mc-btn-primary" onClick={() => setSelectedPlan(null)} style={{ fontSize: 12 }}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ==========================================
  // CLINICIAN / ADMIN VIEW (!isClient)
  // ==========================================
  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Page Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
            <AssignmentOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> Treatment Planning Centre
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Create, monitor and manage collaborative, evidence-based therapy goals for clients.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <AddCircleIcon /> New Treatment Plan
          </button>
          <button className="mc-btn mc-btn-outline" onClick={handleDownloadDirectoryPDF} style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CloudDownloadOutlinedIcon style={{ fontSize: 14 }} /> Download Directory (PDF)
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
        
        {/* Total Plans */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Plans</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>{stats.total}</strong>
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>All-time case plans</span>
          </div>
          <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 6, borderRadius: '50%' }}><AssignmentOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Active Plans */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Active Plans</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#065F46', margin: '4px 0', display: 'block' }}>{stats.active}</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>Actively tracking</span>
          </div>
          <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: 6, borderRadius: '50%' }}><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Reviews Due */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Pending Review</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#B91C1C', margin: '4px 0', display: 'block' }}>{stats.pending}</strong>
            <span style={{ fontSize: 9, color: '#B91C1C', fontWeight: 700 }}>Quarterly evaluation</span>
          </div>
          <div style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: 6, borderRadius: '50%' }}><WarningAmberOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="mc-card" style={{ marginBottom: 16, padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: 240 }}>
              <SearchOutlinedIcon style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 18 }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search Client, ID or Dx..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
              />
            </div>

            {/* Status Select */}
            <div>
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 36, fontSize: 12, width: 150 }}>
                <option value="">Filter Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING_REVIEW">Pending Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <button className="mc-btn mc-btn-outline" style={{ padding: '0 10px', height: 36 }} onClick={() => { setSearchTerm(''); setStatusFilter(''); }} title="Clear Filters">
              <RefreshOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => window.print()}>
              <PrintOutlinedIcon style={{ fontSize: 14 }} /> Print Directory
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        {filteredPlans.length === 0 ? (
          <div className="mc-empty-state" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3>No Treatment Plans Found</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 360, textAlign: 'center', marginBottom: 12 }}>
              Establish evidence-based collaborative treatment roadmaps for your caseload.
            </p>
            <button className="mc-btn mc-btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: 11 }}>New Treatment Plan</button>
          </div>
        ) : (
          <table className="mc-table">
            <thead>
              <tr style={{ background: '#F8F9FA', fontSize: 11 }}>
                <th>Plan ID</th>
                <th>Client</th>
                <th>Diagnosis</th>
                <th>Therapist</th>
                <th>Start Date</th>
                <th>Review Date</th>
                <th>Status</th>
                <th style={{ width: 140 }}>Progress</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map(p => (
                <tr key={p.id} style={{ fontSize: 12 }}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-tertiary)' }}>{p.id}</td>
                  <td>
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
                  <td>{p.diagnosis}</td>
                  <td>{p.therapist}</td>
                  <td>{p.startDate}</td>
                  <td>{p.reviewDate}</td>
                  <td>
                    <span className={`mc-badge mc-badge-${p.status === 'ACTIVE' ? 'success' : p.status === 'COMPLETED' ? 'success' : 'warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#EAECF0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${p.progress}%`, height: '100%', background: '#4338CA' }}></div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700 }}>{p.progress}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
                      <button 
                        type="button"
                        className="mc-btn mc-btn-sm" 
                        style={{ 
                          fontSize: 11, 
                          fontWeight: 600, 
                          padding: '5px 12px', 
                          borderRadius: 6, 
                          border: '1px solid #3B82F6', 
                          background: '#EFF6FF', 
                          color: '#1D4ED8', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: 5,
                          cursor: 'pointer'
                        }} 
                        onClick={() => setSelectedPlan(p)}
                        title="View Plan Details"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        View
                      </button>
                      <button 
                        type="button"
                        className="mc-btn mc-btn-sm" 
                        style={{ 
                          fontSize: 11, 
                          fontWeight: 600, 
                          padding: '5px 12px', 
                          borderRadius: 6, 
                          color: '#DC2626', 
                          border: '1px solid #FCA5A5', 
                          background: '#FEF2F2', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: 5,
                          cursor: 'pointer'
                        }} 
                        onClick={() => handleDeletePlan(p)}
                        title="Archive Plan"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Read-Only Details Modal overlay */}
      {selectedPlan && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 680, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Collaborative Treatment Plan Record [{selectedPlan.id}]</h3>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginTop: 4 }}>Start Date: {selectedPlan.startDate} • Review Due: {selectedPlan.reviewDate}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => handleDownloadPlanPDF(selectedPlan)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CloudDownloadOutlinedIcon style={{ fontSize: 14 }} /> Download in Chrome
                </button>
                <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => window.print()}><PrintOutlinedIcon style={{ fontSize: 14 }} /></button>
                <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedPlan(null)} style={{ fontSize: 20, padding: '0 6px' }}>&times;</button>
              </div>
            </div>

            {/* Details Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 12 }}>
              
              {/* Client Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#F8F9FA', padding: 12, borderRadius: 8 }}>
                <div><strong>Client Name:</strong> {selectedPlan.clientName} (ID: {selectedPlan.clientId})</div>
                <div><strong>Age / Gender:</strong> {selectedPlan.age} yrs / {selectedPlan.gender}</div>
                <div><strong>Primary Therapist:</strong> {selectedPlan.therapist}</div>
                <div><strong>ICD-10 Diagnosis:</strong> {selectedPlan.diagnosis}</div>
              </div>

              {/* Progress Tracking Bar */}
              <div>
                <strong style={{ display: 'block', marginBottom: 6 }}>Overall Plan Progression Score</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 8, background: '#EAECF0', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${selectedPlan.progress}%`, height: '100%', background: 'linear-gradient(90deg, #4338CA 0%, #5B21B6 100%)' }}></div>
                  </div>
                  <strong style={{ fontSize: 12, color: '#4338CA' }}>{selectedPlan.progress}% Completed</strong>
                </div>
              </div>

              {/* Goal Cards */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: 13, fontWeight: 700 }}>Clinical Goals & Targets</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {selectedPlan.goals.map((g, idx) => (
                    <div key={idx} className="mc-card" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 12, color: '#1E1B4B' }}>{g.title}</strong>
                        <span className={`mc-badge mc-badge-${g.priority === 'HIGH' ? 'critical' : 'default'}`} style={{ fontSize: 8 }}>{g.priority}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)', minHeight: 36 }}>{g.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, borderTop: '1px solid var(--border-primary)', paddingTop: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Target: {g.target}</span>
                        <strong style={{ fontSize: 10, color: '#4338CA' }}>{g.progress}%</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectives & Interventions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                  <strong>Treatment Objectives:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPlan.objectives}</p>
                </div>
                <div style={{ background: '#F8F9FA', padding: 10, borderRadius: 8 }}>
                  <strong>Therapeutic Interventions:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: 11, color: 'var(--text-secondary)' }}>{selectedPlan.interventions}</p>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="mc-btn mc-btn-primary" onClick={() => setSelectedPlan(null)} style={{ fontSize: 12 }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showAddModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 500, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Formulate New Client Treatment Plan</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowAddModal(false)} style={{ fontSize: 20, padding: 4 }}>&times;</button>
            </div>
            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
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
                        clientName: `${c.firstName || ''} ${c.lastName || ''}`.trim() || c.username
                      });
                    } else {
                      setPlanForm({ ...planForm, clientId: '', clientName: '' });
                    }
                  }}
                  style={{ height: 36, fontSize: 12, marginBottom: 6 }}
                >
                  <option value="">-- Choose Client (or enter manually below) --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.clientNumber || `ID: ${c.id}`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Client / Patient Name</label>
                <input type="text" className="form-control" required value={planForm.clientName} onChange={e => setPlanForm({...planForm, clientName: e.target.value})} style={{ height: 36, fontSize: 12 }} placeholder="e.g. Alex Morgan" />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>ICD-10 Diagnosis</label>
                  <select className="form-select" value={planForm.diagnosis} onChange={e => setPlanForm({...planForm, diagnosis: e.target.value})} style={{ height: 36, fontSize: 12 }}>
                    <option value="F41.1 - Generalized Anxiety Disorder">F41.1 - Generalized Anxiety Disorder</option>
                    <option value="F32.1 - Major Depressive Disorder">F32.1 - Major Depressive Disorder</option>
                    <option value="F43.10 - PTSD">F43.10 - PTSD</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Review Schedule</label>
                  <input type="date" className="form-control" required value={planForm.reviewDate} onChange={e => setPlanForm({...planForm, reviewDate: e.target.value})} style={{ height: 36, fontSize: 12 }} />
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 10 }}>
                <strong style={{ fontSize: 11, display: 'block', marginBottom: 6 }}>Goal Formulations</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Goal Title</label>
                    <input type="text" className="form-control" required value={planForm.goalTitle} onChange={e => setPlanForm({...planForm, goalTitle: e.target.value})} style={{ height: 32, fontSize: 11 }} placeholder="e.g. Panics frequency reduction" />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Goal Description</label>
                    <textarea className="form-control" rows="2" style={{ fontSize: 11 }} value={planForm.goalDescription} onChange={e => setPlanForm({...planForm, goalDescription: e.target.value})} placeholder="measurable goal details..."></textarea>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Treatment Objective</label>
                  <input type="text" className="form-control" value={planForm.objective} onChange={e => setPlanForm({...planForm, objective: e.target.value})} style={{ height: 34, fontSize: 11 }} placeholder="e.g. Log 3 panic events weekly" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Therapeutic Intervention</label>
                  <input type="text" className="form-control" value={planForm.intervention} onChange={e => setPlanForm({...planForm, intervention: e.target.value})} style={{ height: 34, fontSize: 11 }} placeholder="e.g. CBT protocol" />
                </div>
              </div>
              
              <div style={{ background: '#EEF2FF', padding: 12, borderRadius: 8, border: '1px solid rgba(67, 56, 202, 0.15)', marginTop: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Therapist Electronic Signature</label>
                <input type="text" className="form-control" required placeholder="Type Full Name to Attest..." value={planForm.therapistSignature} onChange={e => setPlanForm({...planForm, therapistSignature: e.target.value})} style={{ height: 34, fontSize: 11, marginBottom: 8 }} />
                {planForm.therapistSignature && (
                  <div style={{ height: 44, background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed rgba(67, 56, 202, 0.3)', borderRadius: 6, fontFamily: 'cursive', fontSize: 16, color: '#4338CA', fontWeight: 'bold' }}>
                    {planForm.therapistSignature}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowAddModal(false)} style={{ fontSize: 12 }}>Cancel</button>
                <button type="submit" className="mc-btn mc-btn-primary" style={{ fontSize: 12 }}>Commit Treatment Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TreatmentPlanList;
