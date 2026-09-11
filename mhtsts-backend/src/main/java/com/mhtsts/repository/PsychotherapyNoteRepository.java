package com.mhtsts.repository;

import com.mhtsts.entity.PsychotherapyNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PsychotherapyNoteRepository extends JpaRepository<PsychotherapyNote, Long> {
}
