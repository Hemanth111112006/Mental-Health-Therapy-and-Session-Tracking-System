package com.mhtsts.repository;

import com.mhtsts.entity.SessionNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionNoteRepository extends JpaRepository<SessionNote, Long> {
}
