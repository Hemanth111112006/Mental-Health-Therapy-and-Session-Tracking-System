package com.mhtsts.integration.impl;

import com.mhtsts.integration.HospitalEHRService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class HospitalEHRServiceImpl implements HospitalEHRService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalEHRServiceImpl.class);

    @Override
    public void syncCareIntegration(Long clientId, Object ehrData) {
        logger.info("MOCK: Syncing care data with Hospital EHR for Client ID {}: {}", clientId, ehrData);
    }
}
