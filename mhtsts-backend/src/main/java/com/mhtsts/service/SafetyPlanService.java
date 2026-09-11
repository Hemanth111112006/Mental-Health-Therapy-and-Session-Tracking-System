package com.mhtsts.service;

import com.mhtsts.dto.SafetyPlanDTO;
import com.mhtsts.entity.SafetyPlan;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.SafetyPlanRepository;
import com.mhtsts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SafetyPlanService {

    private final SafetyPlanRepository safetyPlanRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public SafetyPlanService(SafetyPlanRepository safetyPlanRepository,
                             ClientRepository clientRepository,
                             UserRepository userRepository) {
        this.safetyPlanRepository = safetyPlanRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    public SafetyPlan createSafetyPlan(SafetyPlan plan) {
        if (plan.getCreatedDate() == null) plan.setCreatedDate(LocalDateTime.now());
        plan.setLastUpdated(LocalDateTime.now());
        return safetyPlanRepository.save(plan);
    }

    public SafetyPlan createFromDTO(SafetyPlanDTO dto) {
        SafetyPlan plan = new SafetyPlan();
        if (dto.getClientId() != null) {
            plan.setClient(clientRepository.findById(dto.getClientId()).orElse(null));
        }
        if (dto.getTherapistId() != null) {
            plan.setTherapist(userRepository.findById(dto.getTherapistId()).orElse(null));
        }
        plan.setWarningSigns(dto.getWarningSigns());
        plan.setCopingStrategies(dto.getCopingStrategies());
        plan.setSocialSupports(dto.getSocialSupports());
        plan.setEmergencyContacts(dto.getEmergencyContacts());
        plan.setCrisisLines(dto.getCrisisLines());
        plan.setCreatedDate(LocalDateTime.now());
        plan.setLastUpdated(LocalDateTime.now());
        return safetyPlanRepository.save(plan);
    }

    public SafetyPlan updateFromDTO(Long id, SafetyPlanDTO dto) {
        SafetyPlan plan = getSafetyPlan(id);
        if (dto.getWarningSigns() != null) plan.setWarningSigns(dto.getWarningSigns());
        if (dto.getCopingStrategies() != null) plan.setCopingStrategies(dto.getCopingStrategies());
        if (dto.getSocialSupports() != null) plan.setSocialSupports(dto.getSocialSupports());
        if (dto.getEmergencyContacts() != null) plan.setEmergencyContacts(dto.getEmergencyContacts());
        if (dto.getCrisisLines() != null) plan.setCrisisLines(dto.getCrisisLines());
        plan.setLastUpdated(LocalDateTime.now());
        return safetyPlanRepository.save(plan);
    }

    public List<SafetyPlan> getAllSafetyPlans() {
        return safetyPlanRepository.findAll();
    }

    public SafetyPlan getSafetyPlan(Long id) {
        return safetyPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SafetyPlan not found with id: " + id));
    }

    public SafetyPlan updateSafetyPlan(Long id, SafetyPlan planDetails) {
        SafetyPlan existingPlan = getSafetyPlan(id);
        existingPlan.setWarningSigns(planDetails.getWarningSigns());
        existingPlan.setCopingStrategies(planDetails.getCopingStrategies());
        existingPlan.setSocialSupports(planDetails.getSocialSupports());
        existingPlan.setEmergencyContacts(planDetails.getEmergencyContacts());
        existingPlan.setCrisisLines(planDetails.getCrisisLines());
        existingPlan.setLastUpdated(LocalDateTime.now());
        return safetyPlanRepository.save(existingPlan);
    }

    public void deleteSafetyPlan(Long id) {
        SafetyPlan plan = getSafetyPlan(id);
        safetyPlanRepository.delete(plan);
    }
}
