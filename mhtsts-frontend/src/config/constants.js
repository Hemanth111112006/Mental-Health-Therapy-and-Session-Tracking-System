/**
 * MindCare Mental Health Therapy & Session Tracking System
 * Application Constants
 */

// ─── Role Identifiers ───────────────────────────────────────────────────────
export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  PSYCHIATRIST: 'PSYCHIATRIST',
  PSYCHOLOGIST: 'PSYCHOLOGIST',
  THERAPIST: 'THERAPIST',
  SUPERVISOR: 'SUPERVISOR',
  CASE_MANAGER: 'CASE_MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  CLIENT: 'CLIENT',
});

// ─── Status Enumerations ────────────────────────────────────────────────────
export const CLIENT_STATUS = Object.freeze({
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DISCHARGED: 'Discharged',
  WAITLIST: 'Waitlist',
  PENDING_INTAKE: 'PendingIntake',
  ON_HOLD: 'OnHold',
  DECEASED: 'Deceased',
});

export const APPOINTMENT_STATUS = Object.freeze({
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'CheckedIn',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'NoShow',
  RESCHEDULED: 'Rescheduled',
  LATE_CANCELLED: 'LateCancelled',
});

export const BILLING_STATUS = Object.freeze({
  DRAFT: 'Draft',
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  PAID: 'Paid',
  PARTIALLY_PAID: 'PartiallyPaid',
  DENIED: 'Denied',
  APPEALED: 'Appealed',
  VOID: 'Void',
  WRITE_OFF: 'WriteOff',
});

export const CRISIS_LEVELS = Object.freeze({
  NONE: 'None',
  LOW: 'Low',
  MODERATE: 'Moderate',
  HIGH: 'High',
  CRITICAL: 'Critical',
  IMMINENT: 'Imminent',
});

