import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { notificationApi } from '../../../api/notificationApi';
import { toast } from '../../../utils/toast';
import { 
  Bell, CheckCheck, AlertTriangle, ShieldCheck, Calendar, FileText, 
  Activity, ArrowRight, Trash2, CheckCircle2, Filter
} from 'lucide-react';

const DEFAULT_CLINICAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    title: 'Supervisor Co-Signature Approved',
    body: 'Dr. Kevin Torres, MD co-signed your SOAP progress note for Emma Johnson (MC-2041). Note status: COMPLIANT & APPROVED.',
    type: 'APPROVAL',
    category: 'supervisory',
    actionPath: '/session-notes',
    actionLabel: 'View Approved Note',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35m ago
    isRead: false
  },
  {
    id: 'NOTIF-102',
    title: 'Crisis Alert: PHQ-9 Question 9 Flagged',
    body: 'Marcus Williams (MC-1887) endorsed Question 9 (Suicidal Ideation) on PHQ-9. Stanley-Brown Safety Plan is active and requires monitoring.',
    type: 'SAFETY_PLAN',
    category: 'clinical',
    actionPath: '/crisis-assessments',
    actionLabel: 'Review Crisis Plan',
    createdAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~2h ago
    isRead: false
  },
  {
    id: 'NOTIF-103',
    title: 'Upcoming Telehealth Session Today',
    body: 'Individual CBT session with Taylor Morgan scheduled today at 2:00 PM (Room 204 / Telehealth Link Ready).',
    type: 'APPOINTMENT',
    category: 'appointments',
    actionPath: '/therapist/appointments',
    actionLabel: 'Open Session',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4h ago
    isRead: false
  },
  {
    id: 'NOTIF-104',
    title: 'New Client Referral Assigned',
    body: 'Patient Taylor Morgan has been assigned to your clinical queue by Front Desk for intake CBT assessment.',
    type: 'REFERRAL',
    category: 'clinical',
    actionPath: '/clients',
    actionLabel: 'View Client Profile',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday
    isRead: true
  },
  {
    id: 'NOTIF-105',
    title: 'Outcome Measure Trajectory Updated',
    body: 'Emma Johnson completed post-session GAD-7. Anxiety score dropped from 16 to 7 (-56% symptom reduction).',
    type: 'ASSESSMENT',
    category: 'clinical',
    actionPath: '/outcome-measures',
    actionLabel: 'View Assessment History',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true
  }
];

