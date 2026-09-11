import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { notificationApi } from '../api/notificationApi';

const Topbar = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await notificationApi.getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Could not load notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      window.addEventListener('mindcare_notifications_updated', fetchNotifications);
      return () => {
        clearInterval(interval);
        window.removeEventListener('mindcare_notifications_updated', fetchNotifications);
      };
    }
  }, [currentUser]);

  const [unreadMessageCount, setUnreadMessageCount] = useState(2);

  useEffect(() => {
    const updateUnread = () => {
      const stored = localStorage.getItem(`mindcare_unread_count_${currentUser?.username || 'user'}`);
      if (stored !== null) {
        setUnreadMessageCount(parseInt(stored, 10) || 0);
      } else {
        try {
          const key = `mindcare_messages_${currentUser?.username || currentUser?.role || 'default'}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            const list = JSON.parse(saved);
            const count = list.filter(m => !m.readAt && m.sender?.username !== currentUser?.username).length;
            setUnreadMessageCount(count);
            return;
          }
        } catch (e) {}
        setUnreadMessageCount(2);
      }
    };

    updateUnread();
    window.addEventListener('mindcare_messages_updated', updateUnread);
    window.addEventListener('storage', updateUnread);
    return () => {
      window.removeEventListener('mindcare_messages_updated', updateUnread);
      window.removeEventListener('storage', updateUnread);
    };
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationApi.markAsRead(notif.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.warn('Error marking read:', err);
      }
    }
    setShowNotifications(false);
    if (notif.type === 'SAFETY_PLAN' || notif.type === 'CRITICAL') {
      navigate('/crisis-assessments');
    } else if (notif.type === 'REPORT') {
      navigate('/reports');
    } else if (notif.type === 'ASSESSMENT') {
      navigate('/outcome-measures');
    } else if (notif.type === 'APPROVAL') {
      navigate('/session-notes');
    } else if (notif.type === 'MESSAGE') {
      navigate('/messaging');
    } else {
      navigate('/notifications');
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      const diffMs = new Date() - new Date(dateStr);
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return dateStr;
    }
  };
  
  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pathnames = location.pathname.split('/').filter(x => x);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`mc-topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{
      position: 'sticky',
      top: 0,
      zIndex: 200,
      background: 'var(--bg-topbar)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-primary)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left Side: Logo, Application Name, Toggle, Breadcrumbs, Global Search */}
      <div className="mc-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <button 
          className="mc-topbar-toggle" 
          onClick={onToggleSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: 'var(--text-primary)' }}
        >
          <MenuOutlinedIcon />
        </button>

        {/* Application Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <span style={{ fontSize: 20 }}>🧠</span>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>MindCare</span>
        </div>

        {/* Dynamic Breadcrumbs */}
        <div className="mc-topbar-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Home</Link>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
            
            return (
              <React.Fragment key={name}>
                <span className="mc-topbar-breadcrumb-separator" style={{ color: 'var(--text-tertiary)' }}>/</span>
                {isLast ? (
                  <span className="mc-topbar-breadcrumb-current" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</span>
                ) : (
                  <Link to={routeTo} style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>{displayName}</Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Global Search Bar */}
        <div className="mc-topbar-search" style={{ 
          position: 'relative', 
          maxWidth: 320, 
          width: '100%', 
          marginLeft: 20, 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <SearchOutlinedIcon className="mc-topbar-search-icon" style={{ 
            position: 'absolute', 
            left: 12, 
            color: 'var(--text-tertiary)', 
            fontSize: 18 
          }} />
          <input 
            type="text" 
            placeholder="Global search clients, charts, logs..." 
            style={{
              width: '100%',
              height: '36px',
              padding: '6px 12px 6px 36px',
              borderRadius: '8px',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>
      </div>
      
      {/* Right Side: Notification Bell, Messages, Theme, Profile Dropdown, Settings Shortcut */}
      <div className="mc-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        
        {/* Unread Message Icon */}
        <Link 
          to="/messaging" 
          className="mc-topbar-action" 
          title="Secure Message Inbox" 
          style={{ 
            position: 'relative', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <MessageOutlinedIcon style={{ fontSize: 20 }} />
          {unreadMessageCount > 0 && (
            <span className="mc-notification-badge" style={{
              position: 'absolute', top: -3, right: -3, width: 14, height: 14,
              borderRadius: '50%', background: 'var(--color-primary)', color: 'white',
              fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>
              {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
            </span>
          )}
        </Link>
        
        {/* Theme Toggle */}
        <button 
          className="mc-topbar-action" 
          onClick={toggleTheme} 
          title="Toggle UI Theme"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}
        >
          {theme === 'dark' ? <LightModeOutlinedIcon style={{ fontSize: 20 }} /> : <DarkModeOutlinedIcon style={{ fontSize: 20 }} />}
        </button>
        
        {/* Notification Bell */}
        <div className="mc-dropdown" ref={notificationsRef} style={{ position: 'relative' }}>
          <button 
            className="mc-topbar-action" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications();
            }}
            title="Notifications"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4, position: 'relative' }}
          >
            <NotificationsOutlinedIcon style={{ fontSize: 20 }} />
            {unreadCount > 0 && (
              <span className="mc-notification-badge" style={{
                position: 'absolute', top: -3, right: -3, width: 16, height: 16,
                borderRadius: '50%', background: '#ef4444', color: 'white',
                fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="mc-dropdown-menu" style={{ 
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              width: 340, padding: 0, background: 'var(--bg-secondary)', borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid var(--border-primary)',
              overflow: 'hidden', zIndex: 1000
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Recent Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="mc-badge mc-badge-critical" style={{ fontSize: 9, padding: '1px 6px' }}>{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead} 
                    className="mc-btn mc-btn-ghost mc-btn-sm" 
                    style={{ padding: '2px 6px', fontSize: 11, color: 'var(--color-primary)' }}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12 }}>
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      style={{ 
                        padding: '12px 16px', 
                        borderBottom: '1px solid var(--border-primary)', 
                        background: n.isRead ? 'transparent' : 'var(--bg-tertiary, rgba(59, 130, 246, 0.05))',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--border-primary, rgba(0,0,0,0.04))'}
                      onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'var(--bg-tertiary, rgba(59, 130, 246, 0.05))'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: n.isRead ? 500 : 700, color: 'var(--text-primary)' }}>
                          {n.title}
                        </div>
                        {!n.isRead && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3, lineHeight: 1.4 }}>
                        {n.body}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary, #94a3b8)', marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{formatTimeAgo(n.createdAt)}</span>
                        {n.type && (
                          <span className="mc-badge mc-badge-outline" style={{ fontSize: 8, padding: '0 4px' }}>
                            {n.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ padding: 10, textAlign: 'center', borderTop: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                <Link to="/notifications" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }} onClick={() => setShowNotifications(false)}>
                  View all notifications ({notifications.length})
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Settings Shortcut */}
        <Link 
          to="/settings" 
          className="mc-topbar-action" 
          title="System Settings" 
          style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
        >
          <SettingsOutlinedIcon style={{ fontSize: 20 }} />
        </Link>
        
        {/* Profile Dropdown */}
        <div className="mc-dropdown" ref={profileMenuRef} style={{ position: 'relative' }}>
          <button 
            className="mc-topbar-profile" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0
            }}
          >
            <div className="mc-topbar-profile-avatar" style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 'bold'
            }}>
              {currentUser?.firstName?.charAt(0) || ''}{currentUser?.lastName?.charAt(0) || ''}
            </div>
            <span className="mc-topbar-profile-name" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser?.firstName}
            </span>
          </button>
          
          {showProfileMenu && (
            <div className="mc-dropdown-menu" style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 8,
              width: 220, padding: 8, background: 'var(--bg-secondary)', borderRadius: 12,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid var(--border-primary)'
            }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 12 }}>{currentUser?.firstName} {currentUser?.lastName}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{currentUser?.email}</div>
              </div>
              
              <Link to="/profile" className="mc-dropdown-item" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none'
              }} onClick={() => setShowProfileMenu(false)}>
                <PersonOutlinedIcon style={{ fontSize: 18 }} /> My Profile
              </Link>
              <Link to="/settings" className="mc-dropdown-item" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none'
              }} onClick={() => setShowProfileMenu(false)}>
                <SettingsOutlinedIcon style={{ fontSize: 18 }} /> Account Settings
              </Link>
              <Link to="/notifications" className="mc-dropdown-item" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none'
              }} onClick={() => setShowProfileMenu(false)}>
                <NotificationsOutlinedIcon style={{ fontSize: 18 }} /> Notifications
              </Link>
              
              <button 
                className="mc-dropdown-item" 
                onClick={() => {
                  toggleTheme();
                  setShowProfileMenu(false);
                }} 
                style={{ 
                  width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                  fontSize: 12, color: 'var(--text-primary)'
                }}
              >
                {theme === 'dark' ? <LightModeOutlinedIcon style={{ fontSize: 18 }} /> : <DarkModeOutlinedIcon style={{ fontSize: 18 }} />}
                Appearance ({theme === 'dark' ? 'Light' : 'Dark'})
              </button>
              
              <div className="mc-dropdown-divider" style={{ height: 1, background: 'var(--border-primary)', margin: '6px 0' }}></div>
              
              <Link to="/settings/password" className="mc-dropdown-item" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none'
              }} onClick={() => setShowProfileMenu(false)}>
                <LockOutlinedIcon style={{ fontSize: 18 }} /> Change Password
              </Link>
              <Link to="/support" className="mc-dropdown-item" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                fontSize: 12, color: 'var(--text-primary)', textDecoration: 'none'
              }} onClick={() => setShowProfileMenu(false)}>
                <HelpOutlineOutlinedIcon style={{ fontSize: 18 }} /> Help & Support
              </Link>
              
              <div className="mc-dropdown-divider" style={{ height: 1, background: 'var(--border-primary)', margin: '6px 0' }}></div>
              
              <button 
                className="mc-dropdown-item" 
                onClick={handleLogout} 
                style={{ 
                  width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
                  fontSize: 12, color: 'var(--color-danger)'
                }}
              >
                <LogoutOutlinedIcon style={{ fontSize: 18 }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
