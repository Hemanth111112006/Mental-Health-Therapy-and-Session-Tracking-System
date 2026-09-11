package com.mhtsts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SafetyPlanDTO {
    private Long id;
    private Long clientId;
    private Long therapistId;
    private String warningSigns;
    private String copingStrategies;
    private String socialSupports;
    private String emergencyContacts;
    private String crisisLines;
}
