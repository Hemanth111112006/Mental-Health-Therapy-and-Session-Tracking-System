package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.OutcomeMeasureDTO;
import com.mhtsts.entity.OutcomeMeasure;
import com.mhtsts.service.OutcomeMeasureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/outcome-measures")
public class OutcomeMeasureController {

    private final OutcomeMeasureService outcomeMeasureService;

    public OutcomeMeasureController(OutcomeMeasureService outcomeMeasureService) {
        this.outcomeMeasureService = outcomeMeasureService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OutcomeMeasure>> saveOutcomeMeasure(@RequestBody OutcomeMeasureDTO dto) {
        OutcomeMeasure saved = outcomeMeasureService.saveFromDTO(dto);
        return new ResponseEntity<>(
                ApiResponse.success("Outcome measure recorded successfully", saved),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/client/{id}")
    public ResponseEntity<ApiResponse<List<OutcomeMeasure>>> getOutcomeMeasuresByClient(@PathVariable Long id) {
        List<OutcomeMeasure> measures = outcomeMeasureService.getOutcomeMeasures().stream()
                .filter(m -> m.getClient() != null && m.getClient().getId().equals(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Outcome trends retrieved", measures));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OutcomeMeasure>>> getAllOutcomeMeasures() {
        return ResponseEntity.ok(ApiResponse.success("All outcome measures retrieved", outcomeMeasureService.getOutcomeMeasures()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OutcomeMeasure>> getOutcomeMeasureById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Outcome measure retrieved", outcomeMeasureService.getOutcomeMeasureById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OutcomeMeasure>> updateOutcomeMeasure(@PathVariable Long id, @RequestBody OutcomeMeasureDTO dto) {
        OutcomeMeasure existing = outcomeMeasureService.getOutcomeMeasureById(id);
        if (dto.getTotalScore() != null) existing.setTotalScore(dto.getTotalScore());
        else if (dto.getScore() != null) existing.setTotalScore(dto.getScore());
        if (dto.getAdministrationDate() != null) existing.setAdministrationDate(dto.getAdministrationDate());
        else if (dto.getAssessmentDate() != null) existing.setAdministrationDate(dto.getAssessmentDate());
        OutcomeMeasure updated = outcomeMeasureService.saveOutcomeMeasure(existing);
        return ResponseEntity.ok(ApiResponse.success("Outcome measure updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOutcomeMeasure(@PathVariable Long id) {
        outcomeMeasureService.deleteOutcomeMeasure(id);
        return ResponseEntity.ok(ApiResponse.success("Outcome measure deleted"));
    }
}
