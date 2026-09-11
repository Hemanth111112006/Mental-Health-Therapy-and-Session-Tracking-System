package com.mhtsts.integration;

public interface HospitalEHRService {
    void syncCareIntegration(Long clientId, Object ehrData);
}
