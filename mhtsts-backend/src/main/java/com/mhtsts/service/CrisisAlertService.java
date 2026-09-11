package com.mhtsts.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CrisisAlertService {

    private static final Logger logger = LoggerFactory.getLogger(CrisisAlertService.class);

    public void sendCrisisAlert(Long clientId, String severity) {
        logger.info("CRISIS ALERT [IN-APP]: Client ID {} reported severity {}", clientId, severity);
        logger.info("CRISIS ALERT [SMS]: Dispatching SMS to emergency contacts for Client ID {}", clientId);
        logger.info("CRISIS ALERT [EMAIL]: Dispatching Email to clinical team for Client ID {}", clientId);
    }

    public void notifySupervisor(Long clientId, Long therapistId, String severity) {
        logger.info("SUPERVISOR NOTIFICATION: Therapist {} notified for Client ID {} regarding severity {}", therapistId, clientId, severity);
    }

    public void trackAcknowledgement(Long alertId) {
        // Mock implementation of a 15-minute acknowledgement tracker.
        // In a real system, this would register a scheduled job to check the DB status after 15 minutes.
        logger.info("Tracking acknowledgement timeout (15m) for Alert ID {}", alertId);
    }

    public String generateSafetyPlanToken(Long clientId) {
        String token = UUID.randomUUID().toString();
        logger.info("Generated public read-only Safety Plan token for Client ID {}: {}", clientId, token);
        return token;
    }
}
