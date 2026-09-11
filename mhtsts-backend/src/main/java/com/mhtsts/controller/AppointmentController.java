package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.Appointment;
import com.mhtsts.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success("All appointments retrieved", appointmentService.getAppointments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Appointment retrieved", appointmentService.getAppointmentById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@RequestBody Appointment appointment) {
        Appointment saved = appointmentService.createAppointment(appointment);
        return new ResponseEntity<>(
                ApiResponse.success("Appointment scheduled successfully", saved),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/therapist/{id}")
    public ResponseEntity<ApiResponse<List<Appointment>>> getTherapistSchedule(@PathVariable Long id) {
        List<Appointment> therapistAppointments = appointmentService.getAppointments().stream()
                .filter(a -> a.getTherapist() != null && a.getTherapist().getId().equals(id))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Therapist schedule retrieved", therapistAppointments));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Appointment>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Appointment updated = appointmentService.updateAppointmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated to " + status, updated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Appointment>> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        return ResponseEntity.ok(ApiResponse.success("Appointment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id, "Deleted via API");
        return ResponseEntity.noContent().build();
    }
}
