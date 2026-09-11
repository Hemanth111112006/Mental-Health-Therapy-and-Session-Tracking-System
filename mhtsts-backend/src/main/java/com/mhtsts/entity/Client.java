package com.mhtsts.entity;

import com.mhtsts.entity.enums.ClientStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "clients")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20, updatable = false)
    private String clientNumber;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must contain only alphabetic characters")
    @Size(min = 1, max = 100)
    @Convert(converter = com.mhtsts.security.StringCryptoConverter.class)
    @Column(nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must contain only alphabetic characters")
    @Size(min = 1, max = 100)
    @Convert(converter = com.mhtsts.security.StringCryptoConverter.class)
    @Column(nullable = false, length = 100)
    private String lastName;

    @NotNull(message = "Invalid date of birth")
    @Past(message = "Invalid date of birth")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @AssertTrue(message = "Invalid date of birth")
    private boolean isAgeValid() {
        if (dateOfBirth == null) return true;
        int age = LocalDate.now().getYear() - dateOfBirth.getYear();
        return age >= 0 && age <= 120;
    }

    @Column(length = 50)
    private String gender;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9\\-\\+\\s\\(\\)]{7,25}$", message = "Phone must be a valid phone number")
    @Column(nullable = false, length = 25)
    private String phoneNumber;

    @Email(message = "Please enter a valid email address")
    @Column(unique = true, length = 100)
    private String email;

    @NotBlank(message = "Emergency contact name is required")
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String emergencyContactName;

    @NotBlank(message = "Emergency contact phone is required")
    @Pattern(regexp = "^[0-9\\-\\+\\s\\(\\)]{7,25}$", message = "Emergency contact phone must be a valid phone number")
    @Column(nullable = false, length = 25)
    private String emergencyContactPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insurance_id")
    private InsurancePolicy insurance;

    @Enumerated(EnumType.STRING)
    private ClientStatus status;

    private LocalDate intakeDate;

    @Column(columnDefinition = "boolean default false")
    private Boolean isMinor = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guardian_id")
    private Guardian guardian;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_therapist_id")
    private User assignedTherapist;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<AppointmentParticipant> appointmentParticipants;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<SessionNote> sessionNotes;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<TreatmentPlan> treatmentPlans;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<CrisisAssessment> crisisAssessments;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<SafetyPlan> safetyPlans;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
    private List<OutcomeMeasure> outcomeMeasures;

    public Client() {}

    @PrePersist
    protected void onCreate() {
        if (this.clientNumber == null) {
            this.clientNumber = "CLN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientNumber() { return clientNumber; }
    public void setClientNumber(String clientNumber) { this.clientNumber = clientNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPhone() { return phoneNumber; }
    public void setPhone(String phone) { this.phoneNumber = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public String getEmergencyPhone() { return emergencyContactPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyContactPhone = emergencyPhone; }

    public InsurancePolicy getInsurance() { return insurance; }
    public void setInsurance(InsurancePolicy insurance) { this.insurance = insurance; }

    public ClientStatus getStatus() { return status; }
    public void setStatus(ClientStatus status) { this.status = status; }

    public LocalDate getIntakeDate() { return intakeDate; }
    public void setIntakeDate(LocalDate intakeDate) { this.intakeDate = intakeDate; }

    public Boolean getIsMinor() { return isMinor; }
    public void setIsMinor(Boolean isMinor) { this.isMinor = isMinor; }

    public Guardian getGuardian() { return guardian; }
    public void setGuardian(Guardian guardian) { this.guardian = guardian; }

    public User getAssignedTherapist() { return assignedTherapist; }
    public void setAssignedTherapist(User assignedTherapist) { this.assignedTherapist = assignedTherapist; }

    public List<AppointmentParticipant> getAppointmentParticipants() { return appointmentParticipants; }
    public void setAppointmentParticipants(List<AppointmentParticipant> appointmentParticipants) { this.appointmentParticipants = appointmentParticipants; }

    public List<SessionNote> getSessionNotes() { return sessionNotes; }
    public void setSessionNotes(List<SessionNote> sessionNotes) { this.sessionNotes = sessionNotes; }

    public List<TreatmentPlan> getTreatmentPlans() { return treatmentPlans; }
    public void setTreatmentPlans(List<TreatmentPlan> treatmentPlans) { this.treatmentPlans = treatmentPlans; }

    public List<CrisisAssessment> getCrisisAssessments() { return crisisAssessments; }
    public void setCrisisAssessments(List<CrisisAssessment> crisisAssessments) { this.crisisAssessments = crisisAssessments; }

    public List<SafetyPlan> getSafetyPlans() { return safetyPlans; }
    public void setSafetyPlans(List<SafetyPlan> safetyPlans) { this.safetyPlans = safetyPlans; }

    public List<OutcomeMeasure> getOutcomeMeasures() { return outcomeMeasures; }
    public void setOutcomeMeasures(List<OutcomeMeasure> outcomeMeasures) { this.outcomeMeasures = outcomeMeasures; }
}
