import React from 'react';
import StaffManager from '../../components/StaffManager';

const TherapistManagement = () => {
  return (
    <StaffManager 
      role="THERAPIST" 
      title="Therapists Caseload Directory" 
      description="Verify clinical licenses, credentials, specialty focus areas, and active CB/DBT caseload assignments for primary counselors." 
    />
  );
};

export default TherapistManagement;
