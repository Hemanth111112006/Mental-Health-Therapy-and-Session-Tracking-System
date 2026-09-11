package com.mhtsts.service.business;

import com.mhtsts.entity.Appointment;
import com.mhtsts.entity.SessionNote;
import com.mhtsts.exception.LateDocumentationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class SessionNoteBusinessValidator {

    public void validateTimeliness(SessionNote note, Appointment appointment) {
        if (appointment.getEndTime() == null) return;
        
        LocalDateTime now = LocalDateTime.now();
        long hoursBetween = ChronoUnit.HOURS.between(appointment.getEndTime(), now);
        
        if (hoursBetween > 24) {
            throw new LateDocumentationException("Progress notes must be completed within 24 hours of session end time.");
        }
    }
}
