package com.mhtsts.entity;

import com.mhtsts.entity.enums.NoteFormat;
import com.mhtsts.security.StringCryptoConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_notes")
public class SessionNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id")
    private User therapist;

    @Enumerated(EnumType.STRING)
    private NoteFormat noteFormat;

    @Convert(converter = StringCryptoConverter.class)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String noteContent;

    @Column(length = 20)
    private String diagnosisPrimary;

    @Column(length = 500)
    private String diagnosisSecondary;

    @Column(length = 10)
    private String cptCode;

    @Column
    private Integer sessionDurationMinutes;

    @Column(columnDefinition = "boolean default false")
    private Boolean isLate = false;

    @Column(columnDefinition = "TEXT")
    private String lateJustification;

    @Column(columnDefinition = "boolean default false")
    private Boolean isSigned = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supervisor_id")
    private User supervisor;

    private LocalDateTime supervisorSignedAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastModifiedAt;

    @AssertTrue(message = "Clinical justification is required for late notes")
    private boolean isLateJustificationValid() {
        if (Boolean.TRUE.equals(isLate)) {
            return lateJustification != null && !lateJustification.trim().isEmpty();
        }
        return true;
    }

    @AssertTrue(message = "Session notes require therapist electronic signature for completion")
    private boolean isSignatureValid() {
        // Business logic could be expanded here. For now, we enforce it if the record is considered "complete".
        return isSigned != null;
    }

    @AssertTrue(message = "Supervisee notes require supervisor co-signature within 48 hours")
    private boolean isSupervisorSignatureValid() {
        if (supervisor != null && supervisorSignedAt != null && createdAt != null) {
            return supervisorSignedAt.isBefore(createdAt.plusHours(48));
        }
        return true;
    }

    public SessionNote() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastModifiedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastModifiedAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public User getTherapist() { return therapist; }
    public void setTherapist(User therapist) { this.therapist = therapist; }

    public NoteFormat getNoteFormat() { return noteFormat; }
    public void setNoteFormat(NoteFormat noteFormat) { this.noteFormat = noteFormat; }

    public String getNoteContent() { return noteContent; }
    public void setNoteContent(String noteContent) { this.noteContent = noteContent; }

    public String getDiagnosisPrimary() { return diagnosisPrimary; }
    public void setDiagnosisPrimary(String diagnosisPrimary) { this.diagnosisPrimary = diagnosisPrimary; }

    public String getDiagnosisSecondary() { return diagnosisSecondary; }
    public void setDiagnosisSecondary(String diagnosisSecondary) { this.diagnosisSecondary = diagnosisSecondary; }

    public String getCptCode() { return cptCode; }
    public void setCptCode(String cptCode) { this.cptCode = cptCode; }

    public Integer getSessionDurationMinutes() { return sessionDurationMinutes; }
    public void setSessionDurationMinutes(Integer sessionDurationMinutes) { this.sessionDurationMinutes = sessionDurationMinutes; }

    public Boolean getIsLate() { return isLate; }
    public void setIsLate(Boolean isLate) { this.isLate = isLate; }

    public String getLateJustification() { return lateJustification; }
    public void setLateJustification(String lateJustification) { this.lateJustification = lateJustification; }

    public Boolean getIsSigned() { return isSigned; }
    public void setIsSigned(Boolean isSigned) { this.isSigned = isSigned; }

    public User getSupervisor() { return supervisor; }
    public void setSupervisor(User supervisor) { this.supervisor = supervisor; }

    public LocalDateTime getSupervisorSignedAt() { return supervisorSignedAt; }
    public void setSupervisorSignedAt(LocalDateTime supervisorSignedAt) { this.supervisorSignedAt = supervisorSignedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastModifiedAt() { return lastModifiedAt; }
    public void setLastModifiedAt(LocalDateTime lastModifiedAt) { this.lastModifiedAt = lastModifiedAt; }
}
