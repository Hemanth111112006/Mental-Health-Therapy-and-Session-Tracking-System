import { toast } from '../../../../utils/toast';
import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, Search, FileText, Download, Calendar as CalendarIcon, 
  DollarSign, Activity, BarChart2, Eye, X, Printer, CheckCircle, ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../../../providers/AuthProvider';
import { notificationApi } from '../../../../api/notificationApi';
import { reportApi } from '../../../../api/reportApi';

const DEFAULT_REPORTS = [
  {
    id: 'RPT-001',
    name: 'Monthly Revenue Summary',
    type: 'Financial',
    date: new Date().toLocaleDateString(),
    author: 'System',
    description: 'Comprehensive analysis of client billings, insurance clearances, and copays collected.',
    kpis: [
      { label: 'Total Revenue', value: '$48,230' },
      { label: 'Insurance Paid', value: '$38,400' },
      { label: 'Client Copays', value: '$9,830' },
      { label: 'Clearance Rate', value: '97.8%' }
    ],
    tableHeaders: ['Claim ID', 'Service / CPT', 'Client', 'Billed', 'Approved', 'Status'],
    tableRows: [
      ['CLM-9011', '90837 - Psychotherapy 60m', 'Client MC-2041', '$180.00', '$160.00', 'PAID'],
      ['CLM-9012', '90791 - Diagnostic Intake', 'Client MC-1887', '$240.00', '$220.00', 'PAID'],
      ['CLM-9013', '90834 - Psychotherapy 45m', 'Client MC-2156', '$140.00', '$130.00', 'PAID'],
      ['CLM-9014', '99214 - Med Management', 'Client MC-3021', '$195.00', '$175.00', 'PENDING']
    ]
  },
  {
    id: 'RPT-002',
    name: 'Client Outcome Measures',
    type: 'Clinical',
    date: new Date().toLocaleDateString(),
    author: 'System',
    description: 'Caseload symptom progression tracking across standardized PHQ-9 and GAD-7 measures.',
    kpis: [
      { label: 'Assessments Logged', value: '142' },
      { label: 'Avg PHQ-9 Reduction', value: '-38%' },
      { label: 'Avg GAD-7 Reduction', value: '-42%' },
      { label: 'Response Rate', value: '88.5%' }
    ],
    tableHeaders: ['Client ID', 'Assessment', 'Baseline', 'Recent Score', 'Change', 'Status'],
    tableRows: [
      ['MC-2041', 'PHQ-9 (Depression)', '18 (Severe)', '8 (Mild)', '-55%', 'IMPROVED'],
      ['MC-1887', 'GAD-7 (Anxiety)', '16 (Severe)', '7 (Mild)', '-56%', 'IMPROVED'],
      ['MC-2156', 'PHQ-9 (Depression)', '14 (Moderate)', '6 (Mild)', '-57%', 'IMPROVED'],
      ['MC-3021', 'GAD-7 (Anxiety)', '12 (Moderate)', '10 (Moderate)', '-16%', 'MONITORING']
    ]
  },
  {
    id: 'RPT-003',
    name: 'Appointment Utilization',
    type: 'Operational',
    date: new Date().toLocaleDateString(),
    author: 'System',
    description: 'Capacity and scheduling utilization, attendance trends, and cancellation metrics.',
    kpis: [
      { label: 'Total Appointments', value: '348' },
      { label: 'Completed Rate', value: '92.4%' },
      { label: 'Cancellation Rate', value: '4.8%' },
      { label: 'No-Show Rate', value: '2.8%' }
    ],
    tableHeaders: ['Time Slot', 'Clinician Group', 'Modality', 'Scheduled', 'Attended', 'Efficiency'],
    tableRows: [
      ['Morning (8am-12pm)', 'Therapy Staff', 'In-Person', '140', '132', '94.2%'],
      ['Afternoon (12pm-5pm)', 'Psychiatry / MD', 'Telehealth', '125', '118', '94.4%'],
      ['Evening (5pm-8pm)', 'Clinical Counselors', 'In-Person', '83', '74', '89.1%']
    ]
  },
  {
    id: 'RPT-004',
    name: 'Staff Productivity',
    type: 'Operational',
    date: new Date().toLocaleDateString(),
    author: 'System',
    description: 'Clinical hours logged, documentation completion latency, and caseload density.',
    kpis: [
      { label: 'Active Providers', value: '18' },
      { label: 'Avg Sessions / Wk', value: '24.2' },
      { label: 'Note Turnaround', value: '< 24 Hours' },
      { label: 'Compliance Score', value: '99.2%' }
    ],
    tableHeaders: ['Clinician', 'Role', 'Caseload', 'Sessions This Month', 'Notes Pending', 'Compliance'],
    tableRows: [
      ['Dr. Sarah Chen', 'Therapist', '24 clients', '96 sessions', '1 note', '98.9%'],
      ['Dr. Mark Rivera', 'Psychiatrist', '31 clients', '112 consultations', '2 notes', '98.2%'],
      ['Dr. James Liu', 'Therapist', '21 clients', '84 sessions', '0 notes', '100%'],
      ['Dr. Maya Patel', 'Psychologist', '19 clients', '76 assessments', '1 note', '98.6%']
    ]
  },
  {
    id: 'RPT-005',
    name: 'Billing & Claims Report',
    type: 'Financial',
    date: new Date().toLocaleDateString(),
    author: 'System',
    description: 'Breakdown of submitted claims to primary payers and insurance clearance timeline.',
    kpis: [
      { label: 'Claims Filed', value: '215' },
      { label: 'Paid in 30 Days', value: '198' },
      { label: 'Rejection Rate', value: '1.8%' },
      { label: 'Avg Clearance Time', value: '12 Days' }
    ],
    tableHeaders: ['Payer / Carrier', 'Claims', 'Total Value', 'Clearance Rate', 'Avg Days', 'Status'],
    tableRows: [
      ['Blue Cross Blue Shield', '94', '$21,400', '98.9%', '10 days', 'ACTIVE'],
      ['Aetna Behavioral Health', '56', '$12,800', '98.2%', '14 days', 'ACTIVE'],
      ['UnitedHealthcare / Optum', '42', '$9,600', '97.6%', '13 days', 'ACTIVE'],
      ['Medicare Part B', '23', '$4,430', '95.6%', '18 days', 'MONITORING']
    ]
  },
  {
    id: 'RPT-006',
    name: 'Clinical Supervision & Note Co-Signatures',
    type: 'Supervisory',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Kevin Torres, MD (Supervisor)',
    description: 'Weekly clinical review of supervisee notes, documentation turnaround latency, and co-signature queues.',
    kpis: [
      { label: 'Supervisees', value: '8 Providers' },
      { label: 'Notes Reviewed', value: '54 / 56' },
      { label: 'Co-Signed Rate', value: '96.4%' },
      { label: 'Avg Sign Latency', value: '< 24 Hours' }
    ],
    tableHeaders: ['Clinician', 'Role', 'Notes Submitted', 'Co-Signed', 'Pending Review', 'Status'],
    tableRows: [
      ['Dr. Sarah Chen', 'Therapist', '18 notes', '18 signed', '0 pending', 'COMPLIANT'],
      ['Dr. James Liu', 'Therapist', '14 notes', '14 signed', '0 pending', 'COMPLIANT'],
      ['Dr. Maya Patel', 'Psychologist', '12 notes', '11 signed', '1 pending', 'IN_REVIEW'],
      ['Dr. Kevin Torres', 'Therapist', '12 notes', '11 signed', '1 pending', 'IN_REVIEW']
    ]
  },
  {
    id: 'RPT-007',
    name: 'High-Risk Cases & Safety Plan Monitoring',
    type: 'Clinical',
    date: new Date().toLocaleDateString(),
    author: 'Supervision Desk',
    description: 'Active monitoring audit of clients with flagged PHQ-9 question 9 scores, crisis episodes, or safety plans.',
    kpis: [
      { label: 'Monitored Cases', value: '7 Clients' },
      { label: 'Active Safety Plans', value: '7 / 7' },
      { label: 'Crisis Evaluations', value: '3 This Month' },
      { label: 'Safety Index', value: '100% Protected' }
    ],
    tableHeaders: ['Client Name & ID', 'Primary Clinician', 'Risk Factor', 'Safety Plan', 'Follow-up Date', 'Status'],
    tableRows: [
      ['Marcus Williams (MC-1887)', 'Dr. Sarah Chen', 'PHQ-9 Q9 Flagged (1)', 'ACTIVE', '2026-09-12', 'MONITORING'],
      ['Sofia Garcia (MC-2156)', 'Dr. James Liu', 'PTSD Severity', 'ACTIVE', '2026-09-14', 'STABILIZED'],
      ['Robert Foster (MC-3021)', 'Dr. Mark Rivera', 'Lithium Titration', 'ACTIVE', '2026-09-15', 'MONITORING'],
      ['Emma Johnson (MC-2041)', 'Dr. Sarah Chen', 'PHQ-9 Severe (21)', 'ACTIVE', '2026-09-16', 'IMPROVED']
    ]
  }
];

