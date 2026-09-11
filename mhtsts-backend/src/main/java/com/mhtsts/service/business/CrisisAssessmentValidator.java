package com.mhtsts.service.business;

import com.mhtsts.entity.CrisisAssessment;
import com.mhtsts.entity.enums.SuicidalityLevel;
import com.mhtsts.exception.CrisisValidationException;
import org.springframework.stereotype.Service;

@Service
public class CrisisAssessmentValidator {

    public void validateHighRisk(CrisisAssessment assessment, boolean hasSafetyPlan, boolean supervisorNotified) {
        if (assessment.getSuicidalityLevel() == SuicidalityLevel.PLAN || assessment.getSuicidalityLevel() == SuicidalityLevel.INTENT) {
            if (!supervisorNotified) {
                throw new CrisisValidationException("Supervisor notification is required for high suicidality risk.");
            }
            if (!hasSafetyPlan) {
                throw new CrisisValidationException("An active Safety Plan is required for high suicidality risk.");
            }
            if (assessment.getActionTaken() == null || assessment.getActionTaken().isEmpty()) {
                throw new CrisisValidationException("Action taken documentation is required for high suicidality risk.");
            }
        }
    }
}
