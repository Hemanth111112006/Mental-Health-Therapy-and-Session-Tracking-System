package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.SessionNote;
import com.mhtsts.entity.User;
import com.mhtsts.service.SessionNoteService;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.repository.SessionNoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/supervision")
@PreAuthorize("hasRole('SUPERVISOR') or hasRole('ADMIN')")
public class SupervisionController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionNoteRepository sessionNoteRepository;

    @Autowired
    private SessionNoteService sessionNoteService;

    @GetMapping("/supervisees")
    public ResponseEntity<ApiResponse<List<User>>> getSupervisees(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }
        List<User> supervisees = userRepository.findAll().stream()
                .filter(u -> currentUser.getId().equals(u.getSupervisorId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Supervisees retrieved", supervisees));
    }

    @GetMapping("/reviews/pending")
    public ResponseEntity<ApiResponse<List<SessionNote>>> getPendingReviews(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        if (currentUser == null) {
            return ResponseEntity.badRequest().build();
        }
        List<SessionNote> pendingNotes = sessionNoteRepository.findAll().stream()
                .filter(n -> n.getSupervisor() != null && 
                             n.getSupervisor().getId().equals(currentUser.getId()) && 
                             n.getSupervisorSignedAt() == null)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Pending reviews retrieved", pendingNotes));
    }

    @PostMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<SessionNote>> submitReview(@PathVariable Long id, @RequestBody Map<String, Object> reviewData, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElse(null);
        SessionNote note = sessionNoteService.getSessionNoteById(id);
        
        if (currentUser != null && note.getSupervisor() != null && note.getSupervisor().getId().equals(currentUser.getId())) {
            note.setSupervisorSignedAt(LocalDateTime.now());
            sessionNoteRepository.save(note);
        }
        return ResponseEntity.ok(ApiResponse.success("Review submitted", note));
    }
}
