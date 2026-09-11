package com.mhtsts.entity;

import com.mhtsts.entity.enums.MeasureType;
import com.mhtsts.entity.enums.SeverityLevel;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "outcome_measures")
public class OutcomeMeasure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MeasureType measureType;
    
    private Integer totalScore;
    
    @Enumerated(EnumType.STRING)
    private SeverityLevel severityLevel;
    private LocalDate administrationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @jakarta.validation.constraints.AssertTrue(message = "Outcome score is out of bounds for the selected measure type")
    private boolean isScoreValid() {
        if (totalScore == null || measureType == null) return true;
        
        switch(measureType) {
            case PHQ_9:
                return totalScore >= 0 && totalScore <= 27;
            case GAD_7:
                return totalScore >= 0 && totalScore <= 21;
            default:
                return true;
        }
    }

    public OutcomeMeasure() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MeasureType getMeasureType() { return measureType; }
    public void setMeasureType(MeasureType measureType) { this.measureType = measureType; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public Integer getClinicalScore() { return totalScore; }
    public void setClinicalScore(Integer clinicalScore) { this.totalScore = clinicalScore; }

    public SeverityLevel getSeverityLevel() { return severityLevel; }
    public void setSeverityLevel(SeverityLevel severityLevel) { this.severityLevel = severityLevel; }

    public LocalDate getAdministrationDate() { return administrationDate; }
    public void setAdministrationDate(LocalDate administrationDate) { this.administrationDate = administrationDate; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
}
