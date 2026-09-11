package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.PsychotherapyNoteDTO;
import com.mhtsts.entity.PsychotherapyNote;
import com.mhtsts.service.PsychotherapyNoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/psychotherapy-notes")
@PreAuthorize("hasAnyRole('THERAPIST', 'PSYCHIATRIST', 'PSYCHOLOGIST')")
public class PsychotherapyNoteController {

    private final PsychotherapyNoteService psychotherapyNoteService;

    public PsychotherapyNoteController(PsychotherapyNoteService psychotherapyNoteService) {
        this.psychotherapyNoteService = psychotherapyNoteService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PsychotherapyNote>> createNote(@Valid @RequestBody PsychotherapyNote note) {
        PsychotherapyNote savedNote = psychotherapyNoteService.createPsychotherapyNote(note);
        return new ResponseEntity<>(
                ApiResponse.success("Confidential psychotherapy note saved", savedNote),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PsychotherapyNote>> getNoteById(@PathVariable Long id) {
        PsychotherapyNote note = psychotherapyNoteService.getPsychotherapyNote(id);
        return ResponseEntity.ok(ApiResponse.success("Psychotherapy note retrieved", note));
    }
}
