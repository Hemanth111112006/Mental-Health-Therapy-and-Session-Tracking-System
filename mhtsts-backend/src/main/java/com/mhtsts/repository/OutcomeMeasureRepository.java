package com.mhtsts.repository;

import com.mhtsts.entity.OutcomeMeasure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OutcomeMeasureRepository extends JpaRepository<OutcomeMeasure, Long> {
}
