package com.mhtsts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrisisAssessmentDTO {
    private Long id;
    private Long clientId;
    private Long therapistId;
    private LocalDateTime assessmentDate;
    private String suicidalityLevel;
    private String homicidalityLevel;
    private String selfHarmRisk;
    private Long safetyPlanId;
    private String actionTaken;
    private Boolean supervisorNotified;
    private Boolean hospitalized;
    private String hospitalName;
}
