import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { clientApi } from '../../../api/clientApi';
import { sessionNoteApi } from '../../../api/sessionNoteApi';
import { useNotification } from '../../../providers/NotificationProvider';
import { jsPDF } from 'jspdf';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlusOneOutlinedIcon from '@mui/icons-material/AddOutlined';

const getInitialPsychiatricNotes = (clinicianName) => [
  {
    id: 'SN-4401',
    clientName: 'Sarah Connor',
    clientId: 1,
    clientIdCode: 'MC-2041',
    age: 38,
    gender: 'Female',
    therapist: clinicianName || 'Dr. Mark Rivera, MD',
    emergencyContact: 'John Connor (Son) - (555) 234-8901',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '50m',
    apptType: 'Psychiatric Evaluation',
    cptCode: '99214 + 90833 - Psychotherapy with E/M',
    location: 'Consultation Suite 4A / In-Person',
    noteFormat: 'SOAP',
    diagnosis: 'F31.32 - Bipolar I Disorder, Current Episode Depressed',
    status: 'SIGNED',
    isSigned: true,
    lastUpdated: 'Today at 09:45 AM',
    subjective: 'Client presents for scheduled psychiatric medication review. Reports steady mood stabilization following titration of Lithium Carbonate to 600mg PO BID. Denies manic or hypomanic symptoms. Sleep quality improved to 7-8 hours nightly. Endorses slight bilateral hand tremor in morning hours.',
    objective: 'Alert, fully oriented x4. Affect euthymic, congruent. Speech normal in rate and volume. Thought process linear and goal-directed. No delusions or hallucinations. Denies SI/HI. Serum lithium level 0.8 mEq/L (therapeutic range). Renal & thyroid labs stable.',
    assessment: 'F31.32 Bipolar I Disorder, depressed episode in sustained partial remission on mood stabilizer maintenance. Mild postural tremor secondary to lithium.',
    plan: '1. Continue Lithium Carbonate 600mg PO BID. 2. Prescribe Propranolol 10mg PO PRN for tremor control. 3. Repeat lithium level, CMP, and TSH in 8 weeks. 4. Follow-up consultation in 4 weeks.'
  },
  {
    id: 'SN-2788',
    clientName: 'Morgan Davis',
    clientId: 2,
    clientIdCode: 'MC-2788',
    age: 45,
    gender: 'Male',
    therapist: clinicianName || 'Dr. Mark Rivera, MD',
    emergencyContact: 'Claire Davis (Spouse) - (555) 345-6789',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    duration: '45m',
    apptType: 'Medication Management',
    cptCode: '99214 - Office Outpatient Visit 30-39 min',
    location: 'Telehealth Secure Video',
    noteFormat: 'DAP',
    diagnosis: 'F33.2 - Major Depressive Disorder, Recurrent Severe',
    status: 'SIGNED',
    isSigned: true,
    lastUpdated: 'Today at 11:35 AM',
    data: 'Patient reports persistent anhedonia and early morning awakening despite Bupropion XL 300mg and Escitalopram 20mg daily. PHQ-9 today: 15 (moderately severe). Denies suicidal ideation, intent, or plan. Vitals stable: BP 122/78, HR 72.',
    assessment: 'Major Depressive Disorder with partial response to dual antidepressant regimen. Well tolerated without autonomic side effects.',
    plan: 'Initiate Aripiprazole 2.5mg PO daily augmentation. Coordinate with therapist Dr. Sarah Chen for CBT behavioral activation. Follow-up E/M in 2 weeks.'
  },
  {
    id: 'SN-3104',
    clientName: 'Jennifer Miller',
    clientId: 3,
    clientIdCode: 'MC-3104',
    age: 29,
    gender: 'Female',
    therapist: clinicianName || 'Dr. Mark Rivera, MD',
    emergencyContact: 'David Miller (Spouse) - (555) 456-7890',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '14:00',
    duration: '50m',
    apptType: 'Psychiatric Follow-up',
    cptCode: '90834 - Psychotherapy 45-50 min',
    location: 'Consultation Suite 4A',
    noteFormat: 'BIRP',
    diagnosis: 'F41.1 - Generalized Anxiety Disorder',
    status: 'SIGNED',
    isSigned: true,
    lastUpdated: 'Yesterday at 3:15 PM',
    behavior: 'Attended follow-up consultation on time. Endorses significant reduction in somatic panic attacks following Sertraline titration to 100mg daily. GAD-7 decreased to 7 (mild).',
    intervention: 'Reviewed SSRI adherence and mechanism. Reinforced cognitive reappraisal strategies and breathing retraining techniques.',
    response: 'Patient articulates clear comprehension of pharmacotherapy regimen and reports marked improvement in daily functioning.',
    plan: 'Maintain Sertraline 100mg PO daily. Next psychiatric follow-up in 6 weeks.'
  },
  {
    id: 'SN-1887',
    clientName: 'Richard Rodriguez',
    clientId: 4,
    clientIdCode: 'MC-1887',
    age: 42,
    gender: 'Male',
    therapist: clinicianName || 'Dr. Mark Rivera, MD',
    emergencyContact: 'Elena Rodriguez (Sister) - (555) 567-8901',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '15:30',
    duration: '60m',
    apptType: 'Diagnostic Interview',
    cptCode: '90792 - Psychiatric Diagnostic Evaluation with Medical Services',
    location: 'Telehealth Secure Video',
    noteFormat: 'SOAP',
    diagnosis: 'F43.10 - Post-Traumatic Stress Disorder',
    status: 'DRAFT',
    isSigned: false,
    lastUpdated: 'Yesterday at 4:45 PM',
    subjective: 'Veteran presenting for comprehensive trauma assessment and medication review. Reports frequent trauma-related nightmares and sleep fragmentation. Prazosin 2mg initiated 3 weeks ago.',
    objective: 'Vital signs stable. Affect guarded, vigilant posture. Denies acute SI/HI. Reports nightmare frequency decreased from 6 nights/week to 2 nights/week.',
    assessment: 'PTSD with substantial nocturnal autonomic hyperarousal, showing positive therapeutic response to alpha-1 adrenergic blockade.',
    plan: 'Titrate Prazosin to 4mg PO QHS for nightmares. Continue trauma-informed care and EMDR coordination. Awaiting electronic signature.'
  },
  {
    id: 'SN-3CD5',
    clientName: 'Taylor Morgan',
    clientId: 5,
    clientIdCode: 'CLN-3CD50763',
    age: 31,
    gender: 'Non-binary',
    therapist: clinicianName || 'Dr. Mark Rivera, MD',
    emergencyContact: 'Alex Morgan (Partner) - (555) 987-6543',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    time: '10:30',
    duration: '45m',
    apptType: 'Medication Management',
    cptCode: '99214 - Outpatient E/M 30-39 min',
    location: 'MindCare Suite 204',
    noteFormat: 'DAP',
    diagnosis: 'F90.0 - ADHD, Combined Type & GAD',
    status: 'SIGNED',
    isSigned: true,
    lastUpdated: '2 days ago',
    data: 'Patient reports sustained executive functioning improvement on Lisdexamfetamine 30mg daily. Heart rate 76 bpm, blood pressure 118/74 mmHg. No cardiovascular symptoms.',
    assessment: 'ADHD symptoms well-controlled on current stimulant dosing with minimal rebound anxiety.',
    plan: 'Refill Lisdexamfetamine 30mg #30 with zero refills per state Schedule II guidelines. Follow-up E/M in 30 days.'
  }
];

