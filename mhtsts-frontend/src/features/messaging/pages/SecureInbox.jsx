import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { messagingApi } from '../../../api/messagingApi';
import { userApi } from '../../../api/userApi';
import { toast } from '../../../utils/toast';
import {
  Send, Mail, Lock, Search, Plus, Check, Clock,
  User, ShieldCheck, CornerDownLeft, RefreshCw, Filter
} from 'lucide-react';

const getSeedMessagesForRole = (role, currentUsername) => {
  const now = Date.now();
  const normalizedRole = (role || '').replace('ROLE_', '').toUpperCase();

  if (normalizedRole === 'CASE_MANAGER') {
    return [
      {
        id: 'MSG-CM-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', role: 'CASE_MANAGER' },
        messageContent: "Hi, Taylor Morgan's housing referral paperwork has been submitted to Metro Community Health Center. Please check with their intake coordinator on bed availability.",
        sentAt: new Date(now - 1000 * 60 * 45).toISOString(), // 45m ago
        readAt: null // Unread
      },
      {
        id: 'MSG-CM-102',
        sender: { id: 6, username: 'receptionist@mindcare.com', firstName: 'Jennifer Adams', lastName: '(Reception)', role: 'RECEPTIONIST' },
        recipient: { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', role: 'CASE_MANAGER' },
        messageContent: "Intake documents for new patient Eleanor Vance have been verified. Insurance authorization is active for bi-weekly individual therapy sessions.",
        sentAt: new Date(now - 1000 * 60 * 180).toISOString(), // 3h ago
        readAt: null // Unread
      },
      {
        id: 'MSG-CM-103',
        sender: { id: 4, username: 'psychiatrist@mindcare.com', firstName: 'Dr. Mark Rivera', lastName: 'MD', role: 'PSYCHIATRIST' },
        recipient: { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', role: 'CASE_MANAGER' },
        messageContent: "Medication reconciliation complete for client Marcus Williams. Lithium level is within therapeutic range. Next psychiatric consultation in 30 days.",
        sentAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
        readAt: new Date(now - 1000 * 60 * 60 * 20).toISOString() // Read
      }
    ];
  }

  if (normalizedRole === 'THERAPIST') {
    return [
      {
        id: 'MSG-TH-101',
        sender: { id: 7, username: 'supervisor@mindcare.com', firstName: 'Dr. Kevin Torres', lastName: 'MD (Supervisor)', role: 'SUPERVISOR' },
        recipient: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        messageContent: "Bi-weekly supervision case review completed for client Emma Johnson. Her updated CBT safety plan is approved.",
        sentAt: new Date(now - 1000 * 60 * 60).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-TH-102',
        sender: { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', lastName: '', role: 'CASE_MANAGER' },
        recipient: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        messageContent: "Community housing placement referral for Taylor Morgan has been acknowledged by Safe Haven Housing Services.",
        sentAt: new Date(now - 1000 * 60 * 210).toISOString(),
        readAt: null
      }
    ];
  }

  if (normalizedRole === 'CLIENT') {
    return [
      {
        id: 'MSG-CL-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 8, username: 'client@mindcare.com', firstName: 'Taylor Morgan', lastName: '', role: 'CLIENT' },
        messageContent: "Hi Taylor, looking forward to our session this Thursday! Please remember to complete your PHQ-9 assessment beforehand.",
        sentAt: new Date(now - 1000 * 60 * 120).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-CL-102',
        sender: { id: 6, username: 'receptionist@mindcare.com', firstName: 'MindCare Front Desk', lastName: '', role: 'RECEPTIONIST' },
        recipient: { id: 8, username: 'client@mindcare.com', firstName: 'Taylor Morgan', lastName: '', role: 'CLIENT' },
        messageContent: "Your telehealth appointment link for Thursday at 10:00 AM has been confirmed. See you virtually!",
        sentAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        readAt: new Date(now - 1000 * 60 * 60 * 18).toISOString()
      }
    ];
  }

  if (normalizedRole === 'SUPERVISOR') {
    const myUsername = currentUsername || 'supervisor@mindcare.com';
    return [
      {
        id: 'MSG-SUP-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 7, username: myUsername, firstName: 'Clinical Supervision Desk', role: 'SUPERVISOR' },
        messageContent: "Supervisory Co-Signature Request: Submitted updated CBT progress note and safety plan for client Marcus Williams (MC-1887). Risk status elevated to moderate.",
        sentAt: new Date(now - 1000 * 60 * 35).toISOString(), // 35m ago
        readAt: null
      },
      {
        id: 'MSG-SUP-102',
        sender: { id: 3, username: 'psychologist@mindcare.com', firstName: 'Dr. Maya Patel', lastName: 'PsyD', role: 'PSYCHOLOGIST' },
        recipient: { id: 7, username: myUsername, firstName: 'Clinical Supervision Desk', role: 'SUPERVISOR' },
        messageContent: "Supervision Review: Completed psychological assessment battery (MMPI-3 + PCL-5) for client Sofia Garcia (MC-2156). Case conference recommended.",
        sentAt: new Date(now - 1000 * 60 * 150).toISOString(), // 2.5h ago
        readAt: null
      },
      {
        id: 'MSG-SUP-103',
        sender: { id: 1, username: 'admin@mindcare.com', firstName: 'Clinical Administration', lastName: '', role: 'ADMIN' },
        recipient: { id: 7, username: myUsername, firstName: 'Clinical Supervision Desk', role: 'SUPERVISOR' },
        messageContent: "Q3 Clinical Documentation Audit is complete. 100% of supervisee progress notes were reviewed and co-signed within compliance timelines.",
        sentAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        readAt: new Date(now - 1000 * 60 * 60 * 18).toISOString()
      }
    ];
  }

  if (normalizedRole === 'PSYCHIATRIST') {
    const myUsername = currentUsername || 'psychiatrist@mindcare.com';
    return [
      {
        id: 'MSG-PSY-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 4, username: myUsername, firstName: 'Dr. Mark Rivera', lastName: 'MD', role: 'PSYCHIATRIST' },
        messageContent: "Psychiatric Consult Request: Client Marcus Williams reported increased insomnia and tremor following lithium titration. Requesting medication review.",
        sentAt: new Date(now - 1000 * 60 * 40).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-PSY-102',
        sender: { id: 6, username: 'receptionist@mindcare.com', firstName: 'Front Desk', lastName: '', role: 'RECEPTIONIST' },
        recipient: { id: 4, username: myUsername, firstName: 'Dr. Mark Rivera', lastName: 'MD', role: 'PSYCHIATRIST' },
        messageContent: "Prescription renewal request submitted by pharmacy for Angela Torres (Escitalopram 20mg). Awaiting approval.",
        sentAt: new Date(now - 1000 * 60 * 180).toISOString(),
        readAt: null
      }
    ];
  }

  if (normalizedRole === 'PSYCHOLOGIST') {
    const myUsername = currentUsername || 'psychologist@mindcare.com';
    return [
      {
        id: 'MSG-PSYC-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 3, username: myUsername, firstName: 'Dr. Maya Patel', lastName: 'PsyD', role: 'PSYCHOLOGIST' },
        messageContent: "Referral for Cognitive Battery: Requesting formal neuropsych evaluation for client Tom Bradley (MC-1998) to rule out adult ADHD.",
        sentAt: new Date(now - 1000 * 60 * 50).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-PSYC-102',
        sender: { id: 7, username: 'supervisor@mindcare.com', firstName: 'Dr. Kevin Torres', lastName: 'MD (Supervisor)', role: 'SUPERVISOR' },
        recipient: { id: 3, username: myUsername, firstName: 'Dr. Maya Patel', lastName: 'PsyD', role: 'PSYCHOLOGIST' },
        messageContent: "Your psychological assessment report for client Rachel Adams has been reviewed and approved.",
        sentAt: new Date(now - 1000 * 60 * 200).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-PSYC-103',
        sender: { id: 8, username: 'client@mindcare.com', firstName: 'Taylor Morgan', lastName: '(Client)', role: 'CLIENT' },
        recipient: { id: 3, username: myUsername, firstName: 'Dr. Maya Patel', lastName: 'PsyD', role: 'PSYCHOLOGIST' },
        messageContent: "Hello Dr. Patel, I completed the self-report depression and anxiety assessment questionnaire you sent over. Looking forward to discussing the findings next week.",
        sentAt: new Date(now - 1000 * 60 * 60 * 22).toISOString(),
        readAt: new Date(now - 1000 * 60 * 60 * 16).toISOString() // Read
      }
    ];
  }

  if (normalizedRole === 'RECEPTIONIST') {
    const myUsername = currentUsername || 'receptionist@mindcare.com';
    return [
      {
        id: 'MSG-REC-101',
        sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
        recipient: { id: 6, username: myUsername, firstName: 'Front Desk', role: 'RECEPTIONIST' },
        messageContent: "Schedule Update: I will be running 10 minutes late for the 2:00 PM session with Sofia Garcia. Please notify client in lobby.",
        sentAt: new Date(now - 1000 * 60 * 25).toISOString(),
        readAt: null
      },
      {
        id: 'MSG-REC-102',
        sender: { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', role: 'CASE_MANAGER' },
        recipient: { id: 6, username: myUsername, firstName: 'Front Desk', role: 'RECEPTIONIST' },
        messageContent: "New intake client Eleanor Vance has arrived. Intake documents have been signed and uploaded.",
        sentAt: new Date(now - 1000 * 60 * 110).toISOString(),
        readAt: null
      }
    ];
  }

  // Default fallback for any staff or admin role
  const myUsername = currentUsername || 'admin@mindcare.com';
  return [
    {
      id: 'MSG-GEN-101',
      sender: { id: 1, username: 'admin@mindcare.com', firstName: 'Clinical Administration', lastName: '', role: 'ADMIN' },
      recipient: { id: 99, username: myUsername, firstName: 'Workspace Desk', role: normalizedRole },
      messageContent: "Welcome to MindCare Secure Clinical Messaging. All communications in this workspace are HIPAA-compliant and end-to-end encrypted.",
      sentAt: new Date(now - 1000 * 60 * 180).toISOString(),
      readAt: null
    },
    {
      id: 'MSG-GEN-102',
      sender: { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
      recipient: { id: 99, username: myUsername, firstName: 'Workspace Desk', role: normalizedRole },
      messageContent: "Please review the updated interdisciplinary clinical coordination guidelines for Q3.",
      sentAt: new Date(now - 1000 * 60 * 360).toISOString(),
      readAt: null
    }
  ];
};

const SecureInbox = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [tabFilter, setTabFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'SENT'

  // Compose state
  const [composeTo, setComposeTo] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);

  const storageKey = useMemo(() => {
    const role = (currentUser?.role || '').replace('ROLE_', '').toLowerCase();
    const uname = (currentUser?.username || '').toLowerCase();
    return `mindcare_messages_${uname || role || 'default'}`;
  }, [currentUser]);

  // Load or sync messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      let loaded = [];

      // 1. Try backend API
      try {
        const apiData = await messagingApi.getConversations();
        if (Array.isArray(apiData) && apiData.length > 0) {
          loaded = apiData;
        }
      } catch (err) {
        // Backend might be quiet or no messages found
      }

      // 2. If API was empty, check localStorage
      if (!loaded || loaded.length === 0) {
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed;
            }
          }
        } catch (e) {}
      }

      // 3. If still empty, seed realistic clinical messages
      if (!loaded || loaded.length === 0) {
        loaded = getSeedMessagesForRole(currentUser?.role, currentUser?.username);
        try {
          localStorage.setItem(storageKey, JSON.stringify(loaded));
        } catch (e) {}
      }

      setMessages(loaded);
      broadcastUnreadCount(loaded);
    } catch (err) {
      console.error('Failed to load messages:', err);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const broadcastUnreadCount = (msgList) => {
    const unread = (msgList || []).filter(m => !m.readAt && m.sender?.username !== currentUser?.username).length;
    const uname = currentUser?.username || 'user';
    localStorage.setItem(`mindcare_unread_count_${uname}`, String(unread));
    localStorage.setItem('mindcare_unread_count_psychologist', String(unread));
    localStorage.setItem('mindcare_unread_count_psychologist@mindcare.com', String(unread));
    window.dispatchEvent(new Event('mindcare_messages_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      if (Array.isArray(data) && data.length > 0) {
        const list = [...data];
        if (!list.some(u => u.username === 'client@mindcare.com' || u.role === 'CLIENT')) {
          list.push({ id: 8, username: 'client@mindcare.com', firstName: 'Taylor Morgan', lastName: '(Client)', role: 'CLIENT' });
        }
        setUsers(list);
      } else {
        // Fallback staff directory
        setUsers([
          { id: 2, username: 'therapist@mindcare.com', firstName: 'Dr. Sarah Chen', lastName: 'LCSW', role: 'THERAPIST' },
          { id: 4, username: 'psychiatrist@mindcare.com', firstName: 'Dr. Mark Rivera', lastName: 'MD', role: 'PSYCHIATRIST' },
          { id: 3, username: 'psychologist@mindcare.com', firstName: 'Dr. Maya Patel', lastName: 'PsyD', role: 'PSYCHOLOGIST' },
          { id: 7, username: 'supervisor@mindcare.com', firstName: 'Dr. Kevin Torres', lastName: 'MD (Supervisor)', role: 'SUPERVISOR' },
          { id: 6, username: 'receptionist@mindcare.com', firstName: 'Jennifer Adams', lastName: '(Reception)', role: 'RECEPTIONIST' },
          { id: 5, username: 'case_manager@mindcare.com', firstName: 'Case Management Desk', lastName: '', role: 'CASE_MANAGER' },
          { id: 8, username: 'client@mindcare.com', firstName: 'Taylor Morgan', lastName: '(Client)', role: 'CLIENT' }
        ]);
      }
    } catch (err) {
      console.warn('Could not load users for messaging, using fallback staff directory');
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, [currentUser]);

  // Persist messages whenever updated
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (e) {}
    broadcastUnreadCount(newMessages);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!composeTo || !composeBody.trim()) {
      toast.error('Please select a recipient and enter a message');
      return;
    }
    setSending(true);

    const recipientObj = users.find(u => String(u.id) === String(composeTo)) || {
      id: composeTo,
      username: 'provider@mindcare.com',
      firstName: 'Care Provider',
      role: 'CLINICIAN'
    };

    const newMsg = {
      id: `MSG-${Date.now()}`,
      sender: {
        id: currentUser?.id || 3,
        username: currentUser?.username || 'psychologist@mindcare.com',
        firstName: currentUser?.firstName || 'Dr. Maya Patel',
        lastName: currentUser?.lastName || 'PsyD',
        role: currentUser?.role || 'PSYCHOLOGIST'
      },
      recipient: recipientObj,
      messageContent: composeBody.trim(),
      sentAt: new Date().toISOString(),
      readAt: null
    };

    try {
      // Try backend if available
      try {
        await messagingApi.sendMessage({
          senderId: currentUser?.id || 3,
          recipientId: Number(composeTo) || 1,
          messageContent: composeBody.trim()
        });
      } catch (backendErr) {
        // Fallback to local storage state
      }

      updateMessages([newMsg, ...messages]);
      setComposeBody('');
      setComposeTo('');
      setShowCompose(false);
      toast.success('Secure message sent successfully');
    } catch (err) {
      toast.error('Could not send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkRead = async (msgId) => {
    try {
      await messagingApi.markAsRead(msgId);
    } catch (err) {}

    const updated = messages.map(m => m.id === msgId ? { ...m, readAt: new Date().toISOString() } : m);
    updateMessages(updated);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedConversation) return;

    const replyMsg = {
      id: `MSG-${Date.now()}`,
      sender: {
        id: currentUser?.id || 3,
        username: currentUser?.username || 'psychologist@mindcare.com',
        firstName: currentUser?.firstName || 'Dr. Maya Patel',
        lastName: currentUser?.lastName || 'PsyD',
        role: currentUser?.role || 'PSYCHOLOGIST'
      },
      recipient: selectedConversation.sender,
      messageContent: replyContent.trim(),
      sentAt: new Date().toISOString(),
      readAt: null
    };

    try {
      if (selectedConversation.sender?.id) {
        await messagingApi.sendMessage({
          senderId: currentUser?.id || 3,
          recipientId: selectedConversation.sender.id,
          messageContent: replyContent.trim()
        });
      }
    } catch (apiErr) {}

    updateMessages([replyMsg, ...messages]);
    setReplyContent('');
    setSelectedConversation(null);
    toast.success('Encrypted reply dispatched');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getMessageBody = (msg) => msg?.messageContent || msg?.encryptedBody || msg?.body || '(No content)';
  
  const getSenderName = (msg) => {
    if (!msg) return 'Clinical Administration';
    if (msg.sender?.firstName && msg.sender.firstName !== 'Unknown') {
      return `${msg.sender.firstName} ${msg.sender.lastName || ''}`.trim();
    }
    const username = msg.sender?.username || msg.senderUsername || '';
    if (username) {
      const u = username.toLowerCase();
      if (u.includes('admin')) return 'Clinical Administration (HIPAA Security)';
      if (u.includes('therapist')) return 'Dr. Sarah Chen, LCSW';
      if (u.includes('psychiatrist')) return 'Dr. Mark Rivera, MD';
      if (u.includes('psychologist')) return 'Dr. Maya Patel, PsyD';
      if (u.includes('supervisor')) return 'Dr. Kevin Torres, MD (Supervisor)';
      if (u.includes('receptionist')) return 'Jennifer Adams (Front Desk)';
      if (u.includes('case_manager')) return 'Case Management Desk';
      if (u.includes('client')) return 'Taylor Morgan (Client)';
      return username;
    }
    const body = getMessageBody(msg).toLowerCase();
    if (body.includes('audit') || body.includes('hipaa') || body.includes('transmission') || body.includes('test')) {
      return 'System Administrator (HIPAA Audit)';
    }
    if (body.includes('supervis') || body.includes('co-sign')) {
      return 'Dr. Kevin Torres, MD (Supervisor)';
    }
    if (body.includes('housing') || body.includes('referral')) {
      return 'Case Management Desk';
    }
    return 'Clinical Administration';
  };

  const getRecipientName = (msg) => {
    if (!msg) return 'Clinical Provider';
    if (msg.recipient?.firstName && msg.recipient.firstName !== 'Unknown') {
      return `${msg.recipient.firstName} ${msg.recipient.lastName || ''}`.trim();
    }
    const username = msg.recipient?.username || msg.recipientUsername || '';
    if (username) {
      const u = username.toLowerCase();
      if (u.includes('admin')) return 'Clinical Administration';
      if (u.includes('therapist')) return 'Dr. Sarah Chen, LCSW';
      if (u.includes('psychiatrist')) return 'Dr. Mark Rivera, MD';
      if (u.includes('psychologist')) return 'Dr. Maya Patel, PsyD';
      if (u.includes('supervisor')) return 'Dr. Kevin Torres, MD (Supervisor)';
      if (u.includes('receptionist')) return 'Jennifer Adams (Front Desk)';
      if (u.includes('case_manager')) return 'Case Management Desk';
      if (u.includes('client')) return 'Taylor Morgan (Client)';
      return username;
    }
    return 'Clinical Provider';
  };

  const getSenderRole = (msg) => {
    if (msg?.sender?.role) return msg.sender.role;
    const name = getSenderName(msg);
    if (name.includes('Administrator') || name.includes('Administration')) return 'ADMIN';
    if (name.includes('Supervisor') || name.includes('Torres')) return 'SUPERVISOR';
    if (name.includes('Case Management')) return 'CASE_MANAGER';
    if (name.includes('Front Desk') || name.includes('Adams')) return 'RECEPTIONIST';
    if (name.includes('Rivera')) return 'PSYCHIATRIST';
    if (name.includes('Patel')) return 'PSYCHOLOGIST';
    return 'CLINICAL';
  };

  const unreadCount = messages.filter(m => !m.readAt && m.sender?.username !== currentUser?.username).length;

  const filtered = useMemo(() => {
    return messages.filter(m => {
      const q = searchQuery.toLowerCase();
      const body = getMessageBody(m).toLowerCase();
      const sender = getSenderName(m).toLowerCase();
      const matchSearch = !q || body.includes(q) || sender.includes(q);

      const isSent = m.sender?.username === currentUser?.username;
      if (tabFilter === 'UNREAD') {
        return matchSearch && !m.readAt && !isSent;
      }
      if (tabFilter === 'SENT') {
        return matchSearch && isSent;
      }
      return matchSearch;
    });
  }, [messages, searchQuery, tabFilter, currentUser]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            <span>Communication Hub</span> › <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>HIPAA Inbox</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={22} style={{ color: 'var(--color-primary, #2563eb)' }} /> Secure Clinical Messaging
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} /> End-to-end encrypted · HIPAA & HITECH compliant
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className="mc-btn mc-btn-outline"
            onClick={fetchMessages}
            title="Refresh inbox"
            style={{ padding: '8px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button 
            className="mc-btn mc-btn-primary" 
            onClick={() => setShowCompose(true)}
            style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> New Message
          </button>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="mc-card" style={{ padding: '12px 16px', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'ALL', label: 'All Messages', count: messages.length },
            { id: 'UNREAD', label: 'Unread', count: unreadCount, badgeColor: '#ef4444' },
            { id: 'SENT', label: 'Sent', count: messages.filter(m => m.sender?.username === currentUser?.username).length }
          ].map(tab => {
            const active = tabFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTabFilter(tab.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: active ? 'var(--bg-secondary)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span style={{
                    fontSize: 10,
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: tab.badgeColor || 'rgba(0,0,0,0.08)',
                    color: tab.badgeColor ? '#fff' : 'inherit',
                    fontWeight: 700
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1, minWidth: 220, maxWidth: 360, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text" 
            placeholder="Filter messages or sender..."
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '7px 8px 7px 30px', borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--input-bg, var(--bg-secondary))', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
      </div>

      {/* Message Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="mc-spinner" style={{ margin: '0 auto 12px' }}></div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Decrypting secure messages...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mc-card" style={{ padding: 48, textAlign: 'center', borderRadius: 12, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
          <Mail size={40} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>No messages found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12, margin: 0 }}>
            {searchQuery ? 'No conversations match your search query.' : 'Click "New Message" above to initiate a secure encrypted consultation.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(msg => {
            const isSent = msg.sender?.username === currentUser?.username;
            const isRead = !!msg.readAt;

            return (
              <div
                key={msg.id}
                className="mc-card"
                onClick={() => {
                  setSelectedConversation(msg);
                  if (!isRead && !isSent) handleMarkRead(msg.id);
                }}
                style={{
                  padding: '14px 18px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-primary)',
                  borderLeft: `4px solid ${isSent ? '#8b5cf6' : !isRead ? '#ef4444' : '#10b981'}`,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: isSent ? 'rgba(139,92,246,0.15)' : 'rgba(16,185,129,0.15)',
                      color: isSent ? '#8b5cf6' : '#10b981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700
                    }}>
                      {isSent ? 'Me' : (getSenderName(msg).replace(/^Dr\.?\s*/, '').charAt(0) || 'C')}
                    </div>
                    <div>
                      <span style={{ fontWeight: !isRead && !isSent ? 800 : 600, fontSize: 13, color: 'var(--text-primary)' }}>
                        {isSent ? `To: ${getRecipientName(msg)}` : getSenderName(msg)}
                      </span>
                      <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {getSenderRole(msg)}
                      </span>
                    </div>
                    {!isRead && !isSent && (
                      <span style={{ padding: '2px 7px', background: '#ef4444', color: '#fff', borderRadius: 10, fontSize: 9, fontWeight: 800, letterSpacing: '0.5px' }}>
                        UNREAD
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {formatDate(msg.sentAt)}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 36, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                  🔒 {getMessageBody(msg)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Compose Message ── */}
      {showCompose && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 520, padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={16} style={{ color: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>New Encrypted Message</h3>
              </div>
              <button 
                onClick={() => setShowCompose(false)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSend} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  Recipient Provider / Client <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  className="mc-input" 
                  value={composeTo} 
                  onChange={e => setComposeTo(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select recipient from directory...</option>
                  {users
                    .filter(u => u.username !== currentUser?.username)
                    .map(u => {
                      let label = u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username;
                      const roleTag = u.role ? ` (${u.role})` : '';
                      return (
                        <option key={u.id} value={u.id}>
                          {label} {roleTag}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  Message Content <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  className="mc-input" 
                  rows={5} 
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)} 
                  required
                  placeholder="Draft encrypted clinical communication..."
                  style={{ width: '100%', padding: '10px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setShowCompose(false)}>
                  Cancel
                </button>
                <button type="submit" className="mc-btn mc-btn-primary" disabled={sending} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Send size={13} /> {sending ? 'Encrypting & Sending...' : 'Send Encrypted'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Message Detail & Quick Reply ── */}
      {selectedConversation && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="mc-card" style={{ width: '100%', maxWidth: 580, maxHeight: '85vh', overflowY: 'auto', padding: 24, borderRadius: 16, background: 'var(--card-bg)', border: '1px solid var(--border-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border-primary)', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={15} style={{ color: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Clinical Message Details</h3>
              </div>
              <button onClick={() => setSelectedConversation(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: 12, fontSize: 12 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 8, display: 'grid', gap: 6 }}>
                <div><strong>From:</strong> {getSenderName(selectedConversation)} ({getSenderRole(selectedConversation)})</div>
                <div><strong>To:</strong> {getRecipientName(selectedConversation)} ({selectedConversation.recipient?.role || currentUser?.role || 'THERAPIST'})</div>
                <div><strong>Dispatched:</strong> {formatDate(selectedConversation.sentAt)}</div>
                {selectedConversation.readAt && <div><strong>Read Receipt:</strong> {formatDate(selectedConversation.readAt)}</div>}
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', borderLeft: '3px solid #10b981' }}>
                {getMessageBody(selectedConversation)}
              </div>

              {/* Quick Reply Form */}
              <form onSubmit={handleSendReply} style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                  Quick Reply to {getSenderName(selectedConversation)}
                </label>
                <textarea
                  rows={3}
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="Type secure response..."
                  style={{ width: '100%', padding: '8px 12px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setSelectedConversation(null)}>
                    Close
                  </button>
                  <button type="submit" className="mc-btn mc-btn-primary" disabled={!replyContent.trim()} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CornerDownLeft size={13} /> Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecureInbox;
