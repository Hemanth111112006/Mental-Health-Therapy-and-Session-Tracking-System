import React from 'react';
import StaffManager from '../../components/StaffManager';

const SupervisorManagement = () => {
  return (
    <StaffManager 
      role="SUPERVISOR" 
      title="Clinical Supervisors Directory" 
      description="Manage licensed clinical supervisors, track supervisee clinical hours, oversight permissions, and note co-signatures." 
    />
  );
};

export default SupervisorManagement;
