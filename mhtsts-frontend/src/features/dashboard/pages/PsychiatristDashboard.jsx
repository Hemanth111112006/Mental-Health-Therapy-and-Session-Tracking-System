import { toast } from '../../../utils/toast';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

const PsychiatristDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({ client: '', med: '', dosage: '', instructions: '' });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDoctorDisplayName = () => {
    if (currentUser?.lastName && currentUser.lastName.trim() !== '') {
      return `Dr. ${currentUser.lastName}`;
    }
    if (currentUser?.firstName && currentUser.firstName.toLowerCase() !== 'psychiatrist' && currentUser.firstName !== 'User') {
      return `Dr. ${currentUser.firstName}`;
    }
    return 'Dr. Mark Rivera, MD';
  };

  const todaysSchedule = [
    { id: 1, time: '09:00 AM', client: 'Sarah Connor', type: 'Psychiatric Evaluation', modality: 'Telehealth', status: 'COMPLETED' },
    { id: 2, time: '10:30 AM', client: 'Morgan Davis', type: 'Medication Management', modality: 'In-Person', status: 'COMPLETED' },
    { id: 3, time: '01:00 PM', client: 'Jennifer Miller', type: 'Medication Management', modality: 'Telehealth', status: 'IN_PROGRESS' },
    { id: 4, time: '03:00 PM', client: 'Richard Rodriguez', type: 'Psychiatric Follow-up', modality: 'In-Person', status: 'SCHEDULED' },
  ];

  const [refills, setRefills] = useState([
    { id: 1, client: 'Jennifer Miller', med: 'Sertraline (Zoloft)', dosage: '100mg', lastRefill: '30 days ago', requestDate: 'Yesterday' },
    { id: 2, client: 'Morgan Davis', med: 'Aripiprazole (Abilify)', dosage: '5mg', lastRefill: '28 days ago', requestDate: 'Today' }
  ]);

  const clientMedicationDistribution = [
    { name: 'Antidepressants', count: 18 },
    { name: 'Anxiolytics', count: 12 },
    { name: 'Mood Stabilizers', count: 9 },
    { name: 'Stimulants', count: 6 },
    { name: 'Antipsychotics', count: 4 }
  ];

  const handleApproveRefill = (id, client, med) => {
    toast.success(`Refill approved for ${client} (${med}). Order routed to pharmacy.`);
    setRefills(prev => prev.filter(r => r.id !== id));
  };

  const handleDenyRefill = (id, client, med) => {
    toast.info(`Refill request denied for ${client} (${med}). Notification sent to client.`);
    setRefills(prev => prev.filter(r => r.id !== id));
  };

  const handleScheduleAction = (session) => {
    if (session.status === 'COMPLETED') {
      navigate(`/session-notes/new?client=${encodeURIComponent(session.client)}`);
    } else if (session.status === 'IN_PROGRESS') {
      toast.info(`Connecting to telehealth consultation with ${session.client}...`);
      navigate('/telehealth');
    } else {
      navigate('/psychiatrist/appointments');
    }
  };

  const handlePrescribeSubmit = (e) => {
    e.preventDefault();
    toast.success(`Prescription submitted: ${prescriptionForm.med} ${prescriptionForm.dosage} for client ${prescriptionForm.client}.`);
    setShowPrescriptionModal(false);
    setPrescriptionForm({ client: '', med: '', dosage: '', instructions: '' });
  };

  return (
    <div className="mc-dashboard">
      <div className="mc-dashboard-header">
        <div>
          <h1 className="mc-page-title">{getGreeting()}, {getDoctorDisplayName()}</h1>
          <p className="mc-page-subtitle">Psychiatric overview & medication management center.</p>
        </div>
        <div className="mc-dashboard-actions">
          <button className="mc-btn mc-btn-primary" onClick={() => setShowPrescriptionModal(true)}>
            <LocalHospitalOutlinedIcon style={{ fontSize: 18, marginRight: 6 }} /> New Prescription
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mc-grid-4">
        <div className="mc-stat-card primary">
          <div className="mc-stat-card-icon"><PeopleOutlinedIcon /></div>
          <div className="mc-stat-card-value">24</div>
          <div className="mc-stat-card-label">Active Patients</div>
        </div>
        <div className="mc-stat-card success">
          <div className="mc-stat-card-icon"><EventAvailableOutlinedIcon /></div>
          <div className="mc-stat-card-value">4</div>
          <div className="mc-stat-card-label">Today's Appointments</div>
        </div>
        <div className="mc-stat-card warning">
          <div className="mc-stat-card-icon"><LocalHospitalOutlinedIcon /></div>
          <div className="mc-stat-card-value">{refills.length}</div>
          <div className="mc-stat-card-label">Pending Refills</div>
        </div>
        <div className="mc-stat-card accent">
          <div className="mc-stat-card-icon"><WarningAmberOutlinedIcon /></div>
          <div className="mc-stat-card-value">0</div>
          <div className="mc-stat-card-label">Active Crisis Flags</div>
        </div>
      </div>

      <div className="mc-grid-2">
        {/* Today's Schedule */}
        <div className="mc-card">
          <div className="mc-card-header">
            <h3 className="mc-card-title">Today's Schedule</h3>
            <Link to="/psychiatrist/calendar" className="mc-btn mc-btn-ghost mc-btn-sm">View Calendar</Link>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {todaysSchedule.map((session, i) => (
                <div key={session.id} style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: i < todaysSchedule.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  background: session.status === 'IN_PROGRESS' ? 'var(--color-primary-50)' : 'transparent'
                }}>
                  <div style={{ width: 80, fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)' }}>
                    {session.time}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {session.client}
                      {session.modality === 'Telehealth' ? 
                        <VideocamOutlinedIcon style={{ fontSize: 16, color: 'var(--color-primary)' }} title="Telehealth" /> : 
                        <PersonOutlinedIcon style={{ fontSize: 16, color: 'var(--color-success)' }} title="In-Person" />
                      }
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{session.type}</div>
                  </div>
                  <div>
                    <span className={`mc-badge mc-badge-${session.status === 'COMPLETED' ? 'success' : (session.status === 'IN_PROGRESS' ? 'active' : 'default')}`}>
                      {session.status}
                    </span>
                  </div>
                  <div>
                    <button 
                      className="mc-btn mc-btn-outline mc-btn-sm"
                      onClick={() => handleScheduleAction(session)}
                    >
                      {session.status === 'COMPLETED' ? 'Edit Note' : (session.status === 'IN_PROGRESS' ? 'Join Call' : 'Manage')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Refills */}
        <div className="mc-card" style={{ borderTop: '4px solid var(--color-warning)' }}>
          <div className="mc-card-header">
            <h3 className="mc-card-title">Pending Prescription Refills</h3>
            <span className="mc-badge mc-badge-warning">{refills.length}</span>
          </div>
          <div className="mc-card-content" style={{ padding: 0 }}>
            {refills.length === 0 ? (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                All prescription refills have been reviewed.
              </div>
            ) : (
              refills.map((refill, i) => (
                <div key={refill.id} style={{ 
                  padding: 'var(--space-4)', 
                  borderBottom: i < refills.length - 1 ? '1px solid var(--border-primary)' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>{refill.client}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      Requesting: <strong>{refill.med} {refill.dosage}</strong>
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      Requested {refill.requestDate} • Last Refill: {refill.lastRefill}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button 
                      className="mc-btn mc-btn-primary mc-btn-sm" 
                      onClick={() => handleApproveRefill(refill.id, refill.client, refill.med)}
                    >
                      Approve
                    </button>
                    <button 
                      className="mc-btn mc-btn-ghost mc-btn-sm" 
                      style={{ color: 'var(--color-danger)' }} 
                      onClick={() => handleDenyRefill(refill.id, refill.client, refill.med)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Medication analytics chart */}
      <div className="mc-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="mc-card-header">
          <h3 className="mc-card-title">Caseload Pharmacotherapy Breakdown</h3>
        </div>
        <div className="mc-card-content" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientMedicationDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} name="Active Prescriptions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="mc-modal-overlay" style={{ zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="mc-card" style={{ width: 480, margin: 'var(--space-4)', boxShadow: 'var(--shadow-xl)', animation: 'slideIn 0.3s ease' }}>
            <div className="mc-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="mc-card-title">New Prescription</h3>
              <button className="mc-btn mc-btn-ghost" onClick={() => setShowPrescriptionModal(false)} style={{ fontSize: 20 }}>&times;</button>
            </div>
            <form onSubmit={handlePrescribeSubmit} style={{ padding: 'var(--space-4)' }}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>Select Patient</label>
                <select 
                  className="mc-form-select form-select" 
                  required 
                  value={prescriptionForm.client} 
                  onChange={e => setPrescriptionForm({...prescriptionForm, client: e.target.value})}
                >
                  <option value="">Choose a patient...</option>
                  <option value="Sarah Connor">Sarah Connor (MC-3021)</option>
                  <option value="Morgan Davis">Morgan Davis (MC-2788)</option>
                  <option value="Jennifer Miller">Jennifer Miller (MC-3104)</option>
                  <option value="Richard Rodriguez">Richard Rodriguez (MC-2956)</option>
                  <option value="Sophia Davis">Sophia Davis (MC-1045)</option>
                  <option value="Jordan Taylor">Jordan Taylor (MC-1887)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 500 }}>Medication Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Sertraline" 
                  required 
                  value={prescriptionForm.med} 
                  onChange={e => setPrescriptionForm({...prescriptionForm, med: e.target.value})}
                />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label" style={{ fontWeight: 500 }}>Dosage</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., 50mg" 
                    required 
                    value={prescriptionForm.dosage} 
                    onChange={e => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: 500 }}>Sig (Instructions)</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Take 1 tablet by mouth daily in the morning..." 
                  required
                  value={prescriptionForm.instructions} 
                  onChange={e => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="mc-btn mc-btn-outline" onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
                <button type="submit" className="mc-btn mc-btn-primary">Submit Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychiatristDashboard;