export const PSYCHIATRIST_REPORTS = [
  {
    id: 'RPT-PSY-MD-001',
    name: 'Psychopharmacology Outcomes & Medication Monitoring Report',
    type: 'Clinical',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Mark Rivera, MD',
    description: 'Monthly audit of psychiatric medication adherence, adverse event tracking, serum levels, and symptom outcome trajectories across Dr. Rivera\'s caseload.',
    kpis: [
      { label: 'Active Rx Orders', value: '31 Patients' },
      { label: 'Adherence Rate', value: '94.6%' },
      { label: 'Avg PHQ-9 Delta', value: '-46.2%' },
      { label: 'Adverse Events', value: '2 Monitored' }
    ],
    tableHeaders: ['Client ID', 'Client Name', 'Medication', 'Dose', 'Adherence', 'Last Level / Outcome'],
    tableRows: [
      ['CLN-3CD50763', 'Taylor Morgan', 'Sertraline 100mg', 'QAM', '96%', 'PHQ-9: 7 (Mild) — Improving'],
      ['MC-2041', 'Sarah Connor', 'Lithium Carbonate 600mg BID', 'BID', '92%', 'Level: 0.82 mEq/L — Therapeutic'],
      ['MC-1887', 'Richard Rodriguez', 'Prazosin 4mg', 'QHS', '98%', 'Nightmares: 1x/wk — Responding'],
      ['MC-3021', 'Morgan Davis', 'Escitalopram 20mg', 'QAM', '90%', 'PHQ-9: 9 (Mild) — Stable']
    ]
  },
  {
    id: 'RPT-PSY-MD-002',
    name: 'Psychiatric Caseload ROM Trajectory Report',
    type: 'Clinical',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Mark Rivera, MD',
    description: 'Longitudinal routine outcome monitoring tracking PHQ-9 and GAD-7 trajectories for all active psychiatric patients across bi-monthly standardized assessments.',
    kpis: [
      { label: 'Monitored Clients', value: '31' },
      { label: 'Avg PHQ-9 Reduction', value: '-52.8%' },
      { label: 'Avg GAD-7 Reduction', value: '-44.6%' },
      { label: 'Clinical Remission Rate', value: '74.2%' }
    ],
    tableHeaders: ['Client ID', 'Client Name', 'Primary Dx', 'Baseline PHQ-9', 'Current PHQ-9', 'Clinical Trajectory'],
    tableRows: [
      ['CLN-3CD50763', 'Taylor Morgan', 'F33.1 MDD', '18 (Mod. Severe)', '7 (Mild)', 'SIGNIFICANT IMPROVEMENT'],
      ['MC-2041', 'Sarah Connor', 'F31.32 Bipolar I', '22 (Severe)', '10 (Moderate)', 'PROGRESSING'],
      ['MC-1887', 'Richard Rodriguez', 'F43.10 PTSD', '19 (Severe)', '13 (Moderate)', 'PROGRESSING'],
      ['MC-3021', 'Morgan Davis', 'F32.1 MDD Moderate', '16 (Moderate)', '9 (Mild)', 'SIGNIFICANT IMPROVEMENT']
    ]
  },
  {
    id: 'RPT-PSY-MD-003',
    name: 'Psychiatric Crisis & High-Risk Case Monitoring Report',
    type: 'Clinical',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Mark Rivera, MD',
    description: 'Active safety monitoring audit for high-risk psychiatric patients with flagged PHQ-9 Q9, active safety plans, crisis evaluations, and hospitalization history.',
    kpis: [
      { label: 'High-Risk Clients', value: '4 Cases' },
      { label: 'Safety Plans Active', value: '4 / 4' },
      { label: 'Crisis Evaluations (MTD)', value: '2 Episodes' },
      { label: 'Hospitalization Rate', value: '0% This Month' }
    ],
    tableHeaders: ['Client Name & ID', 'Primary Clinician', 'Risk Factor', 'Safety Plan Status', 'Next Follow-up', 'Status'],
    tableRows: [
      ['Taylor Morgan (CLN-3CD50763)', 'Dr. Mark Rivera, MD', 'PHQ-9 Q9 Endorsed (Score 2)', 'ACTIVE — Stanley-Brown', '2026-09-12', 'MONITORING'],
      ['Sarah Connor (MC-2041)', 'Dr. Mark Rivera, MD', 'Bipolar I Manic Episode Risk', 'ACTIVE — Lithium Protocol', '2026-09-18', 'MONITORING'],
      ['Richard Rodriguez (MC-1887)', 'Dr. Mark Rivera, MD', 'PTSD Hyperarousal & Nightmares', 'ACTIVE — EMDR Protocol', '2026-09-20', 'STABILIZED'],
      ['Morgan Davis (MC-3021)', 'Dr. Mark Rivera, MD', 'MDD Moderate — Sentinel', 'ACTIVE — Standard', '2026-09-25', 'STABLE']
    ]
  },
  {
    id: 'RPT-PSY-MD-004',
    name: 'Consultation & Coordination with Therapy Team',
    type: 'Operational',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Mark Rivera, MD',
    description: 'Multidisciplinary coordination audit covering psychiatric consultation requests, cross-team communication, medication adjustments, and co-management notes.',
    kpis: [
      { label: 'Consultations (MTD)', value: '18 Requests' },
      { label: 'Avg Response Time', value: '4.8 Hours' },
      { label: 'Co-Management Cases', value: '12 Active' },
      { label: 'Med Adjustments', value: '6 This Month' }
    ],
    tableHeaders: ['Request ID', 'Referring Clinician', 'Client', 'Consultation Type', 'Response Time', 'Status'],
    tableRows: [
      ['CNSLT-4401', 'Dr. Sarah Chen, LCSW', 'Taylor Morgan', 'Medication Augmentation (Sertraline)', '3.2 hrs', 'COMPLETED'],
      ['CNSLT-4402', 'Dr. James Liu', 'Marcus Williams', 'PHQ-9 Q9 Safety Review', '2.8 hrs', 'COMPLETED'],
      ['CNSLT-4403', 'Dr. Maya Patel, PsyD', 'Richard Rodriguez', 'PTSD Differential & Prazosin', '5.1 hrs', 'COMPLETED'],
      ['CNSLT-4404', 'Dr. Kevin Torres, MD', 'Emma Johnson', 'Mood Stabilizer Assessment', '4.6 hrs', 'IN_PROGRESS']
    ]
  },
  {
    id: 'RPT-PSY-MD-005',
    name: 'Medication Management Note Compliance Audit',
    type: 'Operational',
    date: new Date().toLocaleDateString(),
    author: 'Dr. Kevin Torres, MD (Supervisor)',
    description: 'Supervisory co-signature audit for psychiatric medication management notes, compliance with CMS documentation standards, and turnaround timelines.',
    kpis: [
      { label: 'Med Mgmt Notes (MTD)', value: '112 Notes' },
      { label: 'Co-Signed Rate', value: '98.2%' },
      { label: 'Turnaround Avg', value: '18.4 Hours' },
      { label: 'HIPAA Compliance', value: '100%' }
    ],
    tableHeaders: ['Note ID', 'Clinician', 'Client', 'Note Type', 'Signed', 'Status'],
    tableRows: [
      ['CN-8801', 'Dr. Mark Rivera, MD', 'Taylor Morgan', '99214 Med Management', '2026-09-10', 'CO-SIGNED'],
      ['CN-8802', 'Dr. Mark Rivera, MD', 'Sarah Connor', '99213 Med Management', '2026-09-09', 'CO-SIGNED'],
      ['CN-8803', 'Dr. Mark Rivera, MD', 'Richard Rodriguez', '90837 Psychiatric Review', '2026-09-08', 'CO-SIGNED'],
      ['CN-8804', 'Dr. Mark Rivera, MD', 'Morgan Davis', '90834 Medication Consult', '2026-09-07', 'PENDING']
    ]
  }
];


