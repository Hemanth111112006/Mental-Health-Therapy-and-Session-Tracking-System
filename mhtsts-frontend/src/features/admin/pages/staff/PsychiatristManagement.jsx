import React from 'react';
import StaffManager from '../../components/StaffManager';

const PsychiatristManagement = () => {
  return (
    <StaffManager 
      role="PSYCHIATRIST" 
      title="Psychiatrists Prescriptions Registry" 
      description="Manage Board Certified medical staff, clinical MD licenses, medication consultation directories, and medication tracking." 
    />
  );
};

export default PsychiatristManagement;
