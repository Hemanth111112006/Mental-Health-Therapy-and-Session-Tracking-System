package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.CrisisAssessmentDTO;
import com.mhtsts.entity.CrisisAssessment;
import com.mhtsts.service.CrisisAssessmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/crisis-assessments")
public class CrisisAssessmentController {

    private final CrisisAssessmentService crisisAssessmentService;

    public CrisisAssessmentController(CrisisAssessmentService crisisAssessmentService) {
        this.crisisAssessmentService = crisisAssessmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CrisisAssessment>> createAssessment(@RequestBody CrisisAssessmentDTO dto) {
        CrisisAssessment saved = crisisAssessmentService.createFromDTO(dto);
        return new ResponseEntity<>(
                ApiResponse.success("Crisis assessment created successfully", saved),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<ApiResponse<List<CrisisAssessment>>> getCrisisHistoryByClient(@PathVariable Long id) {
        List<CrisisAssessment> history = crisisAssessmentService.getCrisisHistory().stream()
                .filter(c -> c.getClient() != null && c.getClient().getId().equals(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Crisis history retrieved", history));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CrisisAssessment>>> getAllCrisisAssessments() {
        return ResponseEntity.ok(ApiResponse.success("All crisis assessments retrieved", crisisAssessmentService.getCrisisHistory()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CrisisAssessment>> getCrisisAssessmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Crisis assessment retrieved", crisisAssessmentService.getAssessmentById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CrisisAssessment>> updateCrisisAssessment(@PathVariable Long id, @RequestBody CrisisAssessmentDTO dto) {
        CrisisAssessment updated = crisisAssessmentService.updateFromDTO(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Crisis assessment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrisisAssessment(@PathVariable Long id) {
        crisisAssessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }
}
