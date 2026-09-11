package com.mhtsts.service;

import com.mhtsts.entity.Appointment;
import com.mhtsts.entity.enums.AppointmentStatus;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private Appointment sampleAppointment;

    @BeforeEach
    public void setUp() {
        sampleAppointment = new Appointment();
        sampleAppointment.setId(1L);
        sampleAppointment.setStartTime(LocalDateTime.now());
        sampleAppointment.setStatus(AppointmentStatus.SCHEDULED);
    }

    @Test
    public void testCreateAppointment() {
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(sampleAppointment);

        Appointment result = appointmentService.createAppointment(sampleAppointment);

        assertNotNull(result);
        assertEquals(AppointmentStatus.SCHEDULED, result.getStatus());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    public void testGetAppointmentById_Success() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(sampleAppointment));

        Appointment result = appointmentService.getAppointmentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    public void testUpdateAppointmentStatus() {
        sampleAppointment.setStatus(AppointmentStatus.COMPLETED);
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(sampleAppointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(sampleAppointment);

        Appointment updated = appointmentService.updateAppointmentStatus(1L, "COMPLETED");

        assertNotNull(updated);
        assertEquals(AppointmentStatus.COMPLETED, updated.getStatus());
    }
}