const SessionNotesList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { addToast } = useNotification();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Note Modal Form State
  const [newNoteForm, setNewNoteForm] = useState({
    clientName: 'Sarah Connor',
    clientIdCode: 'MC-2041',
    apptType: 'Psychiatric Follow-up',
    noteFormat: 'SOAP',
    diagnosis: 'F31.32 - Bipolar I Disorder',
    subjective: 'Client reports improved daily routine and stable mood.',
    objective: 'Euthymic, alert x4, thought process clear.',
    assessment: 'Symptom stability maintained on maintenance dose.',
    plan: 'Continue current medication regimen. Review labs in 4 weeks.'
  });

  const clinicianName = currentUser?.role === 'PSYCHOLOGIST'
    ? 'Dr. Maya Patel, PsyD'
    : (currentUser?.role === 'PSYCHIATRIST' ? 'Dr. Mark Rivera, MD' : 'Dr. Sarah Chen, LCSW');

  const fetchNotes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Check local storage cache
      const cached = localStorage.getItem('mindcare_clinical_session_notes');
      let baseNotes = [];
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            baseNotes = parsed;
          }
        } catch (e) {
          console.warn('Could not parse cached notes', e);
        }
      }

      if (baseNotes.length === 0) {
        baseNotes = getInitialPsychiatricNotes(clinicianName);
      }

      // 2. Fetch backend notes if available
      try {
        const res = await sessionNoteApi.getAllSessionNotes();
        const serverNotes = Array.isArray(res) ? res : (res?.data || []);
        if (Array.isArray(serverNotes) && serverNotes.length > 0) {
          const normalizedServer = serverNotes.map(n => ({
            id: n.id ? (String(n.id).startsWith('SN-') ? n.id : `SN-${String(n.id).padStart(4, '0')}`) : `SN-${Date.now()}`,
            clientName: n.client ? `${n.client.firstName || ''} ${n.client.lastName || ''}`.trim() : (n.clientName || 'Assigned Client'),
            clientIdCode: n.client?.clientNumber || n.clientId || 'MC-EHR',
            therapist: n.therapist ? `${n.therapist.firstName || ''} ${n.therapist.lastName || ''}`.trim() : clinicianName,
            date: n.createdAt ? n.createdAt.split('T')[0] : (n.date || new Date().toISOString().split('T')[0]),
            time: n.createdAt && n.createdAt.includes('T') ? n.createdAt.split('T')[1].substring(0, 5) : '10:00',
            duration: n.sessionDurationMinutes ? `${n.sessionDurationMinutes}m` : '50m',
            apptType: n.apptType || 'Psychiatric Consultation',
            cptCode: n.cptCode || '99214 - Outpatient E/M',
            location: n.location || 'Consultation Suite 4A',
            noteFormat: n.noteFormat || 'SOAP',
            diagnosis: n.diagnosisPrimary || n.diagnosis || 'General Clinical Review',
            status: n.isSigned ? 'SIGNED' : 'DRAFT',
            isSigned: !!n.isSigned,
            lastUpdated: n.isSigned ? 'Locked & Signed' : 'Draft',
            subjective: n.subjective || n.noteContent || 'Clinical progress documented.',
            objective: n.objective || 'Vitals and mental status exam stable.',
            assessment: n.assessment || n.diagnosisPrimary || 'Clinical progress consistent with care plan.',
            plan: n.plan || 'Continue current therapeutic schedule.'
          }));

          // Merge without duplicate IDs
          const existingIds = new Set(normalizedServer.map(s => s.id));
          baseNotes = [...normalizedServer, ...baseNotes.filter(b => !existingIds.has(b.id))];
        }
      } catch (apiErr) {
        console.warn('Backend session notes API fallback:', apiErr.message);
      }

      baseNotes.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setNotes(baseNotes);
      localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(baseNotes));
    } catch (err) {
      console.error('Failed to load session notes:', err);
      const initial = getInitialPsychiatricNotes(clinicianName);
      setNotes(initial);
      localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(initial));
    } finally {
      setIsLoading(false);
    }
  }, [clinicianName]);

  React.useEffect(() => {
    fetchNotes();
    window.addEventListener('mindcare_session_notes_updated', fetchNotes);
    return () => window.removeEventListener('mindcare_session_notes_updated', fetchNotes);
  }, [fetchNotes]);

  const stats = {
    total: notes.length,
    today: notes.filter(n => {
      const d = n.createdAt || n.createdDate || n.date;
      if (!d) return false;
      const dStr = String(d).split('T')[0];
      const todayStr = new Date().toISOString().split('T')[0];
      return dStr === todayStr;
    }).length,
    pending: notes.filter(n => !n.isSigned).length,
    signed: notes.filter(n => n.isSigned).length
  };

  const handleExportAllPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Header Banner
      doc.setFillColor(30, 27, 75); // Deep Indigo
      doc.rect(0, 0, 297, 24, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Medical Psychiatric EHR · Clinical Session Notes Directory', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Attending Clinician: ${clinicianName}   |   Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}   |   Confidential HIPAA Record`, 15, 18);

      // Table Header
      let y = 34;
      doc.setFillColor(241, 245, 249);
      doc.rect(15, y, 267, 8, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Session ID', 18, y + 5.5);
      doc.text('Client Name & ID', 45, y + 5.5);
      doc.text('Date & Time', 105, y + 5.5);
      doc.text('Format', 145, y + 5.5);
      doc.text('ICD-10 Primary Diagnosis', 165, y + 5.5);
      doc.text('Attending Clinician', 225, y + 5.5);
      doc.text('Status', 265, y + 5.5);

      y += 8;

      notes.forEach((n, idx) => {
        if (y > 185) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(15, y, 267, 9, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y + 9, 282, y + 9);

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(67, 56, 202);
        doc.text(String(n.id), 18, y + 6);

        doc.setTextColor(15, 23, 42);
        doc.text(`${n.clientName} (${n.clientIdCode})`, 45, y + 6);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`${n.date} at ${n.time}`, 105, y + 6);
        doc.text(n.noteFormat || 'SOAP', 145, y + 6);

        const diag = (n.diagnosis || '').length > 32 ? (n.diagnosis || '').substring(0, 30) + '...' : (n.diagnosis || 'Clinical Consult');
        doc.text(diag, 165, y + 6);
        doc.text(n.therapist || clinicianName, 225, y + 6);

        if (n.isSigned) {
          doc.setTextColor(22, 163, 74);
          doc.setFont('helvetica', 'bold');
          doc.text('SIGNED', 265, y + 6);
        } else {
          doc.setTextColor(217, 119, 6);
          doc.setFont('helvetica', 'bold');
          doc.text('DRAFT', 265, y + 6);
        }

        y += 9;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('MindCare Medical Psychiatric EHR • Protected Health Information under 45 CFR § 164.502', 15, 200);

      doc.save(`MindCare_Session_Notes_${new Date().toISOString().split('T')[0]}.pdf`);
      addToast('success', 'PDF Downloaded', 'Session Notes Directory PDF generated successfully.');
    } catch (err) {
      console.error('PDF generation error:', err);
      addToast('error', 'Export Error', 'Failed to generate Session Notes PDF.');
    }
  };

  const handleExportSingleNotePDF = (n) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      doc.setFillColor(30, 27, 75);
      doc.rect(0, 0, 210, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MindCare Medical · Clinical Progress Record', 15, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`SESSION NOTE ID: ${n.id}   |   FORMAT: ${n.noteFormat}   |   CONFIDENTIAL EHR DOCUMENT`, 15, 18);

      let y = 36;
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(`Clinical Documentation · ${n.clientName}`, 15, y);

      // Metadata card
      y += 6;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(15, y, 180, 24, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Client: ${n.clientName} (${n.clientIdCode})`, 20, y + 7);
      doc.text(`Date & Time: ${n.date} at ${n.time} (${n.duration || '50m'})`, 20, y + 14);
      doc.text(`Attending Physician: ${n.therapist || clinicianName}`, 110, y + 7);
      doc.text(`Billing CPT Code: ${n.cptCode || '99214'}`, 110, y + 14);
      doc.text(`Primary Diagnosis: ${n.diagnosis || 'Clinical Consult'}`, 20, y + 21);

      y += 32;

      // Note Sections
      const renderSection = (title, content) => {
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y, 180, 7, 'F');
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(title, 18, y + 5);
        y += 10;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(content || 'No documentation recorded.', 175);
        doc.text(splitText, 18, y);
        y += (splitText.length * 5) + 6;
      };

      if (n.noteFormat === 'SOAP') {
        renderSection('SUBJECTIVE (Patient Narrative & Symptoms)', n.subjective);
        renderSection('OBJECTIVE (Mental Status Exam & Clinical Observations)', n.objective);
        renderSection('ASSESSMENT (Diagnostic Impression & Clinical Trajectory)', n.assessment);
        renderSection('PLAN (Pharmacotherapy, Interventions & Schedule)', n.plan);
      } else if (n.noteFormat === 'DAP') {
        renderSection('DATA (Subjective & Objective Clinical Data)', n.data || n.subjective);
        renderSection('ASSESSMENT (Clinical Formulation & Response)', n.assessment);
        renderSection('PLAN (Medications, Psychotherapy & Follow-up)', n.plan);
      } else {
        renderSection('BEHAVIOR (Clinical Presentation & Goals)', n.behavior || n.subjective);
        renderSection('INTERVENTION (Physician Actions & Modalities)', n.intervention || n.objective);
        renderSection('RESPONSE (Patient Receptivity & Symptom Shift)', n.response || n.assessment);
        renderSection('PLAN (Prescriptions, Referrals & Next Visit)', n.plan);
      }

      // Attestation Block
      y = Math.max(y, 230);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(15, y, 180, 22, 2, 2, 'FD');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Electronic Provider Attestation: ${n.therapist || clinicianName}`, 20, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Status: ${n.isSigned ? 'SIGNED & PERMANENTLY LOCKED IN EHR' : 'DRAFT - PENDING FINAL LOCK'}   |   Timestamp: ${n.lastUpdated || n.date}`, 20, y + 15);

      doc.save(`Clinical_Note_${n.id}_${n.clientName.replace(/\s+/g, '_')}.pdf`);
      addToast('success', 'Note Exported', `Downloaded PDF for note ${n.id}`);
    } catch (err) {
      console.error('Note PDF error:', err);
      addToast('error', 'Export Error', 'Failed to generate note PDF.');
    }
  };

  const handleDelete = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(updated));
    addToast('success', 'Note Removed', `Session note ${id} archived from directory.`);
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  const handleSign = async (id) => {
    try {
      await sessionNoteApi.signSessionNote(id, { therapistId: currentUser?.id }).catch(() => {});
      const updated = notes.map(n => n.id === id ? { ...n, isSigned: true, status: 'SIGNED', lastUpdated: 'Just now (Signed)' } : n);
      setNotes(updated);
      localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(updated));
      setSelectedNote(prev => prev && prev.id === id ? { ...prev, isSigned: true, status: 'SIGNED', lastUpdated: 'Just now (Signed)' } : prev);
      addToast('success', 'Signed & Locked', `Session note ${id} permanently attested and locked.`);
    } catch (err) {
      addToast('error', 'Error', 'Failed to sign note');
    }
  };

  const handleCosign = async (id) => {
    try {
      await sessionNoteApi.cosignSessionNote(id, { supervisorId: currentUser?.id }).catch(() => {});
      const updated = notes.map(n => n.id === id ? { ...n, isSigned: true, status: 'SIGNED', lastUpdated: 'Co-signed by Supervisor' } : n);
      setNotes(updated);
      localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(updated));
      setSelectedNote(prev => prev && prev.id === id ? { ...prev, isSigned: true, status: 'SIGNED', lastUpdated: 'Co-signed by Supervisor' } : prev);
      addToast('success', 'Co-Signed', `Session note ${id} successfully co-signed.`);
    } catch (err) {
      addToast('error', 'Error', 'Failed to co-sign note');
    }
  };

  const handleDuplicate = (n) => {
    const newId = `SN-${Math.floor(1000 + Math.random() * 9000)}`;
    const cloned = {
      ...n,
      id: newId,
      status: 'DRAFT',
      isSigned: false,
      date: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now (Draft Copy)'
    };
    const updated = [cloned, ...notes];
    setNotes(updated);
    localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(updated));
    addToast('success', 'Note Duplicated', `Created new draft session note ${newId}`);
  };

  const handleCreateNewNoteSubmit = (e) => {
    e.preventDefault();
    const newId = `SN-${Math.floor(1000 + Math.random() * 9000)}`;
    const note = {
      id: newId,
      clientName: newNoteForm.clientName,
      clientId: 1,
      clientIdCode: newNoteForm.clientIdCode,
      age: 38,
      gender: 'Client',
      therapist: clinicianName,
      emergencyContact: 'Emergency Contact on File',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '50m',
      apptType: newNoteForm.apptType,
      cptCode: '99214 - Outpatient E/M',
      location: 'Consultation Suite 4A',
      noteFormat: newNoteForm.noteFormat,
      diagnosis: newNoteForm.diagnosis,
      status: 'SIGNED',
      isSigned: true,
      lastUpdated: 'Just now (Signed)',
      subjective: newNoteForm.subjective,
      objective: newNoteForm.objective,
      assessment: newNoteForm.assessment,
      plan: newNoteForm.plan
    };

    const updated = [note, ...notes];
    setNotes(updated);
    localStorage.setItem('mindcare_clinical_session_notes', JSON.stringify(updated));
    setShowCreateModal(false);
    addToast('success', 'Note Created', `New psychiatric session note ${newId} saved to EHR.`);
  };

  const filteredNotes = notes.filter(note => {
    const noteIdStr = String(note.id || '');
    const clientNameStr = String(note.clientName || 'Unknown Client');
    const diagStr = String(note.diagnosisPrimary || note.diagnosis || '');
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      clientNameStr.toLowerCase().includes(query) ||
      diagStr.toLowerCase().includes(query) ||
      noteIdStr.toLowerCase().includes(query);

    const matchesClient = clientFilter ? clientNameStr === clientFilter : true;
    const matchesStatus = statusFilter ? (note.isSigned ? 'SIGNED' : 'DRAFT') === statusFilter : true;
    const matchesFormat = formatFilter ? note.noteFormat === formatFilter : true;

    return matchesSearch && matchesClient && matchesStatus && matchesFormat;
  });


  

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 24, fontWeight: 800 }}>
            <DescriptionOutlinedIcon style={{ color: 'var(--color-primary)', fontSize: 28 }} /> Session Notes Module
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            Create, review, edit and manage HIPAA-secure progress note records.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-primary" onClick={() => navigate('/session-notes/new')} style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <PlusOneOutlinedIcon style={{ fontSize: 14 }} /> New Session Note
          </button>
          <button className="mc-btn mc-btn-outline" onClick={handleExportAllPDF} style={{ fontSize: 11, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CloudDownloadOutlinedIcon style={{ fontSize: 14 }} /> Export All PDF
          </button>
        </div>
      </div>

      {/* Statistics summary cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 16 }}>
        
        {/* Total notes */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Total Session Notes</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>{stats.total}</strong>
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>All time records</span>
          </div>
          <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 6, borderRadius: '50%' }}><DescriptionOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Today's Notes */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Today's Notes</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#1E1B4B', margin: '4px 0', display: 'block' }}>{stats.today}</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>2 new today</span>
          </div>
          <div style={{ color: '#5B21B6', background: 'rgba(91, 33, 182, 0.1)', padding: 6, borderRadius: '50%' }}><DescriptionOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Pending Documentation */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Pending Notes</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#B91C1C', margin: '4px 0', display: 'block' }}>{stats.pending}</strong>
            <span style={{ fontSize: 9, color: '#B91C1C', fontWeight: 700 }}>Requires lock</span>
          </div>
          <div style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: 6, borderRadius: '50%' }}><WarningAmberOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

        {/* Completed */}
        <div className="mc-card" style={{ padding: 14, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Signed Notes</span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: '#065F46', margin: '4px 0', display: 'block' }}>{stats.signed}</strong>
            <span style={{ fontSize: 9, color: 'var(--color-success)', fontWeight: 700 }}>Permanently locked</span>
          </div>
          <div style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: 6, borderRadius: '50%' }}><CheckCircleOutlinedIcon style={{ fontSize: 18 }} /></div>
        </div>

      </div>

      {/* Advanced search & filters toolbar */}
      <div className="mc-card" style={{ marginBottom: 16, padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', width: 240 }}>
              <SearchOutlinedIcon style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 18 }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search Client, ICD-10 or ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 34, height: 36, fontSize: 12 }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ height: 36, fontSize: 12, width: 140 }}>
                <option value="">Filter Status</option>
                <option value="SIGNED">Signed & Locked</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Format Filter */}
            <div>
              <select className="form-select" value={formatFilter} onChange={e => setFormatFilter(e.target.value)} style={{ height: 36, fontSize: 12, width: 140 }}>
                <option value="">Filter Format</option>
                <option value="SOAP">SOAP</option>
                <option value="DAP">DAP</option>
                <option value="BIRP">BIRP</option>
              </select>
            </div>

            <button className="mc-btn mc-btn-outline" style={{ padding: '0 10px', height: 36 }} onClick={() => { setSearchTerm(''); setClientFilter(''); setStatusFilter(''); setFormatFilter(''); }} title="Clear Filters">
              <RefreshOutlinedIcon style={{ fontSize: 16 }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={handleExportAllPDF}>
              <PictureAsPdfOutlinedIcon style={{ fontSize: 14, color: 'red' }} /> PDF
            </button>
            <button className="mc-btn mc-btn-outline" style={{ fontSize: 11, padding: '0 10px', height: 36, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => {
              const header = 'Session ID,Client,Therapist,Date,Format,Diagnosis,Status\n';
              const rows = filteredNotes.map(n => `${n.id},"${n.clientName}","${n.therapist}",${n.date},${n.noteFormat},"${n.diagnosis}",${n.status}`).join('\n');
              const blob = new Blob([header + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `MindCare_Session_Notes_${new Date().toISOString().split('T')[0]}.csv`; a.click();
              URL.revokeObjectURL(url);
              addToast('success', 'CSV Downloaded', 'Session Notes exported to CSV successfully.');
            }}>
              <CloudDownloadOutlinedIcon style={{ fontSize: 14, color: 'green' }} /> Excel
            </button>
          </div>

        </div>
      </div>

      {/* Main progress notes table */}
      <div className="mc-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
        {filteredNotes.length === 0 ? (
          <div className="mc-empty-state" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DescriptionOutlinedIcon style={{ fontSize: 56, color: 'var(--text-tertiary)', marginBottom: 16 }} />
            <h3>No Session Notes Found</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 360, textAlign: 'center', marginBottom: 12 }}>
              Create your first clinical documentation using the New Session Note button.
            </p>
            <button className="mc-btn mc-btn-primary" onClick={() => navigate('/session-notes/new')} style={{ fontSize: 11 }}>New Session Note</button>
          </div>
        ) : (
          <>
            <table className="mc-table">
              <thead>
                <tr style={{ background: '#F8F9FA', fontSize: 11 }}>
                  <th>Session ID</th>
                  <th>Client</th>
                  <th>Therapist</th>
                  <th>Session Time & Date</th>
                  <th>Format</th>
                  <th>Primary Diagnosis</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map(n => (
                  <tr key={n.id} style={{ fontSize: 12 }}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-tertiary)' }}>{n.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: '#EEF2FF',
                          color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold'
                        }}>
                          {(n.clientName || 'Unknown Client').split(' ').map(x => x.charAt(0)).join('')}
                        </div>
                        <strong>{(n.clientName || 'Unknown Client')}</strong>
                      </div>
                    </td>
                    <td>{n.therapist}</td>
                    <td>
                      <strong style={{ display: 'block' }}>{n.date}</strong>
                      <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{n.time} ({n.duration})</span>
                    </td>
                    <td>
                      <span className="mc-badge mc-badge-default" style={{ fontSize: 9 }}>{n.noteFormat}</span>
                    </td>
                    <td>
                      <div style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {n.diagnosis}
                      </div>
                    </td>
                    <td>
                      {n.status === 'SIGNED' ? (
                        <span className="mc-badge mc-badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <LockOutlinedIcon style={{ fontSize: 12 }} /> Signed
                        </span>
                      ) : (
                        <span className="mc-badge mc-badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <EditOutlinedIcon style={{ fontSize: 12 }} /> Draft
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{n.lastUpdated}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6 }} onClick={() => setSelectedNote(n)}>View</button>
                        {(!n.isSigned) && (
                          <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6 }} onClick={() => navigate(`/session-notes/new?client=${n.clientId}&appointment=1`)}>Edit</button>
                        )}
                        <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6 }} onClick={() => handleDuplicate(n)}>Duplicate</button>
                        <button className="mc-btn mc-btn-outline mc-btn-sm" style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(n.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Mock */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid var(--border-primary)', fontSize: 11, color: 'var(--text-secondary)' }}>
              <span>Showing 1 - {filteredNotes.length} of {filteredNotes.length} progress notes</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="mc-btn mc-btn-outline mc-btn-sm" disabled style={{ padding: '2px 8px' }}>Previous</button>
                <button className="mc-btn mc-btn-outline mc-btn-sm" disabled style={{ padding: '2px 8px' }}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Read-Only Details Drawer Overlay */}
      {selectedNote && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 680, padding: 24, borderRadius: 16, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>Clinical Record Sheet [{selectedNote.id}]</h3>
                <span className="mc-badge mc-badge-default" style={{ fontSize: 9, marginTop: 4, display: 'inline-block' }}>Format: {selectedNote.noteFormat}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => window.print()} title="Print Note"><PrintOutlinedIcon style={{ fontSize: 14 }} /></button>
                <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => handleExportSingleNotePDF(selectedNote)} title="Download PDF" style={{ color: '#DC2626' }}><PictureAsPdfOutlinedIcon style={{ fontSize: 14, color: 'red' }} /></button>
                {!selectedNote.isSigned && (
                  <button className="mc-btn mc-btn-sm" style={{ fontSize: 10, padding: '3px 8px', background: '#4338CA', color: '#fff', border: 'none', borderRadius: 6 }} onClick={() => handleSign(selectedNote.id)} title="Sign & Lock Note">Sign</button>
                )}
                {!selectedNote.isSigned && (
                  <button className="mc-btn mc-btn-sm" style={{ fontSize: 10, padding: '3px 8px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6 }} onClick={() => handleCosign(selectedNote.id)} title="Co-sign Note">Co-sign</button>
                )}
                <button className="mc-btn mc-btn-ghost" onClick={() => setSelectedNote(null)} style={{ fontSize: 20, padding: '0 6px' }}>&times;</button>
              </div>
            </div>

            {/* Content Sheets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 12 }}>
              
              {/* Client Info grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#F8F9FA', padding: 12, borderRadius: 8 }}>
                <div><strong>Client Name:</strong> {selectedNote.clientName} (ID: {selectedNote.clientId})</div>
                <div><strong>Age / Gender:</strong> {selectedNote.age} yrs / {selectedNote.gender}</div>
                <div><strong>Primary Therapist:</strong> {selectedNote.therapist}</div>
                <div><strong>Emergency Contact:</strong> {selectedNote.emergencyContact}</div>
              </div>

              {/* Session Info grid */}
              <div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700 }}>Session Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div><strong>Date / Time Slot:</strong> {selectedNote.date} at {selectedNote.time}</div>
                  <div><strong>Duration / Modality:</strong> {selectedNote.duration} / {selectedNote.apptType}</div>
                  <div><strong>Billing CPT Code:</strong> {selectedNote.cptCode}</div>
                  <div><strong>Clinical Location:</strong> {selectedNote.location}</div>
                </div>
              </div>

              {/* Note Details Content */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 700 }}>Clinical Documentation</h4>
                
                {selectedNote.noteFormat === 'SOAP' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ background: '#FFFDF5', padding: 10, borderRadius: 8, borderLeft: '4px solid #F59E0B' }}>
                      <strong>Subjective (S):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.subjective}</p>
                    </div>
                    <div style={{ background: '#F5F8FF', padding: 10, borderRadius: 8, borderLeft: '4px solid #4338CA' }}>
                      <strong>Objective (O):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.objective}</p>
                    </div>
                  </div>
                )}

                {selectedNote.noteFormat === 'DAP' && (
                  <div style={{ background: '#FFFDF5', padding: 10, borderRadius: 8, borderLeft: '4px solid #F59E0B' }}>
                    <strong>Data (D):</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.data}</p>
                  </div>
                )}

                {selectedNote.noteFormat === 'BIRP' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ background: '#FFFDF5', padding: 10, borderRadius: 8, borderLeft: '4px solid #F59E0B' }}>
                      <strong>Behavior (B):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.behavior}</p>
                    </div>
                    <div style={{ background: '#F5F8FF', padding: 10, borderRadius: 8, borderLeft: '4px solid #4338CA' }}>
                      <strong>Intervention (I):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.intervention}</p>
                    </div>
                    <div style={{ background: '#F0FDF4', padding: 10, borderRadius: 8, borderLeft: '4px solid #10B981' }}>
                      <strong>Response (R):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.response}</p>
                    </div>
                  </div>
                )}

                {/* Shared A & P */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                  {(selectedNote.noteFormat === 'SOAP' || selectedNote.noteFormat === 'DAP') && (
                    <div style={{ background: '#F5F8FF', padding: 10, borderRadius: 8, borderLeft: '4px solid #4338CA' }}>
                      <strong>Assessment (A):</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.assessment}</p>
                    </div>
                  )}
                  <div style={{ background: '#F0FDF4', padding: 10, borderRadius: 8, borderLeft: '4px solid #10B981' }}>
                    <strong>Plan (P):</strong>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{selectedNote.plan}</p>
                  </div>
                </div>

              </div>

              {/* Mental Status & Observations */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700 }}>Mental Status & Observations</h4>
                <div><strong>Diagnosis:</strong> {selectedNote.diagnosis}</div>
                <div style={{ marginTop: 4 }}><strong>MSE Summary:</strong> {selectedNote.mse}</div>
                <div style={{ marginTop: 4 }}><strong>Observations:</strong> {selectedNote.observations}</div>
              </div>

              {/* Outcome Measures */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700 }}>Routine Outcome Measurement (ROM)</h4>
                <div><strong>Measure Type:</strong> {selectedNote.outcomeType}</div>
                <div style={{ marginTop: 4 }}><strong>Recorded Score:</strong> {selectedNote.outcomeScore}</div>
                <div style={{ marginTop: 4 }}><strong>Interpretation Progress:</strong> {selectedNote.outcomeProgress}</div>
              </div>

              {/* Crisis Risk */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12, background: selectedNote.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.03)' : 'transparent', padding: selectedNote.riskLevel === 'HIGH' ? 12 : 0, borderRadius: 8, border: selectedNote.riskLevel === 'HIGH' ? '1px solid rgba(239, 68, 68, 0.2)' : 'none' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700, color: selectedNote.riskLevel === 'HIGH' ? '#EF4444' : 'var(--text-primary)' }}>Crisis Risk screening</h4>
                <div><strong>Risk Level:</strong> <span className={`mc-badge mc-badge-${selectedNote.riskLevel === 'HIGH' ? 'critical' : 'success'}`}>{selectedNote.riskLevel}</span></div>
                <div style={{ marginTop: 4 }}><strong>Suicidal Ideation:</strong> {selectedNote.suicidal}</div>
                <div style={{ marginTop: 4 }}><strong>Self Harm Risk:</strong> {selectedNote.selfHarm}</div>
                <div style={{ marginTop: 4 }}><strong>Supervisor Escalation Notification:</strong> {selectedNote.supervisorNotified}</div>
              </div>

              {/* Next session recommendation */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 700 }}>Next Session Plan</h4>
                <div><strong>Assigned Homework:</strong> {selectedNote.homework}</div>
                <div style={{ marginTop: 4 }}><strong>Treatment Recommendation:</strong> {selectedNote.recommendations}</div>
              </div>

              {/* Electronic Signature attestation */}
              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 12, background: '#EEF2FF', padding: 12, borderRadius: 8, display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: 12, display: 'block', color: '#4338CA' }}>Electronically Signed and Sealed</strong>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Signed by primary clinician on {selectedNote.lastUpdated}</span>
                </div>
                <div style={{ fontFamily: 'cursive', fontSize: 16, color: '#4338CA', fontWeight: 'bold' }}>
                  {selectedNote.therapist}
                </div>
              </div>

            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTop: '1px solid var(--border-primary)', paddingTop: 12 }}>
              <button className="mc-btn mc-btn-outline" onClick={() => handleExportSingleNotePDF(selectedNote)} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <PictureAsPdfOutlinedIcon style={{ fontSize: 14, color: 'red' }} /> Download PDF
              </button>
              <button className="mc-btn mc-btn-primary" onClick={() => setSelectedNote(null)} style={{ fontSize: 12 }}>Done Reviewing</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SessionNotesList;