// ─── Permissions Matrix (per SRS Appendix A) ────────────────────────────────
export const PERMISSIONS = Object.freeze({
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_ADMIN_DASHBOARD: 'view_admin_dashboard',
  VIEW_CLINICAL_DASHBOARD: 'view_clinical_dashboard',
  VIEW_CLIENT_DASHBOARD: 'view_client_dashboard',

  // Client Management
  VIEW_CLIENTS: 'view_clients',
  CREATE_CLIENT: 'create_client',
  EDIT_CLIENT: 'edit_client',
  DELETE_CLIENT: 'delete_client',
  VIEW_CLIENT_PHI: 'view_client_phi',
  EXPORT_CLIENT_DATA: 'export_client_data',

  // Appointments
  VIEW_APPOINTMENTS: 'view_appointments',
  CREATE_APPOINTMENT: 'create_appointment',
  EDIT_APPOINTMENT: 'edit_appointment',
  CANCEL_APPOINTMENT: 'cancel_appointment',
  VIEW_ALL_APPOINTMENTS: 'view_all_appointments',

  // Session Notes
  VIEW_SESSION_NOTES: 'view_session_notes',
  CREATE_SESSION_NOTE: 'create_session_note',
  EDIT_SESSION_NOTE: 'edit_session_note',
  DELETE_SESSION_NOTE: 'delete_session_note',
  SIGN_SESSION_NOTE: 'sign_session_note',
  COSIGN_SESSION_NOTE: 'cosign_session_note',
  VIEW_ALL_NOTES: 'view_all_notes',

  // Treatment Plans
  VIEW_TREATMENT_PLANS: 'view_treatment_plans',
  CREATE_TREATMENT_PLAN: 'create_treatment_plan',
  EDIT_TREATMENT_PLAN: 'edit_treatment_plan',
  APPROVE_TREATMENT_PLAN: 'approve_treatment_plan',

  // Assessments & Outcome Measures
  VIEW_ASSESSMENTS: 'view_assessments',
  ADMINISTER_ASSESSMENT: 'administer_assessment',
  COMPLETE_ASSESSMENT: 'complete_assessment',
  VIEW_ASSESSMENT_RESULTS: 'view_assessment_results',

  // Billing
  VIEW_BILLING: 'view_billing',
  CREATE_CLAIM: 'create_claim',
  SUBMIT_CLAIM: 'submit_claim',
  EDIT_CLAIM: 'edit_claim',
  VIEW_ALL_BILLING: 'view_all_billing',
  PROCESS_PAYMENT: 'process_payment',

  // Crisis Management
  VIEW_CRISIS_ALERTS: 'view_crisis_alerts',
  CREATE_CRISIS_ALERT: 'create_crisis_alert',
  RESOLVE_CRISIS_ALERT: 'resolve_crisis_alert',
  ESCALATE_CRISIS: 'escalate_crisis',

  // Reports & Analytics
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  EXPORT_REPORTS: 'export_reports',
  VIEW_ANALYTICS: 'view_analytics',

  // Administration
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOG: 'view_audit_log',
  MANAGE_TEMPLATES: 'manage_templates',
  MANAGE_INTEGRATIONS: 'manage_integrations',

  // Messaging
  SEND_MESSAGE: 'send_message',
  VIEW_MESSAGES: 'view_messages',

  // Supervision
  VIEW_SUPERVISEES: 'view_supervisees',
  REVIEW_NOTES: 'review_notes',
  APPROVE_NOTES: 'approve_notes',
});

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.DELETE_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.EXPORT_CLIENT_DATA,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_ALL_APPOINTMENTS,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.VIEW_ALL_NOTES,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.VIEW_ALL_BILLING,
    PERMISSIONS.CREATE_CLAIM,
    PERMISSIONS.SUBMIT_CLAIM,
    PERMISSIONS.EDIT_CLAIM,
    PERMISSIONS.PROCESS_PAYMENT,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.RESOLVE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOG,
    PERMISSIONS.MANAGE_TEMPLATES,
    PERMISSIONS.MANAGE_INTEGRATIONS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.PSYCHIATRIST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLINICAL_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.CREATE_SESSION_NOTE,
    PERMISSIONS.EDIT_SESSION_NOTE,
    PERMISSIONS.SIGN_SESSION_NOTE,
    PERMISSIONS.COSIGN_SESSION_NOTE,
    PERMISSIONS.VIEW_ALL_NOTES,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.CREATE_TREATMENT_PLAN,
    PERMISSIONS.EDIT_TREATMENT_PLAN,
    PERMISSIONS.APPROVE_TREATMENT_PLAN,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.ADMINISTER_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.CREATE_CLAIM,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.CREATE_CRISIS_ALERT,
    PERMISSIONS.RESOLVE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.VIEW_SUPERVISEES,
    PERMISSIONS.REVIEW_NOTES,
    PERMISSIONS.APPROVE_NOTES,
  ],

  [ROLES.PSYCHOLOGIST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLINICAL_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.CREATE_SESSION_NOTE,
    PERMISSIONS.EDIT_SESSION_NOTE,
    PERMISSIONS.SIGN_SESSION_NOTE,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.CREATE_TREATMENT_PLAN,
    PERMISSIONS.EDIT_TREATMENT_PLAN,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.ADMINISTER_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.CREATE_CLAIM,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.CREATE_CRISIS_ALERT,
    PERMISSIONS.RESOLVE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.THERAPIST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLINICAL_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.CREATE_SESSION_NOTE,
    PERMISSIONS.EDIT_SESSION_NOTE,
    PERMISSIONS.SIGN_SESSION_NOTE,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.CREATE_TREATMENT_PLAN,
    PERMISSIONS.EDIT_TREATMENT_PLAN,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.ADMINISTER_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.CREATE_CLAIM,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.CREATE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLINICAL_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.CREATE_SESSION_NOTE,
    PERMISSIONS.EDIT_SESSION_NOTE,
    PERMISSIONS.SIGN_SESSION_NOTE,
    PERMISSIONS.COSIGN_SESSION_NOTE,
    PERMISSIONS.VIEW_ALL_NOTES,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.CREATE_TREATMENT_PLAN,
    PERMISSIONS.EDIT_TREATMENT_PLAN,
    PERMISSIONS.APPROVE_TREATMENT_PLAN,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.ADMINISTER_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.CREATE_CLAIM,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.CREATE_CRISIS_ALERT,
    PERMISSIONS.RESOLVE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
    PERMISSIONS.VIEW_SUPERVISEES,
    PERMISSIONS.REVIEW_NOTES,
    PERMISSIONS.APPROVE_NOTES,
  ],

  [ROLES.CASE_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLINICAL_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_CLIENT_PHI,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.VIEW_SESSION_NOTES,
    PERMISSIONS.CREATE_SESSION_NOTE,
    PERMISSIONS.EDIT_SESSION_NOTE,
    PERMISSIONS.VIEW_TREATMENT_PLANS,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_CRISIS_ALERTS,
    PERMISSIONS.CREATE_CRISIS_ALERT,
    PERMISSIONS.ESCALATE_CRISIS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.EDIT_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_ALL_APPOINTMENTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.PROCESS_PAYMENT,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],

  [ROLES.CLIENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CLIENT_DASHBOARD,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.VIEW_ASSESSMENTS,
    PERMISSIONS.COMPLETE_ASSESSMENT,
    PERMISSIONS.VIEW_ASSESSMENT_RESULTS,
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.SEND_MESSAGE,
    PERMISSIONS.VIEW_MESSAGES,
  ],
});

