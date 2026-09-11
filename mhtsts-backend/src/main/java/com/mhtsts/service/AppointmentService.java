package com.mhtsts.service;

import com.mhtsts.entity.Appointment;
import com.mhtsts.entity.AppointmentParticipant;
import com.mhtsts.entity.enums.AppointmentStatus;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(Appointment appointment) {
        // Wire back-reference for participants
        if (appointment.getParticipants() != null) {
            for (AppointmentParticipant p : appointment.getParticipants()) {
                p.setAppointment(appointment);
            }
        }
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    public Appointment updateAppointmentStatus(Long id, String status) {
        Appointment appointment = getAppointmentById(id);
        try {
            appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase().trim()));
        } catch (Exception e) {
            if (status != null && status.toUpperCase().contains("RESCHED")) {
                appointment.setStatus(AppointmentStatus.RESCHEDULED);
            } else {
                appointment.setStatus(AppointmentStatus.SCHEDULED);
            }
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment existing = getAppointmentById(id);
        if (appointmentDetails.getStartTime() != null) existing.setStartTime(appointmentDetails.getStartTime());
        if (appointmentDetails.getEndTime() != null) existing.setEndTime(appointmentDetails.getEndTime());
        if (appointmentDetails.getAppointmentType() != null) existing.setAppointmentType(appointmentDetails.getAppointmentType());
        if (appointmentDetails.getModality() != null) existing.setModality(appointmentDetails.getModality());
        if (appointmentDetails.getCptCode() != null) existing.setCptCode(appointmentDetails.getCptCode());
        if (appointmentDetails.getTherapist() != null) existing.setTherapist(appointmentDetails.getTherapist());
        if (appointmentDetails.getStatus() != null) existing.setStatus(appointmentDetails.getStatus());
        return appointmentRepository.save(existing);
    }

    public Appointment cancelAppointment(Long id, String reason) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(reason);
        return appointmentRepository.save(appointment);
    }
}
