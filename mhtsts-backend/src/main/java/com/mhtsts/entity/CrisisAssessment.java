package com.mhtsts.entity;

import com.mhtsts.entity.enums.HomicidalityLevel;
import com.mhtsts.entity.enums.SelfHarmRisk;
import com.mhtsts.entity.enums.SuicidalityLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "crisis_assessments")
public class CrisisAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id")
    private User therapist;

    @NotNull(message = "Assessment date is required")
    @Column(nullable = false)
    private LocalDateTime assessmentDate;

    @Enumerated(EnumType.STRING)
    private SuicidalityLevel suicidalityLevel;

    @Enumerated(EnumType.STRING)
    private HomicidalityLevel homicidalityLevel;

    @Enumerated(EnumType.STRING)
    private SelfHarmRisk selfHarmRisk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "safety_plan_id")
    private SafetyPlan safetyPlan;

    @NotBlank(message = "Action taken is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String actionTaken;

    @Column(columnDefinition = "boolean default false")
    private Boolean supervisorNotified = false;

    private LocalDateTime supervisorNotifiedAt;

    @Column(columnDefinition = "boolean default false")
    private Boolean hospitalized = false;

    @Column(length = 200)
    private String hospitalName;

    public CrisisAssessment() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public User getTherapist() { return therapist; }
    public void setTherapist(User therapist) { this.therapist = therapist; }

    public LocalDateTime getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(LocalDateTime assessmentDate) { this.assessmentDate = assessmentDate; }

    public SuicidalityLevel getSuicidalityLevel() { return suicidalityLevel; }
    public void setSuicidalityLevel(SuicidalityLevel suicidalityLevel) { this.suicidalityLevel = suicidalityLevel; }

    public HomicidalityLevel getHomicidalityLevel() { return homicidalityLevel; }
    public void setHomicidalityLevel(HomicidalityLevel homicidalityLevel) { this.homicidalityLevel = homicidalityLevel; }

    public SelfHarmRisk getSelfHarmRisk() { return selfHarmRisk; }
    public void setSelfHarmRisk(SelfHarmRisk selfHarmRisk) { this.selfHarmRisk = selfHarmRisk; }

    public SafetyPlan getSafetyPlan() { return safetyPlan; }
    public void setSafetyPlan(SafetyPlan safetyPlan) { this.safetyPlan = safetyPlan; }

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

    public Boolean getSupervisorNotified() { return supervisorNotified; }
    public void setSupervisorNotified(Boolean supervisorNotified) { this.supervisorNotified = supervisorNotified; }

    public LocalDateTime getSupervisorNotifiedAt() { return supervisorNotifiedAt; }
    public void setSupervisorNotifiedAt(LocalDateTime supervisorNotifiedAt) { this.supervisorNotifiedAt = supervisorNotifiedAt; }

    public Boolean getHospitalized() { return hospitalized; }
    public void setHospitalized(Boolean hospitalized) { this.hospitalized = hospitalized; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public void setSuicidality(SuicidalityLevel suicidalityLevel) {
    }
}
