package com.mhtsts.integration;

public interface BillingIntegrationService {
    void submitElectronicClaim(Object claimData);
    void processERA(Object eraData);
}
