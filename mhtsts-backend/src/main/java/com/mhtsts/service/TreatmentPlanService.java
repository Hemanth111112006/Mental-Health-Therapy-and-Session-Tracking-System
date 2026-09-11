package com.mhtsts.service;

import com.mhtsts.entity.TreatmentPlan;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.TreatmentPlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreatmentPlanService {

    private final TreatmentPlanRepository treatmentPlanRepository;

    public TreatmentPlanService(TreatmentPlanRepository treatmentPlanRepository) {
        this.treatmentPlanRepository = treatmentPlanRepository;
    }

    public TreatmentPlan createTreatmentPlan(TreatmentPlan plan) {
        return treatmentPlanRepository.save(plan);
    }

    public TreatmentPlan getTreatmentPlan(Long id) {
        return treatmentPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TreatmentPlan not found with id: " + id));
    }

    public List<TreatmentPlan> getTreatmentPlansByClientId(Long clientId) {
        return treatmentPlanRepository.findByClientId(clientId);
    }


    public TreatmentPlan updateTreatmentPlan(Long id, TreatmentPlan planDetails) {
        TreatmentPlan existingPlan = getTreatmentPlan(id);
        existingPlan.setClinicalFormulation(planDetails.getClinicalFormulation());
        existingPlan.setDiagnoses(planDetails.getDiagnoses());
        existingPlan.setProblemList(planDetails.getProblemList());
        existingPlan.setGoals(planDetails.getGoals());
        existingPlan.setInterventions(planDetails.getInterventions());
        existingPlan.setEstimatedDuration(planDetails.getEstimatedDuration());
        existingPlan.setReviewDate(planDetails.getReviewDate());
        existingPlan.setStatus(planDetails.getStatus());
        existingPlan.setVersion(planDetails.getVersion());
        return treatmentPlanRepository.save(existingPlan);
    }

    public Iterable<TreatmentPlan> getAllTreatmentPlans() {
        return treatmentPlanRepository.findAll();
    }

    public void deleteTreatmentPlan(Long id) {
        if (!treatmentPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("TreatmentPlan not found with id: " + id);
        }
        treatmentPlanRepository.deleteById(id);
    }
}