// ─── Session Note Formats ───────────────────────────────────────────────────
export const SESSION_NOTE_FORMATS = Object.freeze({
  SOAP: {
    key: 'SOAP',
    label: 'SOAP Note',
    description: 'Subjective, Objective, Assessment, Plan',
    sections: [
      {
        key: 'subjective',
        label: 'Subjective',
        description: 'Client\'s self-reported symptoms, feelings, and concerns in their own words.',
        placeholder: 'Document the client\'s reported symptoms, mood, concerns, and relevant statements...',
      },
      {
        key: 'objective',
        label: 'Objective',
        description: 'Observable, measurable clinical findings and behaviors.',
        placeholder: 'Document observed behaviors, affect, appearance, test results, and clinical observations...',
      },
      {
        key: 'assessment',
        label: 'Assessment',
        description: 'Clinical interpretation, diagnosis updates, and risk evaluation.',
        placeholder: 'Document clinical impressions, diagnostic considerations, progress toward goals, and risk assessment...',
      },
      {
        key: 'plan',
        label: 'Plan',
        description: 'Treatment actions, interventions, and follow-up steps.',
        placeholder: 'Document treatment plan updates, interventions, referrals, homework assignments, and next session plans...',
      },
    ],
  },
  DAP: {
    key: 'DAP',
    label: 'DAP Note',
    description: 'Data, Assessment, Plan',
    sections: [
      {
        key: 'data',
        label: 'Data',
        description: 'Subjective and objective information gathered during the session.',
        placeholder: 'Document what was discussed, observed behaviors, client statements, and relevant data...',
      },
      {
        key: 'assessment',
        label: 'Assessment',
        description: 'Therapist\'s clinical evaluation and interpretation of the data.',
        placeholder: 'Document clinical impressions, progress evaluation, therapeutic themes, and diagnostic considerations...',
      },
      {
        key: 'plan',
        label: 'Plan',
        description: 'Planned interventions, goals, and next steps.',
        placeholder: 'Document planned interventions, homework, referrals, and scheduling for next session...',
      },
    ],
  },
  BIRP: {
    key: 'BIRP',
    label: 'BIRP Note',
    description: 'Behavior, Intervention, Response, Plan',
    sections: [
      {
        key: 'behavior',
        label: 'Behavior',
        description: 'Client\'s presenting behaviors, symptoms, and reported concerns.',
        placeholder: 'Document the client\'s presenting behaviors, symptoms, affect, and reported issues...',
      },
      {
        key: 'intervention',
        label: 'Intervention',
        description: 'Therapeutic techniques and interventions used during the session.',
        placeholder: 'Document therapeutic techniques used (e.g., CBT, MI, psychoeducation), specific interventions...',
      },
      {
        key: 'response',
        label: 'Response',
        description: 'Client\'s response to the interventions and therapeutic engagement.',
        placeholder: 'Document how the client responded to interventions, level of engagement, insights gained...',
      },
      {
        key: 'plan',
        label: 'Plan',
        description: 'Follow-up plans, assignments, and next session goals.',
        placeholder: 'Document follow-up plans, homework assignments, goals for next session, and referrals...',
      },
    ],
  },
});

