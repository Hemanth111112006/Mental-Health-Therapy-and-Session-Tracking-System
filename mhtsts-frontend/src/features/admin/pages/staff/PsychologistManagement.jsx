import React from 'react';
import StaffManager from '../../components/StaffManager';

const PsychologistManagement = () => {
  return (
    <StaffManager 
      role="PSYCHOLOGIST" 
      title="Psychologists Diagnostic Registry" 
      description="Manage testing specialists, neuropsychological diagnostics authority, active case directories, and licensing credentials." 
    />
  );
};

export default PsychologistManagement;
