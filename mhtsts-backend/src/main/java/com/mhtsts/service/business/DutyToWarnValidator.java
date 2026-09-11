package com.mhtsts.service.business;

import com.mhtsts.entity.CrisisAssessment;
import com.mhtsts.entity.enums.HomicidalityLevel;
import com.mhtsts.exception.DutyToWarnException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DutyToWarnValidator {

    public void validateDutyToWarn(CrisisAssessment assessment, LocalDateTime legalConsultationDate, String disclosureAction) {
        if (assessment.getHomicidalityLevel() == HomicidalityLevel.PLAN || assessment.getHomicidalityLevel() == HomicidalityLevel.INTENT) {
            if (legalConsultationDate == null) {
                throw new DutyToWarnException("Legal consultation date is required when homicidal plan or intent is present.");
            }
            if (disclosureAction == null || disclosureAction.isEmpty()) {
                throw new DutyToWarnException("Disclosure action documentation is required when homicidal plan or intent is present.");
            }
        }
    }
}
