package com.mhtsts.integration;

public interface OutcomeMeasurementIntegrationService {
    Object getValidatedInstrumentLibrary();
    int automateScoring(Object testResults);
    void reportToEAP(Long clientId, Object scores);
}