// ─── Outcome Measures ───────────────────────────────────────────────────────
export const OUTCOME_MEASURES = Object.freeze({
  PHQ9: {
    key: 'PHQ9',
    label: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    description: 'Screens for the presence and severity of depression.',
    maxScore: 27,
    scoreRanges: [
      { min: 0, max: 4, severity: 'Minimal', color: '#4caf50', recommendation: 'Monitor; may not require treatment' },
      { min: 5, max: 9, severity: 'Mild', color: '#8bc34a', recommendation: 'Watchful waiting; repeat at follow-up' },
      { min: 10, max: 14, severity: 'Moderate', color: '#ff9800', recommendation: 'Treatment plan; counseling or pharmacotherapy' },
      { min: 15, max: 19, severity: 'Moderately Severe', color: '#f44336', recommendation: 'Active treatment with pharmacotherapy and/or psychotherapy' },
      { min: 20, max: 27, severity: 'Severe', color: '#b71c1c', recommendation: 'Immediate initiation of pharmacotherapy; if severe impairment or poor response, refer to mental health specialist' },
    ],
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading the newspaper or watching television',
      'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
      'Thoughts that you would be better off dead or of hurting yourself in some way',
    ],
    responseOptions: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },

  GAD7: {
    key: 'GAD7',
    label: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder 7-Item Scale',
    description: 'Screens for generalized anxiety disorder and assesses severity.',
    maxScore: 21,
    scoreRanges: [
      { min: 0, max: 4, severity: 'Minimal', color: '#4caf50', recommendation: 'Monitor symptoms' },
      { min: 5, max: 9, severity: 'Mild', color: '#8bc34a', recommendation: 'Watchful waiting; repeat at follow-up' },
      { min: 10, max: 14, severity: 'Moderate', color: '#ff9800', recommendation: 'Consider counseling or pharmacotherapy' },
      { min: 15, max: 21, severity: 'Severe', color: '#f44336', recommendation: 'Active treatment recommended; consider both pharmacotherapy and psychotherapy' },
    ],
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it\'s hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen',
    ],
    responseOptions: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
  },

  AUDIT: {
    key: 'AUDIT',
    label: 'AUDIT',
    fullName: 'Alcohol Use Disorders Identification Test',
    description: 'Identifies persons with hazardous and harmful patterns of alcohol consumption.',
    maxScore: 40,
    scoreRanges: [
      { min: 0, max: 7, severity: 'Low Risk', color: '#4caf50', recommendation: 'Alcohol education' },
      { min: 8, max: 15, severity: 'Hazardous', color: '#ff9800', recommendation: 'Simple advice' },
      { min: 16, max: 19, severity: 'Harmful', color: '#f44336', recommendation: 'Brief counseling and continued monitoring' },
      { min: 20, max: 40, severity: 'Possible Dependence', color: '#b71c1c', recommendation: 'Referral to specialist for diagnostic evaluation and treatment' },
    ],
    questions: [
      'How often do you have a drink containing alcohol?',
      'How many drinks containing alcohol do you have on a typical day when you are drinking?',
      'How often do you have six or more drinks on one occasion?',
      'How often during the last year have you found that you were not able to stop drinking once you had started?',
      'How often during the last year have you failed to do what was normally expected of you because of drinking?',
      'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
      'How often during the last year have you had a feeling of guilt or remorse after drinking?',
      'How often during the last year have you been unable to remember what happened the night before because of your drinking?',
      'Have you or someone else been injured because of your drinking?',
      'Has a relative, friend, doctor, or other health care worker been concerned about your drinking or suggested you cut down?',
    ],
    responseOptions: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Monthly or less' },
      { value: 2, label: '2–4 times a month' },
      { value: 3, label: '2–3 times a week' },
      { value: 4, label: '4 or more times a week' },
    ],
  },

  PCL5: {
    key: 'PCL5',
    label: 'PCL-5',
    fullName: 'PTSD Checklist for DSM-5',
    description: 'Assesses the 20 DSM-5 symptoms of PTSD.',
    maxScore: 80,
    scoreRanges: [
      { min: 0, max: 10, severity: 'Minimal', color: '#4caf50', recommendation: 'No clinical intervention needed' },
      { min: 11, max: 32, severity: 'Below Threshold', color: '#8bc34a', recommendation: 'Monitor and reassess' },
      { min: 33, max: 52, severity: 'Probable PTSD', color: '#ff9800', recommendation: 'Trauma-focused therapy recommended' },
      { min: 53, max: 80, severity: 'Severe PTSD', color: '#f44336', recommendation: 'Intensive treatment; consider combined therapy and pharmacotherapy' },
    ],
    questions: [
      'Repeated, disturbing, and unwanted memories of the stressful experience',
      'Repeated, disturbing dreams of the stressful experience',
      'Suddenly feeling or acting as if the stressful experience were actually happening again',
      'Feeling very upset when something reminded you of the stressful experience',
      'Having strong physical reactions when something reminded you of the stressful experience',
      'Avoiding memories, thoughts, or feelings related to the stressful experience',
      'Avoiding external reminders of the stressful experience',
      'Trouble remembering important parts of the stressful experience',
      'Having strong negative beliefs about yourself, other people, or the world',
      'Blaming yourself or someone else for the stressful experience or what happened after it',
      'Having strong negative feelings such as fear, horror, anger, guilt, or shame',
      'Loss of interest in activities that you used to enjoy',
      'Feeling distant or cut off from other people',
      'Trouble experiencing positive feelings',
      'Irritable behavior, angry outbursts, or acting aggressively',
      'Taking too many risks or doing things that could cause you harm',
      'Being "superalert" or watchful or on guard',
      'Feeling jumpy or easily startled',
      'Having difficulty concentrating',
      'Trouble falling or staying asleep',
    ],
    responseOptions: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'A little bit' },
      { value: 2, label: 'Moderately' },
      { value: 3, label: 'Quite a bit' },
      { value: 4, label: 'Extremely' },
    ],
  },
});

