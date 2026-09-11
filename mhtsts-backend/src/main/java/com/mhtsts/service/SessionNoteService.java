package com.mhtsts.service;

import com.mhtsts.entity.SessionNote;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.SessionNoteRepository;
import com.mhtsts.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionNoteService {

    private final SessionNoteRepository sessionNoteRepository;
    private final UserRepository userRepository;

    public SessionNoteService(SessionNoteRepository sessionNoteRepository, UserRepository userRepository) {
        this.sessionNoteRepository = sessionNoteRepository;
        this.userRepository = userRepository;
    }

    public SessionNote createSessionNote(SessionNote note) {
        if (note.getCreatedAt() == null) {
            note.setCreatedAt(LocalDateTime.now());
        }
        return sessionNoteRepository.save(note);
    }

    public List<SessionNote> getSessionNotes() {
        return sessionNoteRepository.findAll();
    }

    public SessionNote getSessionNoteById(Long id) {
        return sessionNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SessionNote not found with id: " + id));
    }

    public SessionNote updateSessionNote(Long id, SessionNote noteDetails) {
        SessionNote note = getSessionNoteById(id);
        if (Boolean.TRUE.equals(note.getIsSigned())) {
            throw new IllegalStateException("Cannot modify a signed session note.");
        }
        note.setNoteFormat(noteDetails.getNoteFormat());
        note.setNoteContent(noteDetails.getNoteContent());
        note.setDiagnosisPrimary(noteDetails.getDiagnosisPrimary());
        note.setCptCode(noteDetails.getCptCode());
        note.setSessionDurationMinutes(noteDetails.getSessionDurationMinutes());
        note.setIsLate(noteDetails.getIsLate());
        note.setLastModifiedAt(LocalDateTime.now());
        return sessionNoteRepository.save(note);
    }

    public void deleteSessionNote(Long id) {
        SessionNote note = getSessionNoteById(id);
        if (Boolean.TRUE.equals(note.getIsSigned()) || note.getSupervisorSignedAt() != null) {
            throw new IllegalStateException("Cannot delete a signed session note.");
        }
        sessionNoteRepository.delete(note);
    }

    public SessionNote signSessionNote(Long id, Long supervisorId) {
        SessionNote note = getSessionNoteById(id);
        note.setSupervisor(userRepository.findById(supervisorId).orElse(null));
        note.setSupervisorSignedAt(LocalDateTime.now());
        return sessionNoteRepository.save(note);
    }

    public SessionNote therapistSignSessionNote(Long id, Long therapistId) {
        SessionNote note = getSessionNoteById(id);
        note.setIsSigned(true);
        note.setTherapist(userRepository.findById(therapistId).orElse(note.getTherapist()));
        note.setLastModifiedAt(LocalDateTime.now());
        return sessionNoteRepository.save(note);
    }
}
