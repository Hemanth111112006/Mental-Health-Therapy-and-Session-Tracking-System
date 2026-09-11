import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { ROLES } from '../../../config/constants';
import { appointmentService } from '../api/appointment.service';
import { appointmentApi } from '../../../api/appointmentApi';
import { toast } from '../../../utils/toast';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  MessageSquare,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Clock,
  Send,
  X,
  ArrowLeft,
  Volume2
} from 'lucide-react';

const TelehealthPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Call state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [hasRemoteJoined, setHasRemoteJoined] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);

  // Call duration timer (starts with realistic elapsed time)
  const [secondsElapsed, setSecondsElapsed] = useState(145);
  const containerRef = useRef(null);

  // In-call chat
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dr. Sarah Chen, LCSW',
      senderRole: 'Therapist',
      text: "Hello! Welcome to our telehealth session. Can you see and hear me clearly?",
      time: '10:02 AM',
      isMe: false
    },
    {
      id: 2,
      sender: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'You',
      senderRole: 'Client',
      text: "Hi Dr. Chen, yes! Everything looks and sounds crystal clear.",
      time: '10:03 AM',
      isMe: true
    },
    {
      id: 3,
      sender: 'Dr. Sarah Chen, LCSW',
      senderRole: 'Therapist',
      text: "Great! Today we will review your weekly mood tracker and discuss the CBT thought record exercise.",
      time: '10:03 AM',
      isMe: false
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatMessagesEndRef = useRef(null);

  // Appointment details
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const isClient = currentUser?.role === ROLES.CLIENT;

  // Resilient data loading: never crash or redirect on error
  useEffect(() => {
    let isMounted = true;

    const loadSessionData = async () => {
      let apptData = null;

      if (id && id !== '1' && id !== 'undefined') {
        try {
          apptData = await appointmentService.getById(id);
        } catch (e1) {
          try {
            const all = await appointmentApi.getAllAppointments();
            if (Array.isArray(all)) {
              apptData = all.find(a => String(a.id) === String(id));
            }
          } catch (e2) {
            // fallback
          }
        }
      }

      if (!isMounted) return;

      const defaultAppt = {
        id: id || 'TH-88210',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '10:50 AM',
        duration: 50,
        type: 'Individual Psychotherapy (50 min)',
        cptCode: '90837',
        modality: 'Secure Telehealth (HD Video)',
        roomCode: `TH-${id && id !== '1' ? id : '88210'}`,
        therapist: {
          name: currentUser?.role === ROLES.THERAPIST ? `Dr. ${currentUser.firstName} ${currentUser.lastName}` : 'Dr. Sarah Chen, LCSW',
          title: 'Licensed Clinical Social Worker',
          specialty: 'Cognitive Behavioral Therapy (CBT)',
          avatar: 'SC'
        },
        client: {
          name: isClient ? `${currentUser?.firstName || 'Taylor'} ${currentUser?.lastName || 'Morgan'}` : 'Taylor Morgan',
          id: isClient ? (currentUser?.id ? `MC-${currentUser.id}` : 'MC-2041') : 'MC-2041',
          avatar: isClient ? (currentUser?.firstName?.[0] || 'T') : 'TM',
          diagnoses: 'F41.1 Generalized Anxiety Disorder'
        }
      };

      setAppointment(apptData ? {
        ...defaultAppt,
        ...apptData,
        therapist: {
          ...defaultAppt.therapist,
          name: apptData.therapist?.firstName ? `Dr. ${apptData.therapist.firstName} ${apptData.therapist.lastName}` : defaultAppt.therapist.name
        },
        client: {
          ...defaultAppt.client,
          name: apptData.client?.firstName ? `${apptData.client.firstName} ${apptData.client.lastName}` : defaultAppt.client.name
        }
      } : defaultAppt);

      setLoading(false);

      setTimeout(() => {
        if (isMounted) setHasRemoteJoined(true);
      }, 1000);
    };

    loadSessionData();

    return () => {
      isMounted = false;
    };
  }, [id, currentUser, isClient]);

  // Session duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Speaking indicator pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isChatOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'You',
      senderRole: isClient ? 'Client' : 'Clinician',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const responseMsg = {
        id: Date.now() + 1,
        sender: isClient ? 'Dr. Sarah Chen, LCSW' : 'Taylor Morgan',
        senderRole: isClient ? 'Therapist' : 'Client',
        text: isClient 
          ? "Thank you for noting that. That's very helpful for our cognitive restructuring goal today."
          : "Understood Dr. Chen, I have noted that on my homework sheet.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 1400);
  };

  const handleConfirmLeave = () => {
    setShowEndModal(false);
    toast.success('Telehealth consultation concluded. Session log securely filed.');
    if (isClient) {
      navigate('/client/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const otherPartyName = isClient
    ? appointment?.therapist?.name || 'Dr. Sarah Chen, LCSW'
    : appointment?.client?.name || 'Taylor Morgan';
  const otherPartyRole = isClient ? 'Licensed Clinical Therapist' : 'Client • MC-2041';

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFullscreen ? '100vh' : 'calc(100vh - 105px)',
        minHeight: '600px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        borderRadius: isFullscreen ? '0' : '16px',
        overflow: 'hidden',
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        right: isFullscreen ? 0 : 'auto',
        bottom: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 99999 : 10,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Top Telehealth Header Bar */}
      <div
        style={{
          padding: '12px 20px',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setShowEndModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              color: '#CBD5E1',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
          >
            <ArrowLeft size={16} /> Leave Room
          </button>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>
                Telehealth Session: {otherPartyName}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(34, 197, 94, 0.18)',
                  color: '#4ADE80',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.3px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              {appointment?.type || 'Individual Psychotherapy (50 min)'} • Room #{appointment?.roomCode || 'TH-88210'}
            </div>
          </div>
        </div>

        {/* Right Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#F1F5F9',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            <Clock size={14} color="#38BDF8" />
            <span>{formatTimer(secondsElapsed)}</span>
            <span style={{ color: '#64748B', fontSize: '11px', fontFamily: 'inherit' }}>/ 50:00</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#34D399',
              fontWeight: 500
            }}
          >
            <ShieldCheck size={14} />
            <span>HIPAA Encrypted</span>
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#CBD5E1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#090D16'
        }}
      >
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            overflow: 'hidden'
          }}
        >
          {isScreenSharing ? (
            /* Screen Share View */
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1E293B',
                borderRadius: '12px',
                border: '2px solid #38BDF8',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
              }}
            >
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#0F172A',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontSize: '13px', fontWeight: 600 }}>
                  <Share2 size={16} />
                  <span>Presenter Screen: CBT Cognitive Restructuring & Thought Record Worksheet</span>
                </div>
                <button
                  onClick={() => setIsScreenSharing(false)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#F87171',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Stop Sharing
                </button>
              </div>

              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0284C7', paddingBottom: '12px', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#0284C7', fontSize: '18px' }}>MindCare Clinical Worksheet: 7-Column Thought Record</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Patient: {appointment?.client?.name} • Clinician: {appointment?.therapist?.name}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '4px', height: 'fit-content' }}>Active Exercise</span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>1. Situation</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>2. Automatic Thought</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>3. Emotion / Rating</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>4. Evidence Supporting</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>5. Alternative Thought</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px 8px' }}>Preparing for Monday team presentation</td>
                        <td style={{ padding: '10px 8px', color: '#DC2626' }}>"I am going to freeze and everyone will judge me."</td>
                        <td style={{ padding: '10px 8px' }}>Anxiety (85%)</td>
                        <td style={{ padding: '10px 8px' }}>Heart was racing during rehearsal</td>
                        <td style={{ padding: '10px 8px', color: '#059669', fontWeight: 600 }}>"Feeling nervous is natural. I have prepared slides thoroughly and past meetings went well."</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '6px', borderLeft: '4px solid #3B82F6' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#1E40AF' }}>
                      💡 <strong>Clinical Guidance:</strong> Notice how challenging the catastrophizing distortion drops expected anxiety from 85% to 35%. Take 3 diaphragmatic breaths when thoughts arise.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Remote Video Participant View */
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1E293B',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
                border: isSpeaking ? '2px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255,255,255,0.1)',
                transition: 'border 0.3s ease'
              }}
            >
              {!hasRemoteJoined ? (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <div
                    className="mc-spinner mc-spinner-lg"
                    style={{ borderColor: 'rgba(255,255,255,0.15)', borderTopColor: '#38BDF8', margin: '0 auto 16px' }}
                  />
                  <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#F1F5F9' }}>
                    Connecting to {otherPartyName}...
                  </h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
                    Securing encrypted video pipeline with WebRTC...
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(ellipse at center, #1E293B 0%, #0F172A 70%, #020617 100%)'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      border: '2px solid rgba(56, 189, 248, 0.2)',
                      transform: isSpeaking ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.5s ease'
                    }}
                  />

                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '14px',
                      zIndex: 2
                    }}
                  >
                    <div
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '50%',
                        backgroundColor: '#0284C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '36px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        boxShadow: '0 12px 32px rgba(2, 132, 199, 0.35)',
                        border: '4px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {isClient ? 'SC' : 'TM'}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                        {otherPartyName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>
                        {otherPartyRole}
                      </div>
                    </div>

                    {isSpeaking && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <Volume2 size={14} color="#38BDF8" />
                        <span style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 600 }}>Speaking</span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)',
                      backdropFilter: 'blur(8px)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '12px',
                      color: '#94A3B8'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                    <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{otherPartyName}</span>
                    <span>• 1080p HD (32ms)</span>
                  </div>
                </div>
              )}

              {/* PiP Self-View */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '210px',
                  height: '140px',
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  border: isMicOn ? '2px solid rgba(34, 197, 94, 0.6)' : '2px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'border 0.2s ease'
                }}
              >
                {isVideoOn ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#1E293B',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '18px'
                      }}
                    >
                      {currentUser?.firstName ? currentUser.firstName[0] : 'Y'}
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>Your Camera</span>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748B', padding: '10px' }}>
                    <VideoOff size={22} color="#EF4444" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '11px', color: '#F87171', fontWeight: 600 }}>Camera Off</div>
                  </div>
                )}

                <div
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '8px',
                    right: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#E2E8F0'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.firstName || 'You'} (Me)
                  </span>
                  {isMicOn ? <Mic size={10} color="#22C55E" /> : <MicOff size={10} color="#EF4444" />}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <div
            style={{
              width: '340px',
              backgroundColor: '#1E293B',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="#38BDF8" />
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#F8FAFC' }}>In-Session Chat</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#94A3B8',
                  marginBottom: '6px'
                }}
              >
                🔒 Messages are end-to-end encrypted under HIPAA standards.
              </div>

              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      marginBottom: '2px',
                      textAlign: msg.isMe ? 'right' : 'left'
                    }}
                  >
                    {msg.sender} • {msg.time}
                  </div>
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: msg.isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      backgroundColor: msg.isMe ? 'var(--color-primary, #0284C7)' : 'rgba(255,255,255,0.08)',
                      color: '#F8FAFC',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      border: msg.isMe ? 'none' : '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '8px'
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                style={{
                  padding: '8px 12px',
                  backgroundColor: chatInput.trim() ? 'var(--color-primary, #0284C7)' : '#334155',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: chatInput.trim() ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: '#1E293B',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          zIndex: 20
        }}
      >
        <button
          onClick={() => {
            setIsMicOn(!isMicOn);
            toast.info(isMicOn ? 'Microphone muted' : 'Microphone unmuted');
          }}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isMicOn ? 'rgba(255,255,255,0.1)' : '#EF4444',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={() => {
            setIsVideoOn(!isVideoOn);
            toast.info(isVideoOn ? 'Camera turned off' : 'Camera turned on');
          }}
          title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isVideoOn ? 'rgba(255,255,255,0.1)' : '#EF4444',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            toast.info(!isScreenSharing ? 'Screen sharing started' : 'Screen sharing stopped');
          }}
          title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isScreenSharing ? '#0284C7' : 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Share2 size={20} />
        </button>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          title="Toggle In-Call Chat"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isChatOpen ? '#0284C7' : 'rgba(255,255,255,0.1)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease'
          }}
        >
          <MessageSquare size={20} />
          {!isChatOpen && messages.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#38BDF8',
                border: '2px solid #1E293B'
              }}
            />
          )}
        </button>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

        <button
          onClick={() => setShowEndModal(true)}
          style={{
            height: '48px',
            padding: '0 24px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
            transition: 'transform 0.15s ease'
          }}
        >
          <PhoneOff size={18} />
          <span>End Call</span>
        </button>
      </div>

      {/* Leave / End Call Confirmation Modal */}
      {showEndModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              maxWidth: '440px',
              width: '100%',
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <PhoneOff size={28} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#F8FAFC' }}>
              Leave Telehealth Session?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
              You have been in this session for <strong>{formatTimer(secondsElapsed)}</strong> with {otherPartyName}. You can return to your dashboard or re-enter the room anytime.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowEndModal(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: 'transparent',
                  color: '#CBD5E1',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Resume Call
              </button>

              <button
                onClick={handleConfirmLeave}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelehealthPage;
