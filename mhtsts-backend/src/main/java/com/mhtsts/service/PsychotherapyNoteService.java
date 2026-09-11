package com.mhtsts.service;

import com.mhtsts.entity.PsychotherapyNote;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.PsychotherapyNoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PsychotherapyNoteService {

    private final PsychotherapyNoteRepository psychotherapyNoteRepository;

    public PsychotherapyNoteService(PsychotherapyNoteRepository psychotherapyNoteRepository) {
        this.psychotherapyNoteRepository = psychotherapyNoteRepository;
    }

    public PsychotherapyNote createPsychotherapyNote(PsychotherapyNote note) {
        if (note.getCreatedAt() == null) {
            note.setCreatedAt(LocalDateTime.now());
        }
        return psychotherapyNoteRepository.save(note);
    }

    public PsychotherapyNote getPsychotherapyNote(Long id) {
        return psychotherapyNoteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PsychotherapyNote not found with id: " + id));
    }

    public PsychotherapyNote updatePsychotherapyNote(Long id, PsychotherapyNote noteDetails) {
        PsychotherapyNote existingNote = getPsychotherapyNote(id);
        existingNote.setNoteContent(noteDetails.getNoteContent());
        existingNote.setIsConfidential(noteDetails.getIsConfidential());
        return psychotherapyNoteRepository.save(existingNote);
    }
}