// ─── CPT Codes for Mental Health Billing ────────────────────────────────────
export const CPT_CODES = Object.freeze({
  // Diagnostic Evaluation
  '90791': { code: '90791', description: 'Psychiatric Diagnostic Evaluation', category: 'Evaluation', duration: 60, rate: 250.00 },
  '90792': { code: '90792', description: 'Psychiatric Diagnostic Evaluation with Medical Services', category: 'Evaluation', duration: 60, rate: 300.00 },

  // Psychotherapy
  '90832': { code: '90832', description: 'Psychotherapy, 16–37 minutes', category: 'Psychotherapy', duration: 30, rate: 85.00 },
  '90834': { code: '90834', description: 'Psychotherapy, 38–52 minutes', category: 'Psychotherapy', duration: 45, rate: 130.00 },
  '90837': { code: '90837', description: 'Psychotherapy, 53+ minutes', category: 'Psychotherapy', duration: 60, rate: 175.00 },

  // Psychotherapy with E/M
  '90833': { code: '90833', description: 'Psychotherapy add-on, 16–37 min (with E/M)', category: 'Psychotherapy Add-on', duration: 30, rate: 75.00 },
  '90836': { code: '90836', description: 'Psychotherapy add-on, 38–52 min (with E/M)', category: 'Psychotherapy Add-on', duration: 45, rate: 115.00 },
  '90838': { code: '90838', description: 'Psychotherapy add-on, 53+ min (with E/M)', category: 'Psychotherapy Add-on', duration: 60, rate: 150.00 },

  // Family / Group
  '90846': { code: '90846', description: 'Family Psychotherapy without Patient Present', category: 'Family Therapy', duration: 50, rate: 155.00 },
  '90847': { code: '90847', description: 'Family Psychotherapy with Patient Present', category: 'Family Therapy', duration: 50, rate: 160.00 },
  '90853': { code: '90853', description: 'Group Psychotherapy', category: 'Group Therapy', duration: 60, rate: 55.00 },

  // Crisis
  '90839': { code: '90839', description: 'Psychotherapy for Crisis, first 60 minutes', category: 'Crisis', duration: 60, rate: 200.00 },
  '90840': { code: '90840', description: 'Psychotherapy for Crisis, each additional 30 min', category: 'Crisis', duration: 30, rate: 100.00 },

  // Psychological Testing
  '96130': { code: '96130', description: 'Psychological Testing Evaluation by Physician/QHP, first hour', category: 'Testing', duration: 60, rate: 185.00 },
  '96131': { code: '96131', description: 'Psychological Testing Evaluation by Physician/QHP, each additional hour', category: 'Testing', duration: 60, rate: 170.00 },
  '96136': { code: '96136', description: 'Psychological Test Administration by Physician/QHP, first 30 min', category: 'Testing', duration: 30, rate: 95.00 },
  '96137': { code: '96137', description: 'Psychological Test Administration by Physician/QHP, each additional 30 min', category: 'Testing', duration: 30, rate: 80.00 },

  // E/M Codes (Medication Management)
  '99213': { code: '99213', description: 'Office Visit, Established Patient (Low Complexity)', category: 'E/M', duration: 15, rate: 110.00 },
  '99214': { code: '99214', description: 'Office Visit, Established Patient (Moderate Complexity)', category: 'E/M', duration: 25, rate: 165.00 },
  '99215': { code: '99215', description: 'Office Visit, Established Patient (High Complexity)', category: 'E/M', duration: 40, rate: 225.00 },

  // Telehealth Modifier
  '95': { code: '95', description: 'Synchronous Telehealth Service (Modifier)', category: 'Modifier', duration: 0, rate: 0 },
});

