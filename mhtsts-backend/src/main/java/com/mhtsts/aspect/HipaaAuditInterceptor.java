package com.mhtsts.aspect;

import com.mhtsts.entity.AuditLog;
import com.mhtsts.entity.User;
import com.mhtsts.repository.AuditLogRepository;
import com.mhtsts.repository.UserRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class HipaaAuditInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(HipaaAuditInterceptor.class);
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public HipaaAuditInterceptor(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @AfterReturning("execution(* com.mhtsts.controller.ClientController.get*(..))")
    public void logClientAccess(JoinPoint joinPoint) {
        logAccess(joinPoint, "Client Record Accessed");
    }

    @AfterReturning("execution(* com.mhtsts.controller.SessionNoteController.get*(..))")
    public void logSessionNoteAccess(JoinPoint joinPoint) {
        logAccess(joinPoint, "Session Note Accessed");
    }

    private void logAccess(JoinPoint joinPoint, String actionMessage) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            String username = auth.getName();
            User user = userRepository.findByUsername(username).orElse(null);

            if (user != null) {
                AuditLog log = new AuditLog();
                log.setUser(user);
                log.setAction("READ");
                log.setEntityName(joinPoint.getSignature().getDeclaringTypeName());
                log.setDetails(actionMessage + " via method: " + joinPoint.getSignature().getName());
                log.setTimestamp(LocalDateTime.now());
                auditLogRepository.save(log);
                logger.info("HIPAA Audit: User {} accessed {} at {}", username, joinPoint.getSignature().getName(), LocalDateTime.now());
            }
        }
    }
}