export const PSYCHOLOGIST_REPORTS = [
  {
    id: 'RPT-PSY-001',
    name: 'Psychological Assessment Battery Summary',
    type: 'Clinical',
    date: '2026-09-10',
    author: 'Dr. Maya Patel, PsyD',
    description: 'Standardized battery assessment summary tracking diagnostic psychometrics (PHQ-9, GAD-7, MMPI-3, and PCL-5) across active caseload.',
    kpis: [
      { label: 'Batteries Administered', value: '38' },
      { label: 'Avg Scoring Latency', value: '4.2 hrs' },
      { label: 'Diagnostic Concordance', value: '96.8%' },
      { label: 'Follow-up Recommended', value: '14 Cases' }
    ],
    tableHeaders: ['Client ID', 'Client Name', 'Battery Type', 'Raw Score / Index', 'Diagnostic Impression', 'Status'],
    tableRows: [
      ['MC-4401', 'Sophia Davis', 'WAIS-IV + PHQ-9', 'PHQ-9: 18 (Mod. Severe)', 'Major Depressive Disorder', 'COMPLETED'],
      ['MC-4402', 'Ava Johnson', 'GAD-7 + Beck AI', 'GAD-7: 15 (Severe)', 'Generalized Anxiety Disorder', 'COMPLETED'],
      ['MC-4403', 'Richard Rodriguez', 'PCL-5 + CAPS-5', 'PCL-5: 48 (Elevated)', 'Post-Traumatic Stress', 'IN_REVIEW'],
      ['MC-1998', 'Tom Bradley', 'MMPI-3 Clinical', 'Scale 2: T=72 (High)', 'Mood Dysregulation', 'COMPLETED']
    ]
  },
  {
    id: 'RPT-PSY-002',
    name: 'Caseload Routine Outcome Monitoring (ROM) Trajectory',
    type: 'Clinical',
    date: '2026-09-08',
    author: 'Dr. Maya Patel, PsyD',
    description: 'Longitudinal outcome monitoring measuring symptom reduction across bi-weekly standardized PHQ-9 and GAD-7 administrations.',
    kpis: [
      { label: 'Active Monitored', value: '24 Clients' },
      { label: 'Avg PHQ-9 Delta', value: '-44.2%' },
      { label: 'Avg GAD-7 Delta', value: '-48.6%' },
      { label: 'Reliable Change Index', value: '88.9%' }
    ],
    tableHeaders: ['Client ID', 'Client Name', 'Baseline Score', 'Current Score', 'Score Delta', 'Clinical Trajectory'],
    tableRows: [
      ['MC-4401', 'Sophia Davis', '22 (Severe)', '11 (Moderate)', '-50.0%', 'SIGNIFICANT IMPROVEMENT'],
      ['MC-4402', 'Ava Johnson', '17 (Severe)', '8 (Mild)', '-52.9%', 'CLINICAL REMISSION'],
      ['MC-4403', 'Richard Rodriguez', '19 (Severe)', '13 (Moderate)', '-31.5%', 'PROGRESSING'],
      ['MC-2344', 'Rachel Adams', '18 (Mod. Severe)', '9 (Mild)', '-50.0%', 'SIGNIFICANT IMPROVEMENT']
    ]
  },
  {
    id: 'RPT-PSY-003',
    name: 'Neuropsychological & Cognitive Intake Evaluation Audit',
    type: 'Clinical',
    date: '2026-09-05',
    author: 'Dr. Maya Patel, PsyD',
    description: 'Comprehensive diagnostic audit of cognitive screening, memory testing, and executive functioning intake evaluations.',
    kpis: [
      { label: 'Intakes Completed', value: '19' },
      { label: 'MoCA Avg Score', value: '27.4 / 30' },
      { label: 'Executive Screening', value: '100% Complete' },
      { label: 'Multidisciplinary Consults', value: '7 Referrals' }
    ],
    tableHeaders: ['Evaluation ID', 'Client', 'Evaluation Focus', 'Cognitive Battery', 'Primary Finding', 'Disposition'],
    tableRows: [
      ['EV-2026-88', 'Sophia Davis', 'Attention & Executive', 'WAIS-IV / Stroop', 'Executive Functioning Deficit', 'CBT Recommended'],
      ['EV-2026-89', 'Tom Bradley', 'Adult ADHD Differential', 'DIVA-5 + Conners', 'ADHD Inattentive Type', 'Psychiatry Consult'],
      ['EV-2026-90', 'Elena Rostova', 'Memory & Processing', 'WMS-IV Subtests', 'Normal Age Baseline', 'Routine Outpatient'],
      ['EV-2026-91', 'Richard Rodriguez', 'Trauma Differential', 'MMPI-3 + PCL-5', 'PTSD Symptomatology', 'Trauma Protocol']
    ]
  },
  {
    id: 'RPT-PSY-004',
    name: 'Caseload Density & Testing Turnaround Compliance',
    type: 'Operational',
    date: '2026-09-01',
    author: 'Dr. Maya Patel, PsyD',
    description: 'Operational assessment tracking assessment battery turnaround latency, psychometric reporting timelines, and compliance.',
    kpis: [
      { label: 'Caseload Capacity', value: '19 / 22 Clients' },
      { label: 'Report Turnaround', value: '2.8 Days (Target < 5)' },
      { label: 'Protocol Compliance', value: '100%' },
      { label: 'Hours Charted', value: '76.5 hrs' }
    ],
    tableHeaders: ['Category', 'Weekly Volume', 'Avg Time / Assessment', 'Compliance Standard', 'Audit Status'],
    tableRows: [
      ['Standardized Testing', '8 sessions', '90 min', 'APA Guideline Compliant', 'PASSED'],
      ['Diagnostic Scoring', '8 protocols', '45 min', '< 48 Hours', 'PASSED'],
      ['Comprehensive Report', '4 reports', '120 min', '< 5 Business Days', 'PASSED'],
      ['Clinical Supervision Review', '2 case conferences', '60 min', 'Bi-weekly Standard', 'PASSED']
    ]
  },
  {
    id: 'RPT-PSY-005',
    name: 'Clinical Supervision & Assessment Sign-Off Review',
    type: 'Supervisory',
    date: '2026-08-28',
    author: 'Dr. Kevin Torres, MD (Supervisor)',
    description: 'Supervisory co-signature audit and peer review evaluation of psychological assessment reports and battery protocols.',
    kpis: [
      { label: 'Protocols Reviewed', value: '24 / 24' },
      { label: 'Supervisory Concordance', value: '100%' },
      { label: 'Risk Protocols Approved', value: '5 Cases' },
      { label: 'Compliance Status', value: 'Fully Certified' }
    ],
    tableHeaders: ['Protocol ID', 'Clinician', 'Assessment Battery', 'Supervisory Finding', 'Co-Signature Date', 'Status'],
    tableRows: [
      ['PRT-8801', 'Dr. Maya Patel, PsyD', 'WAIS-IV Cognitive Assessment', 'Diagnostic formulation confirmed', '2026-08-28', 'CO-SIGNED'],
      ['PRT-8802', 'Dr. Maya Patel, PsyD', 'MMPI-3 Personality Profile', 'Secondary depression scale aligned', '2026-08-27', 'CO-SIGNED'],
      ['PRT-8803', 'Dr. Maya Patel, PsyD', 'PCL-5 Trauma Assessment', 'Safety plan verified and active', '2026-08-26', 'CO-SIGNED']
    ]
  }
];