// ─── API Endpoints ──────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = Object.freeze({
  // Auth
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,
  AUTH_REFRESH: `${API_BASE_URL}/auth/refresh`,
  AUTH_FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  AUTH_RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,

  // Users
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,

  // Clients
  CLIENTS: `${API_BASE_URL}/clients`,
  CLIENT_SEARCH: `${API_BASE_URL}/clients/search`,

  // Appointments
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  APPOINTMENT_AVAILABILITY: `${API_BASE_URL}/appointments/availability`,

  // Session Notes
  SESSION_NOTES: `${API_BASE_URL}/session-notes`,

  // Treatment Plans
  TREATMENT_PLANS: `${API_BASE_URL}/treatment-plans`,

  // Assessments
  ASSESSMENTS: `${API_BASE_URL}/assessments`,
  ASSESSMENT_RESULTS: `${API_BASE_URL}/assessments/results`,

  // Billing
  BILLING_CLAIMS: `${API_BASE_URL}/billing/claims`,
  BILLING_PAYMENTS: `${API_BASE_URL}/billing/payments`,
  BILLING_INVOICES: `${API_BASE_URL}/billing/invoices`,

  // Crisis
  CRISIS_ALERTS: `${API_BASE_URL}/crisis-alerts`,

  // Reports
  REPORTS: `${API_BASE_URL}/reports`,
  ANALYTICS: `${API_BASE_URL}/analytics`,

  // Messaging
  MESSAGES: `${API_BASE_URL}/messages`,

  // Audit
  AUDIT_LOG: `${API_BASE_URL}/audit-log`,

  // Settings
  SETTINGS: `${API_BASE_URL}/settings`,
});

// ─── Date Formats ───────────────────────────────────────────────────────────
export const DATE_FORMATS = Object.freeze({
  DISPLAY: 'MMM dd, yyyy',            // Jul 11, 2026
  DISPLAY_SHORT: 'MM/dd/yyyy',        // 07/11/2026
  DISPLAY_LONG: 'MMMM dd, yyyy',      // July 11, 2026
  DISPLAY_WITH_TIME: 'MMM dd, yyyy h:mm a', // Jul 11, 2026 2:30 PM
  ISO: 'yyyy-MM-dd',                  // 2026-07-11
  TIME_12H: 'h:mm a',                 // 2:30 PM
  TIME_24H: 'HH:mm',                  // 14:30
  DAY_MONTH: 'MMM dd',               // Jul 11
  MONTH_YEAR: 'MMMM yyyy',           // July 2026
  FULL_DATETIME: 'EEEE, MMMM dd, yyyy h:mm a', // Friday, July 11, 2026 2:30 PM
});

// ─── Session Timeouts (milliseconds) ────────────────────────────────────────
export const SESSION_TIMEOUT = Object.freeze({
  CLINICAL: 15 * 60 * 1000,  // 15 minutes for clinical roles (PHI access)
  CLIENT: 30 * 60 * 1000,    // 30 minutes for client role
  WARNING: 2 * 60 * 1000,    // 2-minute warning before logout
});

// ─── Application Metadata ───────────────────────────────────────────────────
export const APP_CONFIG = Object.freeze({
  APP_NAME: 'MindCare',
  APP_FULL_NAME: 'MindCare Mental Health Therapy & Session Tracking System',
  VERSION: '1.0.0',
  MAX_FILE_UPLOAD_SIZE: 10 * 1024 * 1024, // 10 MB
  PAGINATION_DEFAULT: 20,
  TOAST_AUTO_DISMISS: 5000,
  MAX_TOASTS: 5,
});
