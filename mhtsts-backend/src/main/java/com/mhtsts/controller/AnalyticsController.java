package com.mhtsts.controller;

import com.mhtsts.service.ClientService;
import com.mhtsts.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final ClientService clientService;
    private final AppointmentService appointmentService;

    public AnalyticsController(ClientService clientService, AppointmentService appointmentService) {
        this.clientService = clientService;
        this.appointmentService = appointmentService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientService.getAllClients().size());
        return ResponseEntity.ok(stats);
    }
    
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointmentStats() {
        Map<String, Object> stats = new HashMap<>();
        return ResponseEntity.ok(stats);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/clients")
    public ResponseEntity<Map<String, Object>> getClientStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", clientService.getAllClients().size());
        return ResponseEntity.ok(stats);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        return ResponseEntity.ok(stats);
    }
}
