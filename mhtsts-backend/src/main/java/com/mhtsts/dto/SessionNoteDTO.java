package com.mhtsts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionNoteDTO {

    private Long id;

    private Long appointmentId;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "Therapist ID is required")
    private Long therapistId;

    private String noteFormat;

    @NotBlank(message = "Note content is required")
    private String noteContent;

    private String diagnosisPrimary;

    private String diagnosisSecondary;

    @Pattern(regexp = "^[0-9]{5}$", message = "CPT code must be 5 digits")
    private String cptCode;

    @Min(value = 15, message = "Session duration must be at least 15 minutes")
    @Max(value = 240, message = "Session duration must not exceed 240 minutes")
    private Integer sessionDurationMinutes;

    private Boolean isLate;
}
