package com.mhtsts.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "insurance_policies")
public class InsurancePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fields can be expanded later if required by other parts of the system.
    // For now, this satisfies the SRS requirement for a foreign key relationship.

    public InsurancePolicy() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
