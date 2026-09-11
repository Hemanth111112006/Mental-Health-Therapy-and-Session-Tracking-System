package com.mhtsts.entity;

import com.mhtsts.entity.enums.TreatmentStatus;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "treatment_plans")
public class TreatmentPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long therapistId;

    @Column(columnDefinition = "TEXT")
    private String clinicalFormulation;

    private String diagnoses;

    @Column(columnDefinition = "TEXT")
    private String problemList;

    @Column(columnDefinition = "TEXT")
    private String goals;

    @Column(columnDefinition = "TEXT")
    private String interventions;

    private String estimatedDuration;
    private LocalDate reviewDate;
    @Enumerated(EnumType.STRING)
    private TreatmentStatus status;
    private Integer version;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    public TreatmentPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTherapistId() { return therapistId; }
    public void setTherapistId(Long therapistId) { this.therapistId = therapistId; }

    public String getClinicalFormulation() { return clinicalFormulation; }
    public void setClinicalFormulation(String clinicalFormulation) { this.clinicalFormulation = clinicalFormulation; }

    public String getDiagnoses() { return diagnoses; }
    public void setDiagnoses(String diagnoses) { this.diagnoses = diagnoses; }

    public String getProblemList() { return problemList; }
    public void setProblemList(String problemList) { this.problemList = problemList; }

    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }

    public String getInterventions() { return interventions; }
    public void setInterventions(String interventions) { this.interventions = interventions; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }

    public TreatmentStatus getStatus() { return status; }
    public void setStatus(TreatmentStatus status) { this.status = status; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}
