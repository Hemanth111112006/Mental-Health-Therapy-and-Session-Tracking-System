package com.mhtsts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "psychotherapy_notes")
public class PsychotherapyNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long therapistId;

    @Convert(converter = com.mhtsts.security.PsychotherapyCryptoConverter.class)
    @Column(columnDefinition = "TEXT")
    private String noteContent;

    private Boolean isConfidential;
    
    @Column(columnDefinition = "boolean default true")
    private Boolean excludeFromRoutineRelease = true;
    
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    public PsychotherapyNote() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTherapistId() { return therapistId; }
    public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }

    public String getNoteContent() { return noteContent; }
    public void setNoteContent(String noteContent) { this.noteContent = noteContent; }

    public Boolean getIsConfidential() { return isConfidential; }
    public void setIsConfidential(Boolean isConfidential) { this.isConfidential = isConfidential; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}