const STORAGE_KEY = 'mindcare_admin_reports';

const normalizeReport = (r) => {
  if (!r) return null;
  let kpis = [];
  if (Array.isArray(r.kpis)) kpis = r.kpis;
  else if (typeof r.kpis === 'string' && r.kpis) {
    try { kpis = JSON.parse(r.kpis); } catch (e) { kpis = []; }
  }

  let tableHeaders = [];
  if (Array.isArray(r.tableHeaders)) tableHeaders = r.tableHeaders;
  else if (typeof r.tableHeaders === 'string' && r.tableHeaders) {
    try { tableHeaders = JSON.parse(r.tableHeaders); } catch (e) { tableHeaders = []; }
  }

  let tableRows = [];
  if (Array.isArray(r.tableRows)) tableRows = r.tableRows;
  else if (typeof r.tableRows === 'string' && r.tableRows) {
    try { tableRows = JSON.parse(r.tableRows); } catch (e) { tableRows = []; }
  }

  return {
    ...r,
    id: r.reportNumber || (r.id ? `RPT-${String(r.id).padStart(3, '0')}` : 'RPT-001'),
    dbId: r.id,
    name: r.name || 'Clinical Report',
    type: r.type || 'Clinical',
    date: r.date || (r.createdAt ? String(r.createdAt).split('T')[0] : new Date().toLocaleDateString()),
    author: r.author || 'System',
    description: r.description || '',
    kpis,
    tableHeaders,
    tableRows
  };
};

