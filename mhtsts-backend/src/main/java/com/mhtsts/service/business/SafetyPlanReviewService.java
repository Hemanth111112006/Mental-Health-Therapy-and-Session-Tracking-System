package com.mhtsts.service.business;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SafetyPlanReviewService {

    private static final Logger logger = LoggerFactory.getLogger(SafetyPlanReviewService.class);

    public void triggerReviewRequirement(Long clientId) {
        // Business Rule: Every crisis episode requires safety plan review.
        logger.info("Safety Plan review triggered for Client {}", clientId);
        // In a real implementation, this would update a 'needsReview' flag on the SafetyPlan entity.
    }
}
