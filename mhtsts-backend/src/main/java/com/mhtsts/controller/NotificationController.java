package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.entity.Notification;
import com.mhtsts.entity.User;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Notification> notifications = notificationService.getNotificationsForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notifications));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notificationService.markRead(id)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationService.markAllReadForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> createNotification(
            @RequestBody java.util.Map<String, Object> payload,
            Authentication authentication) {
        Long targetUserId = null;
        if (payload.containsKey("userId") && payload.get("userId") != null) {
            targetUserId = Long.valueOf(payload.get("userId").toString());
        } else if (authentication != null) {
            User current = userRepository.findByUsername(authentication.getName()).orElse(null);
            if (current != null) targetUserId = current.getId();
        }
        if (targetUserId == null) {
            throw new RuntimeException("Target user ID is required for notification");
        }
        String title = payload.getOrDefault("title", "Notification").toString();
        String message = payload.containsKey("message") ? payload.get("message").toString() :
                         (payload.containsKey("body") ? payload.get("body").toString() : "");
        String type = payload.getOrDefault("type", "INFO").toString();
        Long relatedEntityId = null;
        if (payload.containsKey("relatedEntityId") && payload.get("relatedEntityId") != null) {
            relatedEntityId = Long.valueOf(payload.get("relatedEntityId").toString());
        }
        Notification created = notificationService.createNotification(targetUserId, title, message, type, relatedEntityId);
        return new ResponseEntity<>(ApiResponse.success("Notification created successfully", created), org.springframework.http.HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted"));
    }
}
