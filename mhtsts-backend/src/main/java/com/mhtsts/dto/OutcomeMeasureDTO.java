package com.mhtsts.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutcomeMeasureDTO {

    private Long id;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    // Frontend may send instrumentName OR measureType — we accept both
    private String instrumentName; // maps to measureType: PHQ_9, GAD_7, OTHER
    private String measureType;    // e.g. "PHQ_9", "GAD_7", "OTHER"

    // Frontend may send score OR totalScore — we accept both
    private Integer score;
    private Integer totalScore;
    private Double scoreDouble; // for legacy double score

    private LocalDate assessmentDate;       // maps to administrationDate
    private LocalDate administrationDate;

    private String interpretation;
    private String notes;
    private String severityLevel; // MINIMAL, MILD, MODERATE, MODERATELY_SEVERE, SEVERE
}
