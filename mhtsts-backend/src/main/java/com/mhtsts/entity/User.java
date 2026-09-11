package com.mhtsts.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(nullable = false)
    private String passwordHash;
    private String role;
    private String licenseNumber;
    private String licenseType;
    private String licenseState;
    private LocalDate licenseExpiry;
    private Long supervisorId;
    private LocalDateTime createdDate;
    private LocalDateTime lastLogin;
    private Boolean isActive;

    @jakarta.validation.constraints.AssertTrue(message = "Clinician license must be alphanumeric and is required for clinicians")
    private boolean isLicenseValid() {
        if ("THERAPIST".equalsIgnoreCase(role) || "PSYCHIATRIST".equalsIgnoreCase(role) || "PSYCHOLOGIST".equalsIgnoreCase(role)) {
            return licenseNumber != null && licenseNumber.matches("^[a-zA-Z0-9]+$");
        }
        return true;
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "assignedTherapist", fetch = FetchType.LAZY)
    private List<Client> clients;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "therapist", fetch = FetchType.LAZY)
    private List<Appointment> therapistAppointments;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getLicenseType() { return licenseType; }
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }

    public String getLicenseState() { return licenseState; }
    public void setLicenseState(String licenseState) { this.licenseState = licenseState; }

    public LocalDate getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(LocalDate licenseExpiry) { this.licenseExpiry = licenseExpiry; }

    public Long getSupervisorId() { return supervisorId; }
    public void setSupervisorId(Long supervisorId) { this.supervisorId = supervisorId; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<Client> getClients() { return clients; }
    public void setClients(List<Client> clients) { this.clients = clients; }

    public List<Appointment> getTherapistAppointments() { return therapistAppointments; }
    public void setTherapistAppointments(List<Appointment> therapistAppointments) { this.therapistAppointments = therapistAppointments; }
}
