package com.mhtsts.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreatmentPlanDTO {

    private Long id;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "Therapist ID is required")
    private Long therapistId;

    private String goals;

    private String objectives;

    private String interventions;

    private String progressStatus;

    private LocalDate createdDate;
}
