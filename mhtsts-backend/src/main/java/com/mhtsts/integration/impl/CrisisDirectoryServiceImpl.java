package com.mhtsts.integration.impl;

import com.mhtsts.integration.CrisisDirectoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CrisisDirectoryServiceImpl implements CrisisDirectoryService {

    private static final Logger logger = LoggerFactory.getLogger(CrisisDirectoryServiceImpl.class);

    @Override
    public Object getEmergencyDirectory() {
        logger.info("MOCK: Fetching national emergency directory");
        return Collections.singletonMap("directory", "911, 988 Suicide & Crisis Lifeline");
    }

    @Override
    public void dispatchEmergencyProtocol(Long clientId, String location) {
        logger.info("MOCK: Dispatching emergency protocol for client {} at location {}", clientId, location);
    }
}
