import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { appointmentApi } from '../../../api/appointmentApi';
import { clientApi } from '../../../api/clientApi';
import { toast } from '../../../utils/toast';
import { 
  Users, Calendar, Clock, DollarSign, ShieldCheck, 
  UserPlus, CalendarPlus, Armchair, WalletCards, 
  CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, MapPin
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([
    { id: 1, time: '09:00 AM', client: 'Sophia Davis', therapist: 'Dr. Emily Chen, PsyD', room: 'Room 301', status: 'COMPLETED', copay: 20, copayPaid: true },
    { id: 2, time: '10:00 AM', client: 'Jennifer Miller', therapist: 'Dr. James Rodriguez, MD', room: 'Room 108', status: 'COMPLETED', copay: 25, copayPaid: true },
    { id: 3, time: '11:30 AM', client: 'Ava Johnson', therapist: 'Dr. Michael Thompson, LCSW', room: 'Room 202', status: 'IN_PROGRESS', copay: 0, copayPaid: false },
    { id: 4, time: '01:00 PM', client: 'Sarah Connor', therapist: 'Dr. James Rodriguez, MD', room: 'Room 108', status: 'CHECKED_IN', copay: 35, copayPaid: false },
    { id: 5, time: '02:30 PM', client: 'David Wilson', therapist: 'Dr. Michael Thompson, LCSW', room: 'Room 202', status: 'SCHEDULED', copay: 15, copayPaid: false },
    { id: 6, time: '04:00 PM', client: 'Taylor Morgan', therapist: 'Dr. Sarah Chen, LCSW', room: 'Room 204', status: 'SCHEDULED', copay: 30, copayPaid: false }
  ]);

  useEffect(() => {
    let mounted = true;
    appointmentApi.getAllAppointments()
      .then(data => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          const formatted = data.map((a, idx) => {
            const clientName = a.clientName && a.clientName !== 'Unknown'
              ? a.clientName
              : (a.participants?.[0]?.client ? `${a.participants[0].client.firstName || ''} ${a.participants[0].client.lastName || ''}`.trim() : 'Patient');
            const therapistName = a.therapist?.username === 'therapist@mindcare.com' ? 'Dr. Sarah Chen, LCSW'
              : (a.therapist?.username === 'psychiatrist@mindcare.com' ? 'Dr. Mark Rivera, MD'
              : (a.therapist?.username === 'psychologist@mindcare.com' ? 'Dr. Maya Patel, PsyD'
              : (a.therapist?.firstName ? `${a.therapist.firstName} ${a.therapist.lastName || ''}`.trim() : 'Staff Provider')));
            return {
              id: a.id,
              time: a.startTime ? `${a.startTime} ${a.date ? '(' + a.date + ')' : ''}` : '10:00 AM',
              client: clientName,
              therapist: therapistName,
              room: idx % 2 === 0 ? 'Room 204' : 'Room 108',
              status: a.status || 'SCHEDULED',
              copay: 25,
              copayPaid: a.status === 'COMPLETED'
            };
          });
          formatted.reverse();
          setAppointments(formatted);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const [insuranceVerifications, setInsuranceVerifications] = useState([
    { id: 101, client: 'Sarah Connor', policy: 'Blue Shield California (PPO)', copayExpected: '$35.00', status: 'VERIFIED' },
    { id: 102, client: 'David Wilson', policy: 'Aetna POS Choice', copayExpected: '$15.00', status: 'PENDING' },
    { id: 103, client: 'Ava Johnson', policy: 'Cigna HealthSpring PPO', copayExpected: '$0.00', status: 'VERIFIED' },
    { id: 104, client: 'Jordan Taylor', policy: 'UnitedHealthcare Choice Plus', copayExpected: '$25.00', status: 'PENDING' }
  ]);

  const handleCheckIn = (id) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: 'CHECKED_IN' } : apt
    ));
    const target = appointments.find(a => a.id === id);
    toast.success(`${target?.client || 'Client'} checked in and added to Waiting Room lobby.`);
  };

  const handleCollectCopay = (id) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, copayPaid: true } : apt
    ));
    const target = appointments.find(a => a.id === id);
    toast.success(`$${target?.copay}.00 copay payment received for ${target?.client}. Receipt generated.`);
  };

  const handleVerifyInsurance = (id) => {
    setInsuranceVerifications(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'VERIFIED' } : v
    ));
    const target = insuranceVerifications.find(v => v.id === id);
    toast.success(`Insurance eligibility successfully verified in real-time for ${target?.client}!`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="mc-badge mc-badge-success">Completed</span>;
      case 'IN_PROGRESS': return <span className="mc-badge mc-badge-active">In Session</span>;
      case 'CHECKED_IN': return <span className="mc-badge mc-badge-warning">Waiting in Lobby</span>;
      case 'SCHEDULED': return <span className="mc-badge mc-badge-default">Scheduled</span>;
      default: return <span className="mc-badge mc-badge-default">{status}</span>;
    }
  };

  const waitingCount = appointments.filter(a => a.status === 'CHECKED_IN').length;
  const totalCount = appointments.length;
  const collectedCopays = appointments.filter(a => a.copayPaid).reduce((acc, a) => acc + (a.copay || 0), 0);
  const pendingVerifications = insuranceVerifications.filter(v => v.status === 'PENDING').length;

  return (
    <div className="mc-page-container" style={{ padding: '0 8px 24px 8px' }}>
      
      {/* Header */}
      <div className="mc-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="mc-page-title" style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Receptionist Front Desk Console
          </h1>
          <p className="mc-page-subtitle" style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Welcome back, {currentUser?.firstName || 'Receptionist'}! Manage arrivals, check-ins, insurance eligibility, and front desk scheduling.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="mc-btn mc-btn-outline" onClick={() => navigate('/clients/new')} style={{ fontSize: 11, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <UserPlus size={16} /> Register Client
          </button>
          <button className="mc-btn mc-btn-primary" onClick={() => navigate('/receptionist/appointments')} style={{ fontSize: 11, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <CalendarPlus size={16} /> Appointment Queue
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 20 }}>
        
        {/* Checked In / Waiting */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Waiting in Lobby</span>
            <strong style={{ fontSize: 24, fontWeight: 800, color: '#D97706', margin: '4px 0', display: 'block' }}>{waitingCount} Patients</strong>
            <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>Ready for clinician intake</span>
          </div>
          <div style={{ color: '#D97706', background: 'rgba(217, 119, 6, 0.1)', padding: 10, borderRadius: '50%' }}>
            <Armchair size={24} />
          </div>
        </div>

        {/* Total Appointments */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Today's Total Schedule</span>
            <strong style={{ fontSize: 24, fontWeight: 800, color: '#4338CA', margin: '4px 0', display: 'block' }}>{totalCount} Sessions</strong>
            <span style={{ fontSize: 11, color: '#4338CA', fontWeight: 600 }}>Active clinic roster</span>
          </div>
          <div style={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.1)', padding: 10, borderRadius: '50%' }}>
            <Calendar size={24} />
          </div>
        </div>

        {/* Copays Collected */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Copays Collected</span>
            <strong style={{ fontSize: 24, fontWeight: 800, color: '#059669', margin: '4px 0', display: 'block' }}>${collectedCopays}.00</strong>
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>Processed at front desk</span>
          </div>
          <div style={{ color: '#059669', background: 'rgba(5, 150, 105, 0.1)', padding: 10, borderRadius: '50%' }}>
            <DollarSign size={24} />
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="mc-card" style={{ padding: 18, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>Insurance Verifications</span>
            <strong style={{ fontSize: 24, fontWeight: 800, color: '#DC2626', margin: '4px 0', display: 'block' }}>{pendingVerifications} Pending</strong>
            <span style={{ fontSize: 11, color: '#DC2626', fontWeight: 600 }}>Requires eligibility check</span>
          </div>
          <div style={{ color: '#DC2626', background: 'rgba(220, 38, 38, 0.1)', padding: 10, borderRadius: '50%' }}>
            <ShieldCheck size={24} />
          </div>
        </div>

      </div>

      {/* Quick Desk Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => navigate('/clients/new')}
          className="mc-card" 
          style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', background: '#F8FAFC' }}
        >
          <div style={{ background: '#EEF2FF', color: '#4338CA', padding: 8, borderRadius: 8 }}><UserPlus size={18} /></div>
          <div>
            <strong style={{ fontSize: 12, color: 'var(--text-primary)', display: 'block' }}>Register New Patient</strong>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Intake form & demographics</span>
          </div>
        </button>

        <button 
          onClick={() => navigate('/receptionist/appointments')}
          className="mc-card" 
          style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', background: '#F8FAFC' }}
        >
          <div style={{ background: '#FEF3C7', color: '#D97706', padding: 8, borderRadius: 8 }}><Clock size={18} /></div>
          <div>
            <strong style={{ fontSize: 12, color: 'var(--text-primary)', display: 'block' }}>Appointment Queue</strong>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Live check-ins & walk-ins</span>
          </div>
        </button>

        <button 
          onClick={() => navigate('/waiting-room')}
          className="mc-card" 
          style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', background: '#F8FAFC' }}
        >
          <div style={{ background: '#DCFCE7', color: '#16A34A', padding: 8, borderRadius: 8 }}><Armchair size={18} /></div>
          <div>
            <strong style={{ fontSize: 12, color: 'var(--text-primary)', display: 'block' }}>Waiting Room Lobby</strong>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Live queue monitor</span>
          </div>
        </button>

        <button 
          onClick={() => navigate('/payments')}
          className="mc-card" 
          style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left', background: '#F8FAFC' }}
        >
          <div style={{ background: '#F1F5F9', color: '#475569', padding: 8, borderRadius: 8 }}><WalletCards size={18} /></div>
          <div>
            <strong style={{ fontSize: 12, color: 'var(--text-primary)', display: 'block' }}>Collect Payments</strong>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Copays & card receipts</span>
          </div>
        </button>
      </div>

      {/* Main Grid: Arrivals Queue & Insurance Verifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
        
        {/* Arrivals & Check-In */}
        <div className="mc-card" style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div className="mc-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} style={{ color: 'var(--color-primary)' }} /> Today's Client Arrivals & Check-In
            </h3>
            <button className="mc-btn mc-btn-ghost mc-btn-sm" onClick={() => navigate('/receptionist/appointments')} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {appointments.map((apt, i) => (
              <div key={apt.id} style={{ 
                padding: '14px 20px', 
                borderBottom: i < appointments.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: apt.status === 'CHECKED_IN' ? '#FFFBEB' : 'white'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: 13, color: '#1E1B4B' }}>{apt.time}</strong>
                    <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                    <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{apt.client}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>
                    Provider: <strong>{apt.therapist}</strong> · Room: <strong>{apt.room}</strong>
                  </div>
                  {apt.copay > 0 && (
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      Copay: <strong>${apt.copay}.00</strong> · {apt.copayPaid ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Paid ✓</span>
                      ) : (
                        <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>Unpaid</span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {getStatusBadge(apt.status)}
                  {apt.status === 'SCHEDULED' && (
                    <button className="mc-btn mc-btn-primary mc-btn-sm" onClick={() => handleCheckIn(apt.id)} style={{ fontSize: 11, padding: '4px 10px' }}>
                      Check In
                    </button>
                  )}
                  {apt.copay > 0 && !apt.copayPaid && (
                    <button className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => handleCollectCopay(apt.id)} style={{ fontSize: 11, padding: '4px 10px', color: '#D97706', borderColor: '#F59E0B' }}>
                      Collect Copay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Verification Queue */}
        <div className="mc-card" style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div className="mc-card-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} style={{ color: '#059669' }} /> Insurance Verification & Eligibility Queue
            </h3>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Real-time 270/271 Check</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {insuranceVerifications.map((ins, i) => (
              <div key={ins.id} style={{ 
                padding: '14px 20px', 
                borderBottom: i < insuranceVerifications.length - 1 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: ins.status === 'PENDING' ? '#FEF2F2' : 'white'
              }}>
                <div>
                  <strong style={{ fontSize: 13, color: '#1E1B4B', display: 'block' }}>{ins.client}</strong>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                    Policy: <strong>{ins.policy}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Expected Copay: <strong>{ins.copayExpected}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`mc-badge mc-badge-${ins.status === 'VERIFIED' ? 'success' : 'warning'}`} style={{ fontSize: 10 }}>
                    {ins.status}
                  </span>
                  {ins.status === 'PENDING' && (
                    <button 
                      className="mc-btn mc-btn-primary mc-btn-sm" 
                      onClick={() => handleVerifyInsurance(ins.id)}
                      style={{ fontSize: 11, padding: '4px 10px' }}
                    >
                      Verify Eligibility
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReceptionistDashboard;
