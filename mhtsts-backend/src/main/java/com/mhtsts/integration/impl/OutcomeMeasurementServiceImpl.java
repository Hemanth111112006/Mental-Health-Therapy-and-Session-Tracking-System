package com.mhtsts.integration.impl;

import com.mhtsts.integration.OutcomeMeasurementIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class OutcomeMeasurementServiceImpl implements OutcomeMeasurementIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(OutcomeMeasurementServiceImpl.class);

    @Override
    public Object getValidatedInstrumentLibrary() {
        logger.info("MOCK: Fetching validated instrument library");
        return Collections.singletonList("PHQ-9, GAD-7, PCL-5");
    }

    @Override
    public int automateScoring(Object testResults) {
        logger.info("MOCK: Automating scoring for results: {}", testResults);
        return 12; // Mock score
    }

    @Override
    public void reportToEAP(Long clientId, Object scores) {
        logger.info("MOCK: Reporting scores to EAP for client {}: {}", clientId, scores);
    }
}
