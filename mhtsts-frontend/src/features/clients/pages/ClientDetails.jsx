import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clientService } from '../../../features/clients/api/client.service';
import { useNotification } from '../../../providers/NotificationProvider';

// Icons
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useNotification();
  
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientService.getById(id);
        setClient(data);
      } catch (err) {
        addToast('error', 'Error', 'Client not found');
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClient();
  }, [id, navigate, addToast]);

  if (isLoading) {
    return (
      <div className="mc-page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <span className="mc-spinner mc-spinner-lg"></span>
      </div>
    );
  }

  if (!client) return null;

  // Realistic sub-module data matching EHR (Epic/Athena)
  const appointments = [
    { date: "2026-07-12", time: "10:30 AM", duration: "50 min", type: "Intake Evaluation", status: "In Progress", billingCode: "90791" },
    { date: "2026-07-05", time: "10:30 AM", duration: "50 min", type: "CBT Session", status: "Completed", billingCode: "90834" },
    { date: "2026-06-28", time: "10:30 AM", duration: "50 min", type: "CBT Session", status: "Completed", billingCode: "90834" }
  ];

  const treatmentPlans = [
    {
      diagnosis: "F33.1 - Major Depressive Disorder, Recurrent, Moderate",
      goals: ["Reduce depressive symptom severity on PHQ-9 scale", "Develop cognitive restructuring coping skills"],
      objectives: ["Client will identify 3 cognitive distortions daily", "Client will engage in behavioral activation twice weekly"],
      interventions: ["CBT cognitive restructuring", "Behavioral activation scheduling", "Psychoeducation on MDD"],
      progress: "Sufficient progress - client demonstrates active engagement in cognitive modeling exercise.",
      reviewDate: "2026-09-18",
      status: "Active"
    }
  ];

  const sessionNotes = [
    { date: "2026-07-05", type: "SOAP Note", format: "SOAP", status: "Signed & Finalized", author: "Dr. Michael Thompson", id: "note_1" },
    { date: "2026-06-28", type: "DAP Note", format: "DAP", status: "Signed & Finalized", author: "Dr. Michael Thompson", id: "note_2" }
  ];

  const outcomeMeasures = [
    { name: "PHQ-9 (Patient Health Questionnaire)", date: "2026-07-05", score: 14, progress: "-4 points (improvement)", interpretation: "Moderate Depression. Showing steady reduction in depressive symptoms." },
    { name: "GAD-7 (Generalized Anxiety Scale)", date: "2026-06-28", score: 9, progress: "-2 points (improvement)", interpretation: "Mild Anxiety. Coping strategies beginning to show effect." }
  ];

  const crisisAssessments = [
    {
      date: "2026-07-05",
      riskLevel: "MODERATE",
      protectiveFactors: "Supports wife/family, holds stable job, active in clinical therapy sessions",
      riskFactors: "Reports history of suicidal ideation, expressions of feelings of hopelessness",
      clinicalNotes: "Client denied active suicidal intent or plan during assessment. Agrees to contact emergency lines if symptoms worsen.",
      intervention: "Co-created safety plan, scheduled follow-up session within 48 hours, provided crisis hotlines.",
      followUp: "2026-07-07",
      status: "Resolved"
    }
  ];

  const safetyPlan = {
    warningSigns: ["Feelings of restlessness or isolation", "Increased negative self-talk", "Withdrawal from social routines"],
    copingStrategies: ["Box breathing exercises (4x4)", "Journaling thoughts", "Going for a 15 min walk"],
    supports: ["Jane Chen (Wife) - 555-0199", "David Chen (Brother) - 555-0210"],
    emergencyContacts: ["Crisis Lifeline: 988", "Emergency: 911"],
    resources: ["MindCare Crisis Center - 555-0800", "Local ER (Valley Hospital)"],
    safeEnvironment: ["Removed accessibility to lethal means in house", "Secured medications in locked cabinet"],
    emergencySteps: ["Call 988 immediately or go to nearest emergency room if safety cannot be maintained."],
    reviewDate: "2026-08-18"
  };

  const timelineEvents = [
    { title: "Intake Evaluation Completed", desc: "Diagnostic evaluation for MDD and adjustment triggers completed.", date: "2026-06-12", icon: "📝" },
    { title: "Treatment Plan Created", desc: "Co-created 90-day CBT structured plan.", date: "2026-06-14", icon: "📋" },
    { title: "PHQ-9 Administered", desc: "Baseline severity score logged at 18 (Severe).", date: "2026-06-15", icon: "📈" },
    { title: "Crisis Safety Plan Finalized", desc: "10-section safety plan signed and verified.", date: "2026-07-05", icon: "🛡️" }
  ];

  return (
    <div className="mc-page-container">
      {/* Back Shortcut */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <Link to="/clients" className="mc-btn mc-btn-ghost mc-btn-sm" style={{ color: 'var(--text-secondary)' }}>
          <ArrowBackOutlinedIcon fontSize="small" /> Back to Caseload
        </Link>
      </div>

      {/* Client Banner Details Card */}
      <div className="mc-card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center' }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary-50)', 
              color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 'bold'
            }}>
              {(client.firstName || 'C').charAt(0)}{(client.lastName || 'L').charAt(0)}
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>{client.firstName || ''} {client.lastName || client.name || 'Client'}</h1>
                <span className={`mc-badge mc-badge-${client.status === 'ACTIVE' ? 'success' : 'warning'}`}>
                  {client.status || 'ACTIVE'}
                </span>
                {client.isMinor && <span className="mc-badge mc-badge-active">Minor</span>}
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                <span>Record #: <strong style={{ color: 'var(--text-primary)' }}>{client.clientNumber || `MC-${client.id}`}</strong></span>
                <span>DOB: <strong style={{ color: 'var(--text-primary)' }}>{client.dateOfBirth || 'N/A'}</strong></span>
                <span>Gender: <strong style={{ color: 'var(--text-primary)' }}>{client.gender || 'Not specified'}</strong></span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="mc-btn mc-btn-outline" onClick={() => navigate('/calendar')}><CalendarMonthOutlinedIcon style={{ fontSize: 16 }} /> Schedule Session</button>
            <button className="mc-btn mc-btn-primary" onClick={() => navigate('/session-notes/new')}><EditOutlinedIcon style={{ fontSize: 16 }} /> Log SOAP Note</button>
          </div>
        </div>
        
        {/* Contact Info Footer Grid */}
        <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '12px' }}>
            <LocalPhoneOutlinedIcon fontSize="small" /> {client.phone || client.phoneNumber || 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '12px' }}>
            <EmailOutlinedIcon fontSize="small" /> {client.email || 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', fontSize: '12px' }}>
            <WarningAmberOutlinedIcon fontSize="small" /> Emergency Contact: <strong>{client.emergencyContactName || 'None listed'} ({client.emergencyContactPhone || 'N/A'})</strong>
          </div>
        </div>
      </div>

      {/* EHR Client Profile Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)', marginBottom: 'var(--space-5)', overflowX: 'auto' }}>
        {[
          { id: 'profile', label: 'EHR Profile Info', icon: <PersonOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'appointments', label: 'Appointments Log', icon: <CalendarMonthOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'treatment', label: 'Treatment Plans', icon: <AssignmentOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'notes', label: 'Session Notes', icon: <DescriptionOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'outcomes', label: 'Outcome Measures', icon: <AssessmentOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'crisis', label: 'Crisis & Safety Plans', icon: <ShieldOutlinedIcon style={{ fontSize: 16 }} /> },
          { id: 'timeline', label: 'Clinical Timeline', icon: <TimelineOutlinedIcon style={{ fontSize: 16 }} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 6,
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
              transition: 'all 0.2s ease', whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div>
        
        {/* PROFILE INFO TAB */}
        {activeTab === 'profile' && (
          <div className="mc-grid-2">
            <div className="mc-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>Personal Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Full Legal Name:</span> <strong style={{ color: 'var(--text-primary)' }}>{client.firstName || ''} {client.lastName || client.name || 'Client'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Date of Birth:</span> <strong style={{ color: 'var(--text-primary)' }}>{client.dateOfBirth || 'N/A'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Age / Gender:</span> <strong style={{ color: 'var(--text-primary)' }}>{client.age || 32} years / {client.gender || 'Not specified'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Marital Status:</span> <strong style={{ color: 'var(--text-primary)' }}>Married</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Address:</span> <strong style={{ color: 'var(--text-primary)' }}>124 Pine Street, San Francisco, CA 94111</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Occupation:</span> <strong style={{ color: 'var(--text-primary)' }}>Senior Software Engineer</strong></div>
              </div>
            </div>

            <div className="mc-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '8px' }}>Emergency & Clinical Contacts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '12px' }}>
                <div><span style={{ color: 'var(--text-secondary)' }}>Emergency Contact Name:</span> <strong style={{ color: 'var(--text-primary)' }}>{client.emergencyContactName || 'None listed'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Emergency Relationship:</span> <strong style={{ color: 'var(--text-primary)' }}>Spouse</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Emergency Phone:</span> <strong style={{ color: 'var(--text-primary)' }}>{client.emergencyContactPhone || 'None listed'}</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Primary Care Physician (PCP):</span> <strong style={{ color: 'var(--text-primary)' }}>Dr. Angela Ross, MD (555-0811)</strong></div>
                <div><span style={{ color: 'var(--text-secondary)' }}>Clinical Risk Profile:</span> <span className="mc-badge mc-badge-warning" style={{ fontSize: '9px' }}>MODERATE RISK</span></div>
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className="mc-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Appointments History & Billing Codes</h3>
            <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Duration</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Session Type</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Billing Code</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '12px' }}>{apt.date}</td>
                    <td style={{ padding: '12px' }}>{apt.time}</td>
                    <td style={{ padding: '12px' }}>{apt.duration}</td>
                    <td style={{ padding: '12px' }}>{apt.type}</td>
                    <td style={{ padding: '12px' }}><code>{apt.billingCode}</code></td>
                    <td style={{ padding: '12px' }}>
                      <span className={`mc-badge ${apt.status === 'Completed' ? 'mc-badge-completed' : 'mc-badge-active'}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TREATMENT PLANS TAB */}
        {activeTab === 'treatment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {treatmentPlans.map((plan, i) => (
              <div key={i} className="mc-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-primary)', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Structured Treatment Plan (Active)</h3>
                  <span className="mc-badge mc-badge-completed">Review Due: {plan.reviewDate}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px' }}>
                  <div>
                    <strong>Primary Diagnosis (ICD-10):</strong>
                    <div style={{ background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>{plan.diagnosis}</div>
                  </div>
                  <div>
                    <strong>Clinical Goals:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.6 }}>
                      {plan.goals.map((g, idx) => <li key={idx}>{g}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Measurable Objectives:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.6 }}>
                      {plan.objectives.map((o, idx) => <li key={idx}>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong>Therapeutic Interventions:</strong>
                    <div style={{ display: 'flex', gap: 8, marginTop: '6px' }}>
                      {plan.interventions.map((intv, idx) => (
                        <span key={idx} style={{ padding: '4px 8px', borderRadius: 4, background: 'var(--color-primary-50)', color: 'var(--color-primary)', fontWeight: '500' }}>
                          {intv}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Interim Progress Documentation:</strong>
                    <p style={{ marginTop: '6px', fontStyle: 'italic' }}>"{plan.progress}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SESSION NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="mc-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Clinical Session Notes</h3>
            <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Session Date</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Note Type</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Format</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Author / Practitioner</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessionNotes.map((note, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '12px' }}>{note.date}</td>
                    <td style={{ padding: '12px' }}>{note.type}</td>
                    <td style={{ padding: '12px' }}><code>{note.format}</code></td>
                    <td style={{ padding: '12px' }}>{note.author}</td>
                    <td style={{ padding: '12px' }}>
                      <span className="mc-badge mc-badge-completed">{note.status}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => navigate('/session-notes')} className="mc-btn mc-btn-ghost mc-btn-sm" style={{ padding: 0, fontSize: '11px', color: 'var(--color-primary)' }}>
                        Review Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* OUTCOME MEASURES TAB */}
        {activeTab === 'outcomes' && (
          <div className="mc-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Outcome Measurement History (ROM)</h3>
            <table className="mc-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Assessment Scale</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Assessment Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Progress Trend</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Clinical Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {outcomeMeasures.map((measure, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{measure.name}</td>
                    <td style={{ padding: '12px' }}>{measure.date}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{measure.score}</span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-success)', fontWeight: '500' }}>{measure.progress}</td>
                    <td style={{ padding: '12px' }}>{measure.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CRISIS & SAFETY PLANS TAB */}
        {activeTab === 'crisis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Crisis Evaluations Log */}
            <div className="mc-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Crisis Risk Intake Logs</h3>
              {crisisAssessments.map((ca, idx) => (
                <div key={idx} style={{ padding: '14px', background: 'var(--bg-primary)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Evaluation Date: <strong>{ca.date}</strong></span>
                    <span className="mc-badge mc-badge-warning">{ca.riskLevel} RISK LEVEL</span>
                  </div>
                  <div><strong>Risk Factors Identified:</strong> {ca.riskFactors}</div>
                  <div><strong>Protective Factors Identified:</strong> {ca.protectiveFactors}</div>
                  <div><strong>Therapist Clinical Notes:</strong> {ca.clinicalNotes}</div>
                  <div><strong>Interventions Deployed:</strong> {ca.intervention}</div>
                  <div><strong>Safety Verification Date:</strong> Follow-up verified on {ca.followUp} (Status: <strong>{ca.status}</strong>)</div>
                </div>
              ))}
            </div>

            {/* Safety Plan Form display */}
            <div className="mc-card" style={{ padding: '24px', borderTop: '4px solid var(--color-danger)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: '10px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-danger)' }}>10-Section Personal Crisis Safety Plan</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Review Due: {safetyPlan.reviewDate}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px' }}>
                <div>
                  <strong>1. Warning Signs & Suicidal Triggers:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    {safetyPlan.warningSigns.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>2. Internal Coping Strategies:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    {safetyPlan.copingStrategies.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>3. Social Supports (Internal & External):</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    {safetyPlan.supports.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>4. Emergency Crisis Contacts:</strong>
                  <div style={{ display: 'flex', gap: 10, marginTop: '4px' }}>
                    {safetyPlan.emergencyContacts.map((c, idx) => <span key={idx} style={{ padding: '3px 8px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: 4 }}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <strong>5. Safe Environment Restructuring:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    {safetyPlan.safeEnvironment.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <strong>6. Emergency Action Plan Checklist:</strong>
                  <p style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--color-danger)' }}>"{safetyPlan.emergencySteps}"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLINICAL TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="mc-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px' }}>Clinical Care Timeline</h3>
            <div style={{ borderLeft: '2px solid var(--border-primary)', marginLeft: 16, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {timelineEvents.map((event, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: -37, top: 2, width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--bg-secondary)', border: '2px solid var(--border-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'
                  }}>
                    {event.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{event.date}</span>
                    <h4 style={{ margin: '2px 0 4px 0', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{event.title}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ClientDetails;
