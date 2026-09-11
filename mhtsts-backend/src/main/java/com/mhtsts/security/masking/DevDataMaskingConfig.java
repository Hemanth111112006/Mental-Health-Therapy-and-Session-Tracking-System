package com.mhtsts.security.masking;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.annotation.PostConstruct;

@Configuration
@Profile("!prod")
public class DevDataMaskingConfig {

    private static final Logger logger = LoggerFactory.getLogger(DevDataMaskingConfig.class);

    @PostConstruct
    public void init() {
        logger.warn("==========================================================");
        logger.warn("NON-PROD ENVIRONMENT DETECTED. PHI DATA MASKING ENABLED.");
        logger.warn("==========================================================");
    }
}
