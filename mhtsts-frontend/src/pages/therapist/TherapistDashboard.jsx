import React from 'react';
import ClinicalLayout from '../../layouts/ClinicalLayout';

const TherapistDashboard = () => {
  return (
    <ClinicalLayout role="THERAPIST">
      <h2>Therapist Clinical Workspace</h2>
      <p>Manage assigned client caseload, session SOAP notes, treatment plans, and crisis logs.</p>
    </ClinicalLayout>
  );
};

export default TherapistDashboard;
