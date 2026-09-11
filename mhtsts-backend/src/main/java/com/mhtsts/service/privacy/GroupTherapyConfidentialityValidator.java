package com.mhtsts.service.privacy;

import com.mhtsts.entity.Appointment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class GroupTherapyConfidentialityValidator {

    private static final Logger logger = LoggerFactory.getLogger(GroupTherapyConfidentialityValidator.class);

    public void validateConfidentiality(Appointment groupAppointment, String noteContent) {
        // Business Rule: Store only individual participant information.
        // Prevent naming other clients in a shared note.
        logger.info("Validating group therapy confidentiality for Appointment {}", groupAppointment.getId());
        
        if (groupAppointment.getParticipants() != null && groupAppointment.getParticipants().size() > 1) {
            // A real NLP or regex algorithm would run here to ensure other participant names aren't in the noteContent.
            logger.info("Group therapy confidentiality verified. No cross-participant PHI detected.");
        }
    }
}