const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'clinical', 'supervisory', 'appointments'

  const storageKey = `mindcare_notifications_${currentUser?.username || 'user'}`;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let list = [];

      // 1. Fetch from MySQL Backend
      try {
        const data = await notificationApi.getMyNotifications();
        if (Array.isArray(data) && data.length > 0) {
          list = data.map(item => ({
            ...item,
            id: item.id || `BACKEND-${Math.random()}`,
            category: item.type === 'APPROVAL' ? 'supervisory' : 
                      item.type === 'APPOINTMENT' ? 'appointments' : 'clinical',
            actionPath: item.type === 'APPROVAL' ? '/session-notes' :
                        item.type === 'SAFETY_PLAN' ? '/crisis-assessments' :
                        item.type === 'ASSESSMENT' ? '/outcome-measures' :
                        item.type === 'APPOINTMENT' ? '/therapist/appointments' : '/clients',
            actionLabel: 'View Details'
          }));
        }
      } catch (backendErr) {
        console.warn('Backend notification notice:', backendErr);
      }

      // 2. Merge cached notifications or clinical defaults
      const saved = localStorage.getItem(storageKey);
      let localItems = DEFAULT_CLINICAL_NOTIFICATIONS;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localItems = parsed;
          }
        } catch (e) {}
      }

      const merged = [...list];
      for (const item of localItems) {
        if (!merged.some(m => String(m.id) === String(item.id) || m.title === item.title)) {
          merged.push(item);
        }
      }

      setNotifications(merged);
      localStorage.setItem(storageKey, JSON.stringify(merged));
    } catch (err) {
      console.error('Failed to load notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const syncNotifications = (updated) => {
    setNotifications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new Event('mindcare_notifications_updated'));
  };

  const handleMarkRead = async (id) => {
    try {
      if (typeof id === 'number') {
        await notificationApi.markAsRead(id);
      }
    } catch (err) {}
    const updated = notifications.map(n => String(n.id) === String(id) ? { ...n, isRead: true } : n);
    syncNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
    } catch (err) {}
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    syncNotifications(updated);
    toast.success('All clinical notifications marked as read');
  };

  const handleDelete = async (id) => {
    try {
      if (typeof id === 'number') {
        await notificationApi.deleteNotification(id);
      }
    } catch (err) {}
    const updated = notifications.filter(n => String(n.id) !== String(id));
    syncNotifications(updated);
    toast.success('Notification dismissed');
  };

  const handleActionClick = (notification) => {
    if (!notification.isRead) {
      handleMarkRead(notification.id);
    }
    if (notification.actionPath) {
      navigate(notification.actionPath);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'clinical') return n.category === 'clinical' || n.type === 'SAFETY_PLAN' || n.type === 'ASSESSMENT';
    if (filter === 'supervisory') return n.category === 'supervisory' || n.type === 'APPROVAL';
    if (filter === 'appointments') return n.category === 'appointments' || n.type === 'APPOINTMENT';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const typeConfig = {
    APPOINTMENT: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: <Calendar size={18} /> },
    MESSAGE: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: <CheckCircle2 size={18} /> },
    REPORT: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', icon: <FileText size={18} /> },
    ASSESSMENT: { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', icon: <Activity size={18} /> },
    SAFETY_PLAN: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', icon: <AlertTriangle size={18} /> },
    APPROVAL: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', icon: <ShieldCheck size={18} /> },
    REFERRAL: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: <Bell size={18} /> }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const diffMs = Date.now() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            <span>Clinical Workspace</span> › <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Activity Center</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={24} style={{ color: 'var(--color-primary, #2563eb)' }} /> Clinical Notifications
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Real-time supervisor co-signatures, crisis flags, patient assessments, and session schedules.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead} 
              className="mc-btn mc-btn-outline" 
              style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <CheckCheck size={15} /> Mark All Read ({unreadCount})
            </button>
          )}
          <button onClick={fetchNotifications} className="mc-btn mc-btn-ghost" style={{ fontSize: 12 }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'clinical', label: 'Clinical & Crisis' },
          { id: 'supervisory', label: 'Supervisor Approvals' },
          { id: 'appointments', label: 'Sessions & Intake' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`mc-btn ${filter === tab.id ? 'mc-btn-primary' : 'mc-btn-ghost'}`}
            style={{ fontSize: 12, padding: '7px 14px', borderRadius: 8 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: 'var(--text-secondary)' }}>
          <div className="mc-spinner" style={{ margin: '0 auto 12px' }}></div>
          Loading notifications...
        </div>
      ) : filtered.length === 0 ? (
        <div className="mc-card" style={{ padding: 48, textAlign: 'center', borderRadius: 12, border: '1px solid var(--border-primary)' }}>
          <Bell size={42} style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }} />
          <h3 style={{ color: 'var(--text-primary)', margin: '0 0 6px', fontSize: 16 }}>No notifications found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
            {filter === 'unread' ? "You're completely caught up with your clinical alerts!" : 'No notifications in this category.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(notification => {
            const config = typeConfig[notification.type] || { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)', icon: <Bell size={18} /> };
            const isRead = notification.isRead;

            return (
              <div
                key={notification.id}
                className="mc-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                  borderRadius: 12,
                  border: '1px solid var(--border-primary)',
                  borderLeft: `4px solid ${config.color}`,
                  background: isRead ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Icon Avatar */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: config.bg,
                  color: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}>
                  {config.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontWeight: isRead ? 600 : 800, fontSize: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {notification.title}
                      {!isRead && (
                        <span style={{ padding: '2px 7px', background: '#3b82f6', color: '#fff', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>
                          NEW
                        </span>
                      )}
                      <span style={{ padding: '2px 8px', background: config.bg, color: config.color, borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                        {notification.type}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>

                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10 }}>
                    {notification.body}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {notification.actionPath && (
                      <button
                        onClick={() => handleActionClick(notification)}
                        className="mc-btn mc-btn-primary mc-btn-sm"
                        style={{ fontSize: 11, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        {notification.actionLabel || 'View Record'} <ArrowRight size={12} />
                      </button>
                    )}
                    {!isRead && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="mc-btn mc-btn-ghost mc-btn-sm"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="mc-btn mc-btn-ghost mc-btn-sm"
                      style={{ fontSize: 11, padding: '5px 10px', color: 'var(--text-secondary)' }}
                      title="Dismiss"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default NotificationsPage;
