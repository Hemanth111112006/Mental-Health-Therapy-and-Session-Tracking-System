package com.mhtsts.integration.impl;

import com.mhtsts.integration.PharmacyIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class PharmacyIntegrationServiceImpl implements PharmacyIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(PharmacyIntegrationServiceImpl.class);

    @Override
    public void routePrescription(Object prescriptionData) {
        logger.info("MOCK: Routing prescription to e-pharmacy network: {}", prescriptionData);
    }

    @Override
    public Object fetchMedicationHistory(Long clientId) {
        logger.info("MOCK: Fetching medication history for Client ID: {}", clientId);
        return Collections.singletonMap("history", "Mock medication history payload");
    }
}
