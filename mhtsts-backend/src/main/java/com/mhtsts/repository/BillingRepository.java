package com.mhtsts.repository;

import com.mhtsts.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    void deleteByClaimSubmissionDateBefore(LocalDate date);
}
