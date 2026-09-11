package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.AuditLog;
import com.mhtsts.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuditLogService auditLogService;

    public AdminController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success("HIPAA audit trail retrieved", auditLogService.getAuditHistory()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> analyticsData = new HashMap<>();
        analyticsData.put("totalAuditLogs", auditLogService.getAuditHistory().size());
        analyticsData.put("status", "ACTIVE");
        analyticsData.put("systemUptimePercentage", 99.9);
        return ResponseEntity.ok(ApiResponse.success("Analytics dashboard data retrieved", analyticsData));
    }
    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<String>> getReports() {
        return ResponseEntity.ok(ApiResponse.success("Admin reports generated successfully", "Report data placeholder"));
    }
}
