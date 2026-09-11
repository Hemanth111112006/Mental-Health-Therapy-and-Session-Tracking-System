package com.mhtsts.entity;

import com.mhtsts.entity.enums.AppointmentType;
import com.mhtsts.entity.enums.Modality;
import com.mhtsts.entity.enums.AppointmentStatus;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type", length = 50)
    private AppointmentType appointmentType;

    @Enumerated(EnumType.STRING)
    private Modality modality;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
    private String cptCode;
    private String cancellationReason;

    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AppointmentParticipant> participants = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id")
    private User therapist;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SessionNote sessionNote;

    public Appointment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public AppointmentType getAppointmentType() { return appointmentType; }
    public void setAppointmentType(AppointmentType appointmentType) { this.appointmentType = appointmentType; }

    public Modality getModality() { return modality; }
    public void setModality(Modality modality) { this.modality = modality; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public String getCptCode() { return cptCode; }
    public void setCptCode(String cptCode) { this.cptCode = cptCode; }

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }

    public List<AppointmentParticipant> getParticipants() { return participants; }
    public void setParticipants(List<AppointmentParticipant> participants) { this.participants = participants; }

    public User getTherapist() { return therapist; }
    public void setTherapist(User therapist) { this.therapist = therapist; }

    public SessionNote getSessionNote() { return sessionNote; }
    public void setSessionNote(SessionNote sessionNote) { this.sessionNote = sessionNote; }
}
