package com.mhtsts.service.business;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class PostCrisisFollowUpService {

    private static final Logger logger = LoggerFactory.getLogger(PostCrisisFollowUpService.class);

    public void scheduleFollowUp(Long clientId, LocalDateTime dischargeDate) {
        // Business Rule: After hospitalization, follow-up within 24 hours.
        LocalDateTime deadline = dischargeDate.plusHours(24);
        logger.info("Scheduling mandatory post-crisis follow up for Client {} by deadline {}", clientId, deadline);
    }
}
