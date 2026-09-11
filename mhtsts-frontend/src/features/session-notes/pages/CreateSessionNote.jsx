import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { sessionNoteApi } from '../../../api/sessionNoteApi';
import { clientApi } from '../../../api/clientApi';
import { useNotification } from '../../../providers/NotificationProvider';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';

const CreateSessionNote = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useNotification();
  
  const appointmentId = searchParams.get('appointment') || '1';
  const clientId = searchParams.get('client') || '1';
  
  const [client, setClient] = useState(null);
  const [format, setFormat] = useState('SOAP'); // SOAP, DAP, BIRP tabs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Form State parameters
  const [noteForm, setNoteForm] = useState({
    // Client Info Mock fallback
    clientName: 'Alex Morgan',
    clientIdCode: 'MC-101',
    age: 28,
    gender: 'Male',
    emergencyContact: 'Sarah Morgan (Mother) - +1 (555) 019-2233',
    // Session Info
    sessionDate: '2026-07-12',
    sessionTime: '09:00 AM',
    duration: '50 mins',
    sessionType: 'Individual Psychotherapy',
    apptType: 'Telehealth',
    location: 'Virtual Room A',
    // Clinical Documentation SOAP
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    // DAP Note
    data: '',
    // BIRP Note
    behavior: '',
    intervention: '',
    response: '',
    // Clinical details
    mse: 'Alert, oriented x4, cooperative, normal speech, logical thought processes.',
    presentingProblems: 'Situational anxiety secondary to workplace stress and performance evaluations.',
    diagnosis: 'F41.1 - Generalized Anxiety Disorder',
    goals: 'Reduce physical symptoms of panic by 30% through diaphragmatic breathing.',
    progress: 'Moderate progress. Client has practiced cognitive reappraisal 3x this week.',
    medicationNotes: 'Client reports compliance with prescribed Escitalopram 10mg. No side effects reported.',
    observations: 'Client fidgets with hands when discussing work but responds well to grounding.',
    // Outcome Measures
    outcomeType: 'GAD-7',
    outcomeScore: '12',
    outcomeInterpretation: 'Moderate Anxiety. Reduced by 3 points from baseline.',
    outcomeProgress: 'Client has shown a reduction in somatic anxiety symptoms.',
    // Crisis Information
    riskLevel: 'LOW',
    suicidalIdeation: 'Passive ideation only, no active intent or safety concerns.',
    selfHarmRisk: 'None reported.',
    safetyPlanAvailable: true,
    supervisorNotified: false,
    // Next Session details
    followUpDate: '2026-07-19',
    homework: 'Log automatic thoughts on cognitive restructuring sheets.',
    recommendation: 'Continue CBT protocol; prioritize somatic grounding.',
    referralRequired: false,
    // Attachments
    attachedFiles: [],
    // Signature
    therapistSignature: '',
    documentationStatus: 'DRAFT'
  });

  useEffect(() => {
    if (clientId) {
      clientApi.getClientById(clientId).then(data => {
        if (data) {
          setClient(data);
          setNoteForm(prev => ({
            ...prev,
            clientName: `${data.firstName} ${data.lastName}`,
            clientIdCode: `MC-10${data.id}`,
            age: data.age || 28,
            gender: data.gender || 'Male'
          }));
        }
      }).catch(console.error);
    }
  }, [clientId]);

  const handleSignAndSave = async (e) => {
    e.preventDefault();
    if (!noteForm.therapistSignature) {
      addToast('warning', 'Attestation Required', 'Please enter your electronic signature to lock the note.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      let content = '';
      if (format === 'SOAP') {
        content = `Subjective: ${noteForm.subjective}\nObjective: ${noteForm.objective}\nAssessment: ${noteForm.assessment}\nPlan: ${noteForm.plan}`;
      } else if (format === 'DAP') {
        content = `Data: ${noteForm.data}\nAssessment: ${noteForm.assessment}\nPlan: ${noteForm.plan}`;
      } else {
        content = `Behavior: ${noteForm.behavior}\nIntervention: ${noteForm.intervention}\nResponse: ${noteForm.response}\nPlan: ${noteForm.plan}`;
      }

      await sessionNoteApi.createSessionNote({
        appointment: { id: parseInt(appointmentId) },
        client: { id: parseInt(clientId) },
        therapist: { id: currentUser.id },
        noteFormat: format,
        noteContent: content,
        diagnosisPrimary: noteForm.diagnosis,
        cptCode: '90837',
        sessionDurationMinutes: 50,
        isSigned: true
      });
      
      setIsSigned(true);
      addToast('success', 'Note Locked', 'Session note successfully signed and committed to the EHR database.');
      setTimeout(() => navigate('/session-notes'), 2000);
      
    } catch (err) {
      addToast('error', 'Error', 'Failed to lock session note');
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNoteForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNoteForm(prev => ({
      ...prev,
      attachedFiles: [...prev.attachedFiles, ...files.map(f => f.name)]
    }));
    addToast('success', 'File Uploaded', 'Attachment added to progress note record.');
  };

  if (isSigned) {
    return (
      <div className="mc-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <CheckCircleOutlinedIcon style={{ fontSize: 64, color: 'var(--color-success)', marginBottom: 16 }} />
          <h2 style={{ color: '#1E1B4B', fontWeight: 800 }}>EHR Document Locked & Signed</h2>
          <p style={{ color: 'var(--text-secondary)' }}>This progress note is now permanently committed to the clinical database and cannot be modified.</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, marginTop: 10 }}>Transferring back to directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      <div style={{ marginBottom: 16 }}>
        <Link to="/session-notes" className="mc-btn mc-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
          <ArrowBackOutlinedIcon style={{ fontSize: 14 }} /> Back to Note Directory
        </Link>
      </div>

      {/* Title */}
      <div className="mc-page-header" style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 10, marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, color: '#1E1B4B', margin: 0 }}>
            New Therapy Session Note
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            EHR Clinical Record Entry. Fill out all sections below to commit and sign this record.
          </p>
        </div>
      </div>

      <form onSubmit={handleSignAndSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 16 }}>
          
          {/* Main Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Section 1: Client Information */}
            <div className="mc-card" style={{ padding: 20, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>1. Client Information</h3>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', background: '#EEF2FF',
                  color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold'
                }}>
                  {noteForm.clientName.split(' ').map(x => x.charAt(0)).join('')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, fontSize: 11 }}>
                  <div><strong>Client Name:</strong> {noteForm.clientName} (ID: {noteForm.clientIdCode})</div>
                  <div><strong>Age / Gender:</strong> {noteForm.age} yrs / {noteForm.gender}</div>
                  <div><strong>Assigned Therapist:</strong> {currentUser.firstName} {currentUser.lastName}</div>
                  <div><strong>Emergency Contact:</strong> {noteForm.emergencyContact}</div>
                </div>
              </div>
            </div>

            {/* Section 2: Session Information */}
            <div className="mc-card" style={{ padding: 20, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>2. Session Information</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, fontSize: 11 }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Session Date</label>
                  <input type="date" name="sessionDate" className="form-control" value={noteForm.sessionDate} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Session Time</label>
                  <input type="text" name="sessionTime" className="form-control" value={noteForm.sessionTime} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration</label>
                  <input type="text" name="duration" className="form-control" value={noteForm.duration} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Session Type</label>
                  <input type="text" name="sessionType" className="form-control" value={noteForm.sessionType} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Location</label>
                  <input type="text" name="location" className="form-control" value={noteForm.location} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }} />
                </div>
              </div>
            </div>

            {/* Section 3: Clinical Documentation Format (SOAP, DAP, BIRP) */}
            <div className="mc-card" style={{ padding: 20, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>3. Clinical Note Documentation</h3>
                
                {/* Format Switcher tabs */}
                <div style={{ display: 'flex', gap: 4, background: '#F2F4F7', padding: 2, borderRadius: 6 }}>
                  {['SOAP', 'DAP', 'BIRP'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFormat(f)}
                      style={{
                        border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 10, fontWeight: 600,
                        background: format === f ? 'white' : 'transparent',
                        color: format === f ? '#4338CA' : '#667085',
                        cursor: 'pointer'
                      }}
                    >
                      {f} Format
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic inputs based on format */}
              {format === 'SOAP' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Subjective (S)</label>
                    <textarea name="subjective" className="form-control" rows="4" style={{ fontSize: 11 }} placeholder="Client self-reports triggers, behavioral homework outcomes..." value={noteForm.subjective} onChange={handleInputChange} required></textarea>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Objective (O)</label>
                    <textarea name="objective" className="form-control" rows="4" style={{ fontSize: 11 }} placeholder="Clinician MSE observations, affect, speech parameters..." value={noteForm.objective} onChange={handleInputChange} required></textarea>
                  </div>
                </div>
              )}

              {format === 'DAP' && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Data (D)</label>
                  <textarea name="data" className="form-control" rows="6" style={{ fontSize: 11 }} placeholder="Summarize subjective and objective metrics in a single data report..." value={noteForm.data} onChange={handleInputChange} required></textarea>
                </div>
              )}

              {format === 'BIRP' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Behavior (B)</label>
                    <textarea name="behavior" className="form-control" rows="3" style={{ fontSize: 11 }} placeholder="Clinical behavioral displays..." value={noteForm.behavior} onChange={handleInputChange} required></textarea>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Intervention (I)</label>
                    <textarea name="intervention" className="form-control" rows="3" style={{ fontSize: 11 }} placeholder="Therapeutic modalities and strategies utilized..." value={noteForm.intervention} onChange={handleInputChange} required></textarea>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Response (R)</label>
                    <textarea name="response" className="form-control" rows="3" style={{ fontSize: 11 }} placeholder="Client's response to the interventions..." value={noteForm.response} onChange={handleInputChange} required></textarea>
                  </div>
                </div>
              )}

              {/* Shared A & P */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {(format === 'SOAP' || format === 'DAP') && (
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Assessment (A)</label>
                    <textarea name="assessment" className="form-control" rows="4" style={{ fontSize: 11 }} placeholder="Clinical synthesis, progress summaries..." value={noteForm.assessment} onChange={handleInputChange} required></textarea>
                  </div>
                )}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Plan (P)</label>
                  <textarea name="plan" className="form-control" rows="3" style={{ fontSize: 11 }} placeholder="Follow up session targets, goals, assigned homework..." value={noteForm.plan} onChange={handleInputChange} required></textarea>
                </div>
              </div>

            </div>

            {/* Section 4: Clinical Information */}
            <div className="mc-card" style={{ padding: 20, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>4. Clinical Profile details</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Mental Status Examination (MSE)</label>
                    <input type="text" name="mse" className="form-control" value={noteForm.mse} onChange={handleInputChange} style={{ height: 36, fontSize: 11 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Presenting Problem Summary</label>
                    <input type="text" name="presentingProblems" className="form-control" value={noteForm.presentingProblems} onChange={handleInputChange} style={{ height: 36, fontSize: 11 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Treatment Goals</label>
                    <input type="text" name="goals" className="form-control" value={noteForm.goals} onChange={handleInputChange} style={{ height: 36, fontSize: 11 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Pharmacology / Medication Notes</label>
                    <input type="text" name="medicationNotes" className="form-control" value={noteForm.medicationNotes} onChange={handleInputChange} style={{ height: 36, fontSize: 11 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>Clinical Observations</label>
                  <textarea name="observations" className="form-control" rows="2" style={{ fontSize: 11 }} value={noteForm.observations} onChange={handleInputChange}></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side Cards: Codes, Signatures, Crisis Risks, Attachments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Clinical Codes & Outcomes */}
            <div className="mc-card" style={{ padding: 16, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Codes & Outcomes</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Primary Diagnosis (ICD-10)</label>
                  <select name="diagnosis" className="form-select" value={noteForm.diagnosis} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }}>
                    <option value="F41.1">F41.1 - Generalized Anxiety Disorder</option>
                    <option value="F32.1">F32.1 - Major Depressive Disorder</option>
                    <option value="F43.10">F43.10 - PTSD</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border-primary)', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Outcome Test</label>
                    <input type="text" name="outcomeType" className="form-control" value={noteForm.outcomeType} onChange={handleInputChange} style={{ height: 30, fontSize: 10 }} />
                  </div>
                  <div style={{ width: 80 }}>
                    <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Score</label>
                    <input type="text" name="outcomeScore" className="form-control" value={noteForm.outcomeScore} onChange={handleInputChange} style={{ height: 30, fontSize: 10 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Crisis & Risk Screening panel */}
            <div className="mc-card" style={{ padding: 16, borderRadius: 12, border: noteForm.riskLevel === 'HIGH' ? '1.5px solid #EF4444' : '1px solid var(--border-primary)', background: noteForm.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: noteForm.riskLevel === 'HIGH' ? '#EF4444' : 'var(--text-primary)', margin: 0 }}>Crisis Risk Assessment</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Caseload Risk Severity</label>
                  <select name="riskLevel" className="form-select" value={noteForm.riskLevel} onChange={handleInputChange} style={{ height: 32, fontSize: 11 }}>
                    <option value="LOW">Low Risk</option>
                    <option value="MODERATE">Moderate Risk</option>
                    <option value="HIGH">High / Critical Alert</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, display: 'block', marginBottom: 4 }}>Suicidal Ideation Status</label>
                  <input type="text" name="suicidalIdeation" className="form-control" value={noteForm.suicidalIdeation} onChange={handleInputChange} style={{ height: 30, fontSize: 10 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <input type="checkbox" name="supervisorNotified" checked={noteForm.supervisorNotified} onChange={handleInputChange} style={{ accentColor: '#4338CA' }} />
                  <span style={{ fontSize: 10, fontWeight: 600 }}>Notify Clinical Supervisor</span>
                </div>
              </div>
            </div>

            {/* Next session details & homework */}
            <div className="mc-card" style={{ padding: 16, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Next Session Plan</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 10 }}>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Follow-up Target Date</label>
                  <input type="date" name="followUpDate" className="form-control" value={noteForm.followUpDate} onChange={handleInputChange} style={{ height: 30, fontSize: 11 }} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'block', marginBottom: 4 }}>Target Homework Assignment</label>
                  <input type="text" name="homework" className="form-control" value={noteForm.homework} onChange={handleInputChange} style={{ height: 30, fontSize: 11 }} />
                </div>
              </div>
            </div>

            {/* Document Attachments */}
            <div className="mc-card" style={{ padding: 16, borderRadius: 12 }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Attachments</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{
                  border: '1.5px dashed var(--border-strong)', padding: '12px 8px', borderRadius: 8,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
                  fontSize: 10, color: 'var(--text-tertiary)'
                }}>
                  <AttachmentOutlinedIcon style={{ fontSize: 18 }} />
                  <span>Attach PDF/Image/Report</span>
                  <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                {noteForm.attachedFiles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, color: 'var(--text-secondary)' }}>
                    {noteForm.attachedFiles.map((name, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>📎 {name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Electronic Attestation & Signatures */}
            <div className="mc-card" style={{ padding: 16, borderRadius: 12, background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.02) 0%, rgba(91, 33, 182, 0.02) 100%)', border: '1px solid rgba(67, 56, 202, 0.15)' }}>
              <div style={{ borderBottom: '1px solid var(--border-primary)', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: '#4338CA', margin: 0 }}>Electronic Attestation</h3>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
                By entering your full name in the box below, you attest that the services documented were rendered by you and are locked.
              </p>
              <div style={{ marginBottom: 12 }}>
                <input 
                  type="text" 
                  name="therapistSignature"
                  className="form-control" 
                  placeholder="Type Full Name to Sign..." 
                  value={noteForm.therapistSignature}
                  onChange={handleInputChange}
                  style={{ height: 34, fontSize: 11, border: '1px solid rgba(67, 56, 202, 0.3)' }}
                />
              </div>

              {noteForm.therapistSignature && (
                <div style={{ 
                  height: 60, background: 'white', border: '1px dashed rgba(67, 56, 202, 0.3)', borderRadius: 6,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontFamily: 'cursive', color: '#4338CA', fontSize: 18, fontWeight: 'bold', marginBottom: 12
                }}>
                  {noteForm.therapistSignature}
                </div>
              )}

              <button
                type="submit"
                className="mc-btn mc-btn-primary"
                style={{ width: '100%', fontSize: 11 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Committing to EHR Database...' : '🔒 Sign and Lock Progress Note'}
              </button>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
};

export default CreateSessionNote;
