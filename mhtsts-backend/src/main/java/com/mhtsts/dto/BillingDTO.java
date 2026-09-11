package com.mhtsts.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillingDTO {

    private Long id;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    private Long appointmentId;

    private String insuranceId;

    @Pattern(regexp = "^[0-9]{5}$", message = "CPT code must be 5 digits")
    private String cptCode;

    @DecimalMin(value = "0.0", inclusive = true, message = "Amount must be greater than or equal to 0")
    private BigDecimal amount;

    private String billingStatus;
}
