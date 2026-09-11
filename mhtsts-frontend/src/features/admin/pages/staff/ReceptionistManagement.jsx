import React from 'react';
import StaffManager from '../../components/StaffManager';

const ReceptionistManagement = () => {
  return (
    <StaffManager 
      role="RECEPTIONIST" 
      title="Front Desk & Receptionists Directory" 
      description="Manage front desk administration accounts, intake paperwork queues, scheduling grids, and copay collections." 
    />
  );
};

export default ReceptionistManagement;
