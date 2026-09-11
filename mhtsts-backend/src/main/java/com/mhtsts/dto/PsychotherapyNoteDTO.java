package com.mhtsts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PsychotherapyNoteDTO {

    private Long id;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "Therapist ID is required")
    private Long therapistId;

    @NotBlank(message = "Note content is required")
    private String noteContent;

    private LocalDateTime createdAt;
}
