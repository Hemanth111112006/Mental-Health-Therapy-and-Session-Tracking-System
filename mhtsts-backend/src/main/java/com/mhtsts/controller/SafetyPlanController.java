package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.SafetyPlanDTO;
import com.mhtsts.entity.SafetyPlan;
import com.mhtsts.service.SafetyPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/safety-plans")
public class SafetyPlanController {

    private final SafetyPlanService safetyPlanService;

    public SafetyPlanController(SafetyPlanService safetyPlanService) {
        this.safetyPlanService = safetyPlanService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SafetyPlan>> createSafetyPlan(@RequestBody SafetyPlanDTO dto) {
        SafetyPlan savedPlan = safetyPlanService.createFromDTO(dto);
        return new ResponseEntity<>(
                ApiResponse.success("Safety plan created successfully", savedPlan),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SafetyPlan>>> getAllSafetyPlans() {
        return ResponseEntity.ok(ApiResponse.success("Safety plans retrieved", safetyPlanService.getAllSafetyPlans()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SafetyPlan>> getSafetyPlan(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Safety plan retrieved", safetyPlanService.getSafetyPlan(id)));
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<ApiResponse<List<SafetyPlan>>> getSafetyPlansByClient(@PathVariable Long id) {
        List<SafetyPlan> plans = safetyPlanService.getAllSafetyPlans().stream()
                .filter(p -> p.getClient() != null && p.getClient().getId().equals(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Safety plans retrieved", plans));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SafetyPlan>> updateSafetyPlan(@PathVariable Long id, @RequestBody SafetyPlanDTO dto) {
        SafetyPlan updated = safetyPlanService.updateFromDTO(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Safety plan updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSafetyPlan(@PathVariable Long id) {
        safetyPlanService.deleteSafetyPlan(id);
        return ResponseEntity.ok(ApiResponse.success("Safety plan deleted"));
    }
}
