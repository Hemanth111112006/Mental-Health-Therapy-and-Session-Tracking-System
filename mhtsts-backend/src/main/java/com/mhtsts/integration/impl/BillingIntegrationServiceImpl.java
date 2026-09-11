package com.mhtsts.integration.impl;

import com.mhtsts.integration.BillingIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BillingIntegrationServiceImpl implements BillingIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(BillingIntegrationServiceImpl.class);

    @Override
    public void submitElectronicClaim(Object claimData) {
        logger.info("MOCK: Submitting electronic claim to clearinghouse: {}", claimData);
    }

    @Override
    public void processERA(Object eraData) {
        logger.info("MOCK: Processing ERA (Electronic Remittance Advice): {}", eraData);
    }
}
