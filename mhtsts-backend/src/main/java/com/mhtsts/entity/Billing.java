package com.mhtsts.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "billing")
public class Billing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    private String insuranceId;
    private String cptCode;
    private BigDecimal billedAmount;
    private BigDecimal insurancePaid;
    private BigDecimal clientResponsibility;
    private String status;
    private LocalDate claimSubmissionDate;

    public Billing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }

    public String getInsuranceId() { return insuranceId; }
    public void setInsuranceId(String insuranceId) { this.insuranceId = insuranceId; }

    public String getCptCode() { return cptCode; }
    public void setCptCode(String cptCode) { this.cptCode = cptCode; }

    public BigDecimal getBilledAmount() { return billedAmount; }
    public void setBilledAmount(BigDecimal billedAmount) { this.billedAmount = billedAmount; }

    public BigDecimal getInsurancePaid() { return insurancePaid; }
    public void setInsurancePaid(BigDecimal insurancePaid) { this.insurancePaid = insurancePaid; }

    public BigDecimal getClientResponsibility() { return clientResponsibility; }
    public void setClientResponsibility(BigDecimal clientResponsibility) { this.clientResponsibility = clientResponsibility; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getClaimSubmissionDate() { return claimSubmissionDate; }
    public void setClaimSubmissionDate(LocalDate claimSubmissionDate) { this.claimSubmissionDate = claimSubmissionDate; }
}
