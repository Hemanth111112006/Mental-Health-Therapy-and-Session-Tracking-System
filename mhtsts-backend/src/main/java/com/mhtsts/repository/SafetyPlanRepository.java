package com.mhtsts.repository;

import com.mhtsts.entity.SafetyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SafetyPlanRepository extends JpaRepository<SafetyPlan, Long> {
}
