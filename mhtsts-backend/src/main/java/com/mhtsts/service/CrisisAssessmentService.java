package com.mhtsts.service;

import com.mhtsts.dto.CrisisAssessmentDTO;
import com.mhtsts.entity.CrisisAssessment;
import com.mhtsts.entity.SafetyPlan;
import com.mhtsts.entity.enums.HomicidalityLevel;
import com.mhtsts.entity.enums.SelfHarmRisk;
import com.mhtsts.entity.enums.SuicidalityLevel;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.CrisisAssessmentRepository;
import com.mhtsts.repository.SafetyPlanRepository;
import com.mhtsts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CrisisAssessmentService {

    private final CrisisAssessmentRepository crisisAssessmentRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final SafetyPlanRepository safetyPlanRepository;

    public CrisisAssessmentService(CrisisAssessmentRepository crisisAssessmentRepository,
                                   ClientRepository clientRepository,
                                   UserRepository userRepository,
                                   SafetyPlanRepository safetyPlanRepository) {
        this.crisisAssessmentRepository = crisisAssessmentRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.safetyPlanRepository = safetyPlanRepository;
    }

    public CrisisAssessment createFromDTO(CrisisAssessmentDTO dto) {
        CrisisAssessment assessment = new CrisisAssessment();

        if (dto.getClientId() != null) {
            assessment.setClient(clientRepository.findById(dto.getClientId()).orElse(null));
        }
        if (dto.getTherapistId() != null) {
            assessment.setTherapist(userRepository.findById(dto.getTherapistId()).orElse(null));
        }
        if (dto.getSafetyPlanId() != null) {
            assessment.setSafetyPlan(safetyPlanRepository.findById(dto.getSafetyPlanId()).orElse(null));
        }

        assessment.setAssessmentDate(dto.getAssessmentDate() != null ? dto.getAssessmentDate() : LocalDateTime.now());
        assessment.setActionTaken(dto.getActionTaken() != null && !dto.getActionTaken().isBlank() ? dto.getActionTaken() : "Assessment completed");
        assessment.setSupervisorNotified(dto.getSupervisorNotified() != null ? dto.getSupervisorNotified() : false);

        // Safe enum mapping with fallback to NONE
        assessment.setSuicidalityLevel(parseSuicidality(dto.getSuicidalityLevel()));
        assessment.setHomicidalityLevel(parseHomicidality(dto.getHomicidalityLevel()));
        assessment.setSelfHarmRisk(parseSelfHarmRisk(dto.getSelfHarmRisk()));

        return crisisAssessmentRepository.save(assessment);
    }

    public CrisisAssessment updateFromDTO(Long id, CrisisAssessmentDTO dto) {
        CrisisAssessment existing = getAssessmentById(id);
        if (dto.getSuicidalityLevel() != null) existing.setSuicidalityLevel(parseSuicidality(dto.getSuicidalityLevel()));
        if (dto.getHomicidalityLevel() != null) existing.setHomicidalityLevel(parseHomicidality(dto.getHomicidalityLevel()));
        if (dto.getSelfHarmRisk() != null) existing.setSelfHarmRisk(parseSelfHarmRisk(dto.getSelfHarmRisk()));
        if (dto.getActionTaken() != null) existing.setActionTaken(dto.getActionTaken());
        if (dto.getHospitalized() != null) existing.setHospitalized(dto.getHospitalized());
        if (dto.getSupervisorNotified() != null) existing.setSupervisorNotified(dto.getSupervisorNotified());
        return crisisAssessmentRepository.save(existing);
    }

    private SuicidalityLevel parseSuicidality(String val) {
        if (val == null) return SuicidalityLevel.NONE;
        try { return SuicidalityLevel.valueOf(val.toUpperCase().replace(" ", "_")); }
        catch (IllegalArgumentException e) {
            String v = val.toLowerCase();
            if (v.contains("none") || v.contains("no")) return SuicidalityLevel.NONE;
            if (v.contains("passive") || v.contains("low")) return SuicidalityLevel.IDEATION_PASSIVE;
            if (v.contains("active") || v.contains("moderate")) return SuicidalityLevel.IDEATION_ACTIVE;
            if (v.contains("plan")) return SuicidalityLevel.PLAN;
            if (v.contains("intent")) return SuicidalityLevel.INTENT;
            if (v.contains("attempt") || v.contains("high")) return SuicidalityLevel.ATTEMPT;
            return SuicidalityLevel.NONE;
        }
    }

    private HomicidalityLevel parseHomicidality(String val) {
        if (val == null) return HomicidalityLevel.NONE;
        try { return HomicidalityLevel.valueOf(val.toUpperCase().replace(" ", "_")); }
        catch (IllegalArgumentException e) {
            String v = val.toLowerCase();
            if (v.contains("none") || v.contains("no")) return HomicidalityLevel.NONE;
            return HomicidalityLevel.NONE;
        }
    }

    private SelfHarmRisk parseSelfHarmRisk(String val) {
        if (val == null) return SelfHarmRisk.NONE;
        try { return SelfHarmRisk.valueOf(val.toUpperCase().replace(" ", "_")); }
        catch (IllegalArgumentException e) {
            String v = val.toLowerCase();
            if (v.contains("none") || v.contains("no")) return SelfHarmRisk.NONE;
            if (v.contains("low")) return SelfHarmRisk.LOW;
            if (v.contains("moderate") || v.contains("medium")) return SelfHarmRisk.MODERATE;
            if (v.contains("high") || v.contains("severe")) return SelfHarmRisk.HIGH;
            return SelfHarmRisk.NONE;
        }
    }

    public CrisisAssessment createAssessment(CrisisAssessment assessment) {
        return crisisAssessmentRepository.save(assessment);
    }

    public List<CrisisAssessment> getCrisisHistory() {
        return crisisAssessmentRepository.findAll();
    }

    public CrisisAssessment getAssessmentById(Long id) {
        return crisisAssessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CrisisAssessment not found with id: " + id));
    }

    public CrisisAssessment updateAssessment(Long id, CrisisAssessment assessmentDetails) {
        CrisisAssessment existing = getAssessmentById(id);
        existing.setSuicidalityLevel(assessmentDetails.getSuicidalityLevel());
        existing.setHomicidalityLevel(assessmentDetails.getHomicidalityLevel());
        existing.setActionTaken(assessmentDetails.getActionTaken());
        existing.setHospitalized(assessmentDetails.getHospitalized());
        existing.setSupervisorNotifiedAt(assessmentDetails.getSupervisorNotifiedAt());
        return crisisAssessmentRepository.save(existing);
    }

    public void deleteAssessment(Long id) {
        CrisisAssessment existing = getAssessmentById(id);
        crisisAssessmentRepository.delete(existing);
    }
}
