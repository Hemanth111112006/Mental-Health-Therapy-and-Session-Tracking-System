package com.mhtsts.controller;

import com.mhtsts.entity.AuditLog;
import com.mhtsts.entity.User;
import com.mhtsts.repository.AuditLogRepository;
import com.mhtsts.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/crisis")
public class EmergencyUnblindingController {

    private static final Logger logger = LoggerFactory.getLogger(EmergencyUnblindingController.class);
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public EmergencyUnblindingController(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/emergency-unblind/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<?> unblindCrisisRisk(@PathVariable Long clientId, Authentication auth) {
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Log the unblinding event
        AuditLog log = new AuditLog();
        log.setUser(user);
        log.setAction("EMERGENCY_UNBLIND");
        log.setEntityName("CrisisRisk");
        log.setEntityId(clientId);
        log.setDetails("Emergency unblinding activated for Client ID " + clientId);
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        logger.warn("EMERGENCY UNBLINDING trigger by User {} for Client {}", username, clientId);

        // Mock revealing the risk data
        return ResponseEntity.ok().body("Crisis risk temporarily unblinded for Client " + clientId);
    }
}
