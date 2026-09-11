import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { ROLES } from '../config/constants';
import Topbar from './Topbar';

// Import all Sidebars
import AdminSidebar from '../components/sidebars/AdminSidebar';
import TherapistSidebar from '../components/sidebars/TherapistSidebar';
import PsychiatristSidebar from '../components/sidebars/PsychiatristSidebar';
import PsychologistSidebar from '../components/sidebars/PsychologistSidebar';
import SupervisorSidebar from '../components/sidebars/SupervisorSidebar';
import ReceptionistSidebar from '../components/sidebars/ReceptionistSidebar';
import CaseManagerSidebar from '../components/sidebars/CaseManagerSidebar';
import ClientSidebar from '../components/sidebars/ClientSidebar';

const DashboardLayout = () => {
  const { currentUser } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!currentUser) return null;

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const renderSidebar = () => {
    const props = { collapsed: sidebarCollapsed && window.innerWidth > 768 };
    switch (currentUser.role) {
      case ROLES.ADMIN: return <AdminSidebar {...props} />;
      case ROLES.THERAPIST: return <TherapistSidebar {...props} />;
      case ROLES.PSYCHIATRIST: return <PsychiatristSidebar {...props} />;
      case ROLES.PSYCHOLOGIST: return <PsychologistSidebar {...props} />;
      case ROLES.SUPERVISOR: return <SupervisorSidebar {...props} />;
      case ROLES.RECEPTIONIST: return <ReceptionistSidebar {...props} />;
      case ROLES.CASE_MANAGER: return <CaseManagerSidebar {...props} />;
      case ROLES.CLIENT: return <ClientSidebar {...props} />;
      default: return <ClientSidebar {...props} />;
    }
  };

  return (
    <div className="mc-dashboard-wrapper">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="mc-modal-overlay" 
          style={{ zIndex: 250 }} 
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <div className={mobileOpen ? 'mobile-open' : ''}>
        {renderSidebar()}
      </div>
      
      <div className={`mc-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Topbar 
          onToggleSidebar={handleToggleSidebar} 
          sidebarCollapsed={sidebarCollapsed} 
        />
        
        <main className="mc-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
