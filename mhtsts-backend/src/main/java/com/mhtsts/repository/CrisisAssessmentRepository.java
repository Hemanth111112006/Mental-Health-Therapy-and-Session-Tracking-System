package com.mhtsts.repository;

import com.mhtsts.entity.CrisisAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface CrisisAssessmentRepository extends JpaRepository<CrisisAssessment, Long> {
    void deleteByAssessmentDateBefore(LocalDateTime date);
}
