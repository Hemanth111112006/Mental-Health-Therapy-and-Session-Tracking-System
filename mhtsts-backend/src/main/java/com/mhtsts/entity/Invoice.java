package com.mhtsts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id")
    private Client client;

    private String serviceDescription;
    private String cptCode;
    private String providerName;
    private LocalDate serviceDate;

    private Double billedAmount;
    private Double insurancePaid;
    private Double clientResponsibility;

    private String status; // PAID, PENDING, SUBMITTED, DENIED
    private String paymentMethod;
    private LocalDate paidDate;

    private LocalDateTime createdAt;

    public Invoice() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getServiceDescription() { return serviceDescription; }
    public void setServiceDescription(String serviceDescription) { this.serviceDescription = serviceDescription; }

    public String getCptCode() { return cptCode; }
    public void setCptCode(String cptCode) { this.cptCode = cptCode; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public LocalDate getServiceDate() { return serviceDate; }
    public void setServiceDate(LocalDate serviceDate) { this.serviceDate = serviceDate; }

    public Double getBilledAmount() { return billedAmount; }
    public void setBilledAmount(Double billedAmount) { this.billedAmount = billedAmount; }

    public Double getInsurancePaid() { return insurancePaid; }
    public void setInsurancePaid(Double insurancePaid) { this.insurancePaid = insurancePaid; }

    public Double getClientResponsibility() { return clientResponsibility; }
    public void setClientResponsibility(Double clientResponsibility) { this.clientResponsibility = clientResponsibility; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
