package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.SessionNote;
import com.mhtsts.service.SessionNoteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/session-notes")
public class SessionNoteController {

    private final SessionNoteService sessionNoteService;

    public SessionNoteController(SessionNoteService sessionNoteService) {
        this.sessionNoteService = sessionNoteService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SessionNote>> createSessionNote(@Valid @RequestBody SessionNote note) {
        SessionNote savedNote = sessionNoteService.createSessionNote(note);
        return new ResponseEntity<>(
                ApiResponse.success("Session note created successfully", savedNote),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SessionNote>>> getAllSessionNotes() {
        return ResponseEntity.ok(ApiResponse.success("All session notes retrieved", sessionNoteService.getSessionNotes()));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<ApiResponse<List<SessionNote>>> getClientSessionHistory(@PathVariable Long clientId) {
        List<SessionNote> clientNotes = sessionNoteService.getSessionNotes().stream()
                .filter(n -> n.getClient() != null && n.getClient().getId().equals(clientId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Client session history retrieved", clientNotes));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SessionNote>> updateSessionNote(@PathVariable Long id, @Valid @RequestBody SessionNote noteDetails) {
        try {
            SessionNote updated = sessionNoteService.updateSessionNote(id, noteDetails);
            return ResponseEntity.ok(ApiResponse.success("Session note updated successfully", updated));
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSessionNote(@PathVariable Long id) {
        try {
            sessionNoteService.deleteSessionNote(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(ApiResponse.error(e.getMessage()), HttpStatus.CONFLICT);
        }
    }

    @PutMapping("/{id}/sign")
    public ResponseEntity<ApiResponse<SessionNote>> signSessionNote(@PathVariable Long id, @RequestParam Long therapistId) {
        SessionNote note = sessionNoteService.therapistSignSessionNote(id, therapistId);
        return ResponseEntity.ok(ApiResponse.success("Therapist signature applied", note));
    }

    @PutMapping("/{id}/cosign")
    public ResponseEntity<ApiResponse<SessionNote>> cosignSessionNote(@PathVariable Long id, @RequestParam Long supervisorId) {
        SessionNote signedNote = sessionNoteService.signSessionNote(id, supervisorId);
        return ResponseEntity.ok(ApiResponse.success("Supervisor co-signature applied", signedNote));
    }
}
