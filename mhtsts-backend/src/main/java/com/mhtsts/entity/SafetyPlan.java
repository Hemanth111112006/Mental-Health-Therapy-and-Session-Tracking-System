package com.mhtsts.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "safety_plans")
public class SafetyPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id")
    private User therapist;

    @Column(columnDefinition = "TEXT")
    private String warningSigns;

    @Column(columnDefinition = "TEXT")
    private String copingStrategies;

    @Column(columnDefinition = "TEXT")
    private String socialSupports;

    @Column(columnDefinition = "TEXT")
    private String emergencyContacts;

    @Column(columnDefinition = "TEXT")
    private String crisisLines;

    private LocalDateTime createdDate;
    private LocalDateTime lastUpdated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    public SafetyPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getTherapist() { return therapist; }
    public void setTherapist(User therapist) { this.therapist = therapist; }

    public String getWarningSigns() { return warningSigns; }
    public void setWarningSigns(String warningSigns) { this.warningSigns = warningSigns; }

    public String getCopingStrategies() { return copingStrategies; }
    public void setCopingStrategies(String copingStrategies) { this.copingStrategies = copingStrategies; }

    public String getSocialSupports() { return socialSupports; }
    public void setSocialSupports(String socialSupports) { this.socialSupports = socialSupports; }

    public String getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(String emergencyContacts) { this.emergencyContacts = emergencyContacts; }

    public String getCrisisLines() { return crisisLines; }
    public void setCrisisLines(String crisisLines) { this.crisisLines = crisisLines; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}
