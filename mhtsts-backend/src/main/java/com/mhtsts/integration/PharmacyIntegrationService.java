package com.mhtsts.integration;

public interface PharmacyIntegrationService {
    void routePrescription(Object prescriptionData);
    Object fetchMedicationHistory(Long clientId);
}
