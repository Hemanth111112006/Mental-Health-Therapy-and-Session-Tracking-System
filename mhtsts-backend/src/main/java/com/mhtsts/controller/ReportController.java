package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.Report;
import com.mhtsts.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Report>>> getAllReports() {
        List<Report> list = reportService.getAllReports();
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Report>> getReportById(@PathVariable Long id) {
        Report report = reportService.getReportById(id);
        if (report == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Report not found"));
        }
        return ResponseEntity.ok(ApiResponse.success("Report retrieved", report));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> createReport(@RequestBody Report report) {
        Report saved = reportService.saveReport(report);
        return new ResponseEntity<>(ApiResponse.success("Report created successfully", saved), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted successfully"));
    }
}
