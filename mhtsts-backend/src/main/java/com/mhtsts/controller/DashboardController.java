package com.mhtsts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "Admin dashboard data");
        return ResponseEntity.ok(data);
    }

    @PreAuthorize("hasAnyRole('THERAPIST', 'PSYCHOLOGIST', 'PSYCHIATRIST', 'SUPERVISOR', 'CASE_MANAGER')")
    @GetMapping("/clinical")
    public ResponseEntity<Map<String, Object>> getClinicalDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "Clinical dashboard data");
        return ResponseEntity.ok(data);
    }

    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client")
    public ResponseEntity<Map<String, Object>> getClientDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "Client dashboard data");
        return ResponseEntity.ok(data);
    }
}
