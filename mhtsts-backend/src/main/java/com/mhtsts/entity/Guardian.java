package com.mhtsts.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "guardians")
public class Guardian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fields can be expanded later if required by other parts of the system.
    // For now, this satisfies the SRS requirement for a foreign key relationship.

    public Guardian() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