const AdminReportsPage = () => {
  const { currentUser } = useAuth();
  const userRole = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
  const isPsychologist = userRole === 'PSYCHOLOGIST';
  const isPsychiatrist = userRole === 'PSYCHIATRIST';
  const roleStorageKey = `mindcare_reports_${userRole.toLowerCase() || 'admin'}`;

  const getRoleDefaultReports = () => {
    if (isPsychologist) return PSYCHOLOGIST_REPORTS;
    if (isPsychiatrist) return PSYCHIATRIST_REPORTS;
    return DEFAULT_REPORTS;
  };

  // One-time stale cache eviction: bumped to v3 to force admin to reload all 7 canonical reports
  const REPORTS_CACHE_VERSION = 'v3_2026-09-11';
  const cacheVersionKey = `${roleStorageKey}_version`;
  if (typeof window !== 'undefined') {
    const cachedVersion = localStorage.getItem(cacheVersionKey);
    if (cachedVersion !== REPORTS_CACHE_VERSION) {
      localStorage.removeItem(roleStorageKey);
      localStorage.removeItem(STORAGE_KEY); // also clear legacy key
      localStorage.setItem(cacheVersionKey, REPORTS_CACHE_VERSION);
    }
  }

  const [reports, setReports] = useState(() => {
    const roleDefaultReports = getRoleDefaultReports();
    const saved = localStorage.getItem(roleStorageKey);
    let initialList = roleDefaultReports;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          for (const def of roleDefaultReports) {
            if (!merged.some(r => r.id === def.id || (r.name && r.name.toLowerCase() === def.name.toLowerCase()))) {
              merged.push(def);
            }
          }
          initialList = merged;
        }
      } catch (e) {
        initialList = roleDefaultReports;
      }
    }
    return initialList;

  });

  // Fetch reports from MySQL backend on load
  useEffect(() => {
    const fetchBackendReports = async () => {
      try {
        const backendData = await reportApi.getAllReports();
        let list = [];
        if (Array.isArray(backendData) && backendData.length > 0) {
          list = backendData.map(normalizeReport).filter(Boolean);
        }

        const roleDefaults = getRoleDefaultReports();
        let merged = [];

        if (isPsychologist || isPsychiatrist) {
          // For role-specific workspaces: always show role-specific reports first
          const roleReports = [];
          for (const def of roleDefaults) {
            const found = list.find(r => r.id === def.id || r.reportNumber === def.id || (r.name && r.name.toLowerCase() === def.name.toLowerCase()));
            roleReports.push(found || def);
          }
          // Append backend-only reports not covered by defaults (e.g. generated reports)
          const otherReports = list.filter(r => !roleDefaults.some(p => p.id === r.id || p.id === r.reportNumber || (r.name && r.name.toLowerCase() === p.name.toLowerCase())));
          merged = [...roleReports, ...otherReports];
        } else {
          merged = [...list];
          for (const def of DEFAULT_REPORTS) {
            if (!merged.some(r => r.id === def.id || (r.name && r.name.toLowerCase() === def.name.toLowerCase()))) {
              merged.push(def);
            }
          }
        }
        setReports(merged);
      } catch (err) {
        console.warn('Backend reports notice:', err);
      }
    };
    fetchBackendReports();
  }, [isPsychologist, isPsychiatrist]);

  const [activeTab, setActiveTab] = useState('All Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Last 30 Days');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modals state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Form state for generating report
  const [genForm, setGenForm] = useState({
    category: (isPsychologist || isPsychiatrist) ? 'Clinical' : 'Financial',
    template: isPsychologist ? 'Psychological Assessment Battery Summary' : isPsychiatrist ? 'Psychopharmacology Outcomes & Medication Monitoring' : 'Financial Summary',
    customTitle: '',
    dateRange: 'Last 30 Days'
  });

  const dateOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'This Year', 'Custom Range'];

  // Persist reports whenever updated
  useEffect(() => {
    localStorage.setItem(roleStorageKey, JSON.stringify(reports));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports, roleStorageKey]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Financial': return '#10B981';
      case 'Clinical': return 'var(--primary-color, #3B82F6)';
      case 'Supervisory': return '#6366F1';
      case 'Operational': return '#F59E0B';
      default: return '#8B5CF6';
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'Financial') return <DollarSign size={16} />;
    if (type === 'Clinical') return <Activity size={16} />;
    return <BarChart2 size={16} />;
  };

  const handleCreateReportSubmit = async (e) => {
    e.preventDefault();

    const nextNumber = reports.length + 1;
    const formattedId = `RPT-${String(nextNumber).padStart(3, '0')}`;
    const reportTitle = genForm.customTitle.trim() || `${genForm.template} (${genForm.dateRange})`;

    let kpis = [];
    let tableHeaders = [];
    let tableRows = [];
    let description = '';

    if (genForm.category === 'Financial') {
      description = `Financial summary report covering revenue clearance, insurance collections, and claim totals for ${genForm.dateRange.toLowerCase()}.`;
      kpis = [
        { label: 'Period Revenue', value: '$52,840' },
        { label: 'Cleared Claims', value: '138' },
        { label: 'Copays Collected', value: '$11,200' },
        { label: 'Payment Rate', value: '98.4%' }
      ];
      tableHeaders = ['Claim ID', 'Service / CPT', 'Client', 'Billed', 'Approved', 'Status'];
      tableRows = [
        ['CLM-9021', '90837 - Psychotherapy 60m', 'Client MC-2204', '$180.00', '$160.00', 'PAID'],
        ['CLM-9022', '90791 - Diagnostic Intake', 'Client MC-2311', '$240.00', '$220.00', 'PAID'],
        ['CLM-9023', '90834 - Psychotherapy 45m', 'Client MC-2450', '$140.00', '$130.00', 'PAID'],
        ['CLM-9024', '99214 - Med Management', 'Client MC-2510', '$195.00', '$175.00', 'PAID'],
        ['CLM-9025', '90837 - Psychotherapy 60m', 'Client MC-2601', '$180.00', '$160.00', 'PENDING']
      ];
    } else if (genForm.category === 'Clinical') {
      if (isPsychologist) {
        description = `Standardized psychological assessment battery and routine outcome monitoring audit evaluating symptom progression and psychometric trajectories for ${genForm.dateRange.toLowerCase()}.`;
        kpis = [
          { label: 'Batteries Administered', value: '42 Protocols' },
          { label: 'Avg PHQ-9 Delta', value: '-48.2%' },
          { label: 'Avg GAD-7 Delta', value: '-52.0%' },
          { label: 'Remission Rate', value: '82.5%' }
        ];
        tableHeaders = ['Client ID', 'Client Name', 'Battery Type', 'Baseline Score', 'Current Score', 'Clinical Trajectory'];
        tableRows = [
          ['MC-4401', 'Sophia Davis', 'WAIS-IV + PHQ-9', '22 (Severe)', '10 (Mild)', 'SIGNIFICANT IMPROVEMENT'],
          ['MC-4402', 'Ava Johnson', 'GAD-7 + Beck AI', '18 (Severe)', '7 (Mild)', 'CLINICAL REMISSION'],
          ['MC-4403', 'Richard Rodriguez', 'PCL-5 + CAPS-5', '50 (Elevated)', '28 (Moderate)', 'PROGRESSING'],
          ['MC-1998', 'Tom Bradley', 'MMPI-3 Clinical', 'T=76 (High)', 'T=54 (Normal)', 'DIAGNOSTIC RESOLUTION']
        ];
      } else {
        description = `Clinical effectiveness audit evaluating symptom severity outcomes and treatment progression for ${genForm.dateRange.toLowerCase()}.`;
        kpis = [
          { label: 'Total Assessments', value: '168' },
          { label: 'Avg PHQ-9 Delta', value: '-41%' },
          { label: 'Avg GAD-7 Delta', value: '-45%' },
          { label: 'Remission Rate', value: '76.2%' }
        ];
        tableHeaders = ['Client ID', 'Assessment', 'Baseline', 'Recent Score', 'Change', 'Status'];
        tableRows = [
          ['MC-2204', 'PHQ-9 (Depression)', '19 (Severe)', '7 (Mild)', '-63%', 'REMISSION'],
          ['MC-2311', 'GAD-7 (Anxiety)', '17 (Severe)', '6 (Mild)', '-65%', 'REMISSION'],
          ['MC-2450', 'PHQ-9 (Depression)', '15 (Moderate)', '6 (Mild)', '-60%', 'IMPROVED'],
          ['MC-2510', 'GAD-7 (Anxiety)', '14 (Moderate)', '8 (Mild)', '-43%', 'IMPROVED']
        ];
      }
    } else if (genForm.category === 'Supervisory') {
      description = `Clinical supervision audit covering supervisee caseload distribution, note co-signatures, and compliance reviews for ${genForm.dateRange.toLowerCase()}.`;
      kpis = [
        { label: 'Supervised Providers', value: '8 Clinicians' },
        { label: 'Notes Signed', value: '48 / 50' },
        { label: 'Co-Signature Rate', value: '96.0%' },
        { label: 'Audit Compliance', value: '100%' }
      ];
      tableHeaders = ['Clinician', 'Caseload', 'Notes Awaiting Co-Sign', 'Completed Today', 'Risk Status', 'Status'];
      tableRows = [
        ['Dr. Sarah Chen, LCSW', '24 clients', '1 pending', '6 signed', '1 High Risk', 'COMPLIANT'],
        ['Dr. James Liu, PsyD', '21 clients', '0 pending', '5 signed', '0 High Risk', 'COMPLIANT'],
        ['Dr. Maya Patel, PsyD', '19 clients', '1 pending', '4 signed', '0 High Risk', 'IN_REVIEW'],
        ['Dr. Kevin Torres, MD', '22 clients', '0 pending', '5 signed', '0 High Risk', 'COMPLIANT']
      ];
    } else {
      description = `Operational scheduling efficiency and provider utilization audit for ${genForm.dateRange.toLowerCase()}.`;
      kpis = [
        { label: 'Scheduled Sessions', value: '382' },
        { label: 'Attendance Rate', value: '94.8%' },
        { label: 'Cancellation Rate', value: '3.4%' },
        { label: 'No-Show Rate', value: '1.8%' }
      ];
      tableHeaders = ['Time Window', 'Clinician Group', 'Modality', 'Scheduled', 'Attended', 'Efficiency'];
      tableRows = [
        ['Morning (8am-12pm)', 'Therapy Staff', 'In-Person', '152', '146', '96.1%'],
        ['Afternoon (12pm-5pm)', 'Psychiatry / MD', 'Telehealth', '140', '133', '95.0%'],
        ['Evening (5pm-8pm)', 'Clinical Counselors', 'In-Person', '90', '83', '92.2%']
      ];
    }

    let authorName = 'Clinical Administration';
    if (isPsychologist) {
      authorName = 'Dr. Maya Patel, PsyD';
    } else if (userRole === 'THERAPIST') {
      authorName = 'Dr. Sarah Chen, LCSW';
    } else if (userRole === 'PSYCHIATRIST') {
      authorName = 'Dr. Mark Rivera, MD';
    } else if (userRole === 'SUPERVISOR') {
      authorName = 'Dr. Kevin Torres, MD (Supervisor)';
    } else if (currentUser?.firstName && currentUser?.lastName) {
      authorName = `${currentUser.firstName} ${currentUser.lastName}`.trim();
    } else if (currentUser?.username) {
      authorName = currentUser.username;
    }

    const newReport = {
      id: formattedId,
      name: reportTitle,
      type: genForm.category,
      date: new Date().toLocaleDateString(),
      author: authorName,
      description,
      kpis,
      tableHeaders,
      tableRows
    };

    // Persist new report to backend MySQL and state
    try {
      const savedToBackend = await reportApi.createReport(newReport);
      const normalizedNew = normalizeReport(savedToBackend) || newReport;
      setReports([normalizedNew, ...reports]);
    } catch (apiErr) {
      console.warn('Backend save notice:', apiErr);
      const updated = [newReport, ...reports];
      setReports(updated);
    }

    // Save notification to backend
    try {
      await notificationApi.createNotification({
        title: 'Report Generated',
        message: `Report "${newReport.name}" (${newReport.id}) is ready to view and download.`,
        type: 'SYSTEM'
      });
    } catch (err) {
      console.warn('Notification creation notice:', err);
    }

    toast.success(`Report "${newReport.name}" (${newReport.id}) generated and saved successfully!`);
    setShowGenerateModal(false);

    // Automatically open report viewer modal so user sees it immediately
    setSelectedReport(newReport);
  };

  const handleDownloadCSV = (report) => {
    let csv = `Report Name,${report.name}\n`;
    csv += `Report ID,${report.id}\n`;
    csv += `Category,${report.type}\n`;
    csv += `Date Generated,${report.date}\n`;
    csv += `Generated By,${report.author}\n\n`;

    if (report.kpis && report.kpis.length > 0) {
      csv += `SUMMARY METRICS\n`;
      report.kpis.forEach(kpi => {
        csv += `${kpi.label},${kpi.value}\n`;
      });
      csv += `\n`;
    }

    if (report.tableHeaders && report.tableRows) {
      csv += report.tableHeaders.join(',') + '\n';
      report.tableRows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
      });
    } else {
      csv += `Report Name,Date,Status\n${report.name},${report.date},Generated\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_${report.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Downloaded ${report.name}.csv to your Downloads folder.`);
  };

  const handleDownloadPDF = (report) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Primary Brand Header Banner
      doc.setFillColor(37, 99, 235); // Sapphire Navy / Royal Blue
      doc.rect(0, 0, 210, 24, 'F');

      // Header Titles
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Mental Health Therapy System', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('CLINICAL & ADMINISTRATIVE REPORT · HIPAA COMPLIANT', 15, 18);

      // Report Title & Metadata Section
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text(report.name, 15, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Report ID: ${report.id}   |   Category: ${report.type}   |   Generated: ${report.date}   |   By: ${report.author}`, 15, 43);

      // Description Box
      if (report.description) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(15, 48, 180, 14, 2, 2, 'FD');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(8.5);
        doc.text(doc.splitTextToSize(report.description, 174), 18, 54);
      }

      let currentY = 68;

      // KPI Summary Metric Boxes (4 columns)
      if (report.kpis && report.kpis.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Executive Summary & Key Metrics', 15, currentY);
        currentY += 6;

        const boxWidth = 42;
        const boxHeight = 16;
        const gap = 4;
        report.kpis.slice(0, 4).forEach((kpi, index) => {
          const col = index % 4;
          const x = 15 + col * (boxWidth + gap);
          doc.setFillColor(241, 245, 249);
          doc.setDrawColor(203, 213, 225);
          doc.roundedRect(x, currentY, boxWidth, boxHeight, 2, 2, 'FD');

          doc.setFontSize(7.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(100, 116, 139);
          doc.text(kpi.label.toUpperCase(), x + 4, currentY + 5);

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 58, 138);
          doc.text(String(kpi.value), x + 4, currentY + 12);
        });
        currentY += boxHeight + 10;
      }

      // Data Table
      if (report.tableHeaders && report.tableRows && report.tableRows.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Detailed Registry & Itemized Breakdown', 15, currentY);
        currentY += 6;

        // Header Row
        const numCols = report.tableHeaders.length;
        const colWidth = 180 / numCols;

        doc.setFillColor(30, 41, 59);
        doc.rect(15, currentY, 180, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        report.tableHeaders.forEach((h, i) => {
          doc.text(String(h), 17 + i * colWidth, currentY + 5.5);
        });
        currentY += 8;

        // Rows
        doc.setFont('helvetica', 'normal');
        report.tableRows.forEach((row, rowIndex) => {
          if (currentY > 265) {
            doc.addPage();
            currentY = 20;
          }

          doc.setFillColor(rowIndex % 2 === 0 ? 255 : 248, rowIndex % 2 === 0 ? 255 : 250, rowIndex % 2 === 0 ? 255 : 252);
          doc.rect(15, currentY, 180, 7, 'F');
          doc.setDrawColor(241, 245, 249);
          doc.line(15, currentY + 7, 195, currentY + 7);

          doc.setTextColor(51, 65, 85);
          doc.setFontSize(7.5);
          row.forEach((cell, colIndex) => {
            const cellText = String(cell);
            doc.text(cellText.length > 24 ? cellText.substring(0, 22) + '...' : cellText, 17 + colIndex * colWidth, currentY + 5);
          });
          currentY += 7;
        });
      }

      // Footer Section
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 280, 195, 280);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`MindCare EHR • Confidential Medical & Operational Audit`, 15, 285);
      doc.text(`Downloaded directly via Google Chrome on ${new Date().toLocaleString()}`, 115, 285);

      // Trigger Instant Chrome Download
      const safeFileName = `${report.id}_${report.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(safeFileName);
      toast.success(`Downloaded ${safeFileName} to Chrome Downloads!`);
    } catch (err) {
      console.error('PDF Generation error:', err);
      toast.error('Failed to generate PDF in Chrome: ' + err.message);
    }
  };

  const getPageTitle = () => {
    const role = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
    if (role === 'PSYCHOLOGIST') return 'Psychological Assessment & Clinical Reports';
    if (role === 'SUPERVISOR') return 'Supervisory & Clinical Reports';
    if (role === 'THERAPIST' || role === 'COUNSELOR') return 'Therapy & Clinical Practice Reports';
    if (role === 'PSYCHIATRIST') return 'Psychiatric & Medical Reports';
    if (role === 'CASE_MANAGER') return 'Care Coordination & Resource Reports';
    return 'Clinical & Administrative Reports';
  };

  const getPageSubtitle = () => {
    const role = (currentUser?.role || '').replace('ROLE_', '').toUpperCase();
    if (role === 'PSYCHOLOGIST') return 'Caseload symptom progression, standardized psychological assessment batteries, ROM trajectories, and intake audits.';
    if (role === 'SUPERVISOR') return 'Supervisee caseload distribution, clinical documentation compliance, note co-signatures, and ROM progress audits.';
    if (role === 'THERAPIST' || role === 'COUNSELOR') return 'Clinical caseload summaries, diagnostic assessments, outcome measure trajectories, and session logs.';
    if (role === 'PSYCHIATRIST') return 'Psychiatric caseload summaries, medication monitoring, clinical outcome trajectories, and consultation audits.';
    return 'Generate, view, and export clinical, operational, and financial reports.';
  };

  const filtered = reports.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'All Reports' || r.type === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="mc-page-container" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', backgroundColor: 'var(--primary-color, #4338CA)', color: 'white', borderRadius: '8px', display: 'flex' }}>
            <FileBarChart size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{getPageTitle()}</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {getPageSubtitle()}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowGenerateModal(true)} 
          className="mc-btn mc-btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: 600 }}
        >
          <FileText size={16} /> Generate Report
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '0' }}>
        {['All Reports', 'Clinical', 'Supervisory', 'Operational', 'Financial'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            style={{ 
              padding: '12px 0', 
              backgroundColor: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab ? '2px solid var(--primary-color, #4338CA)' : '2px solid transparent', 
              color: activeTab === tab ? 'var(--primary-color, #4338CA)' : 'var(--text-secondary)', 
              fontSize: '14px', 
              fontWeight: activeTab === tab ? 600 : 500, 
              cursor: 'pointer', 
              marginBottom: '-1px' 
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', display: 'flex', gap: '16px', alignItems: 'center', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search reports by name or ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }} 
          />
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', padding: '10px 16px', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <CalendarIcon size={16} /> {dateFilter}
          </button>
          {showDatePicker && (
            <div style={{ position: 'absolute', top: '110%', right: 0, backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '8px', padding: '8px', zIndex: 100, minWidth: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {dateOptions.map(opt => (
                <button 
                  key={opt} 
                  onClick={() => { setDateFilter(opt); setShowDatePicker(false); }} 
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', backgroundColor: dateFilter === opt ? 'var(--primary-color, #4338CA)' : 'transparent', color: dateFilter === opt ? 'white' : 'var(--text-primary)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reports Table */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <FileBarChart size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p>No reports found matching your criteria.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Report Name & ID</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Date Generated</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Generated By</th>
                <th style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((report, idx) => (
                <tr 
                  key={report.id} 
                  style={{ borderBottom: idx !== filtered.length - 1 ? '1px solid var(--border-primary)' : 'none', transition: 'background-color 0.15s' }}
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${getTypeColor(report.type)}20`, color: getTypeColor(report.type), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <div 
                          onClick={() => setSelectedReport(report)}
                          style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline decoration-transparent', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--primary-color, #4338CA)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                        >
                          {report.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{report.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: `${getTypeColor(report.type)}15`, border: `1px solid ${getTypeColor(report.type)}40`, borderRadius: '20px', fontSize: '12px', color: getTypeColor(report.type) }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getTypeColor(report.type) }}></span>
                      {report.type}
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>{report.date}</td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>{report.author}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => setSelectedReport(report)} 
                        title="View Report"
                        style={{ padding: '6px 12px', backgroundColor: 'var(--primary-color, #4338CA)', border: 'none', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Eye size={14} /> View
                      </button>
                      <button 
                        onClick={() => handleDownloadCSV(report)} 
                        title="Download CSV file to Downloads folder"
                        style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Download size={14} /> CSV
                      </button>
                      <button 
                        onClick={() => handleDownloadPDF(report)} 
                        title="Download in Chrome (PDF)"
                        style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <Download size={14} /> Chrome PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── GENERATE REPORT MODAL ─── */}
      {showGenerateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--bg-primary, #fff)', borderRadius: '16px', border: '1px solid var(--border-primary)', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', backgroundColor: 'rgba(67, 56, 202, 0.1)', color: '#4338CA', borderRadius: '8px' }}>
                  <FileText size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Generate New Report</h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Report Category
                </label>
                <select 
                  className="form-select"
                  value={genForm.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const defaultTemplates = {
                      Financial: 'Financial Summary',
                      Clinical: isPsychologist ? 'Psychological Assessment Battery Summary' : 'Clinical Outcomes & Symptom Delta',
                      Supervisory: isPsychologist ? 'Clinical Supervision & Assessment Sign-Off Review' : 'Supervisory Co-Signature & Caseload Audits',
                      Operational: isPsychologist ? 'Caseload Density & Testing Turnaround Compliance' : 'Appointment & Capacity Utilization'
                    };
                    setGenForm({
                      ...genForm,
                      category: cat,
                      template: defaultTemplates[cat] || 'General Audit'
                    });
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="Clinical">{isPsychologist ? 'Psychological Assessment & Clinical Batteries' : 'Clinical Quality & Outcomes (PHQ-9/GAD-7)'}</option>
                  <option value="Supervisory">{isPsychologist ? 'Supervisory Sign-Off & Case Review' : 'Supervisory Co-Signature & Caseload Audits'}</option>
                  <option value="Operational">{isPsychologist ? 'Testing Turnaround & Caseload Density' : 'Operational & Staff Scheduling'}</option>
                  {!isPsychologist && <option value="Financial">Financial & Revenue Analytics</option>}
                  {isPsychologist && <option value="Financial">Financial & Diagnostic Billing</option>}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Report Title
                </label>
                <input 
                  type="text"
                  placeholder={genForm.template}
                  value={genForm.customTitle}
                  onChange={(e) => setGenForm({ ...genForm, customTitle: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Date Period
                </label>
                <select 
                  className="form-select"
                  value={genForm.dateRange}
                  onChange={(e) => setGenForm({ ...genForm, dateRange: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-primary)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="Last 30 Days">Last 30 Days</option>
                  <option value="Last 90 Days">Last 90 Days</option>
                  <option value="This Year">Year to Date (YTD)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <CheckCircle size={18} color="#10B981" />
                <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 500 }}>
                  Report will be saved to your dashboard and immediately viewable.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowGenerateModal(false)}
                  style={{ padding: '10px 18px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="mc-btn mc-btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px', fontWeight: 700 }}
                >
                  Create & View Report
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── INTERACTIVE REPORT VIEWER MODAL ─── */}
      {selectedReport && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(6px)', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--bg-primary, #fff)', borderRadius: '18px', border: '1px solid var(--border-primary)', width: '100%', maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-primary)', paddingBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: `${getTypeColor(selectedReport.type)}20`, color: getTypeColor(selectedReport.type), fontSize: '11px', fontWeight: 700 }}>
                    {selectedReport.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{selectedReport.id}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedReport.name}</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Generated on <strong>{selectedReport.date}</strong> by <strong>{selectedReport.author}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Description */}
            {selectedReport.description && (
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-primary)', fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {selectedReport.description}
              </div>
            )}

            {/* KPI Cards Grid */}
            {selectedReport.kpis && selectedReport.kpis.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                {selectedReport.kpis.map((kpi, i) => (
                  <div key={i} style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-primary)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{kpi.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{kpi.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Data Breakdown Table */}
            {selectedReport.tableHeaders && selectedReport.tableRows && (
              <div style={{ borderRadius: '12px', border: '1px solid var(--border-primary)', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                  Detailed Breakdown Records
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                      {selectedReport.tableHeaders.map((head, hi) => (
                        <th key={hi} style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '12px' }}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.tableRows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: ri !== selectedReport.tableRows.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                        {row.map((cell, ci) => (
                          <td key={ci} style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>
                            {ci === row.length - 1 ? (
                              <span style={{ 
                                padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                                backgroundColor: cell === 'PAID' || cell === 'IMPROVED' || cell === 'REMISSION' || cell === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: cell === 'PAID' || cell === 'IMPROVED' || cell === 'REMISSION' || cell === 'ACTIVE' ? '#10B981' : '#F59E0B'
                              }}>
                                {cell}
                              </span>
                            ) : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-primary)', paddingTop: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '12px', fontWeight: 600 }}>
                <ShieldCheck size={16} /> Verified HIPAA Compliant Report
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleDownloadCSV(selectedReport)}
                  style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid var(--border-primary)', borderRadius: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download CSV
                </button>
                <button 
                  onClick={() => handleDownloadPDF(selectedReport)}
                  style={{ padding: '8px 16px', backgroundColor: 'var(--primary-color, #4338CA)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download in Chrome (PDF)
                </button>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="mc-btn mc-btn-primary"
                  style={{ padding: '8px 18px', fontSize: '12px', fontWeight: 600 }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReportsPage;
