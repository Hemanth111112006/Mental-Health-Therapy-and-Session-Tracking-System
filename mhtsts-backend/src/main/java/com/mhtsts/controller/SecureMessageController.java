package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.SecureMessageDTO;
import com.mhtsts.entity.SecureMessage;
import com.mhtsts.entity.User;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.service.SecureMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class SecureMessageController {

    private final SecureMessageService secureMessageService;
    private final UserRepository userRepository;

    public SecureMessageController(SecureMessageService secureMessageService, UserRepository userRepository) {
        this.secureMessageService = secureMessageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/secure")
    public ResponseEntity<ApiResponse<SecureMessage>> sendMessage(@RequestBody SecureMessageDTO dto, org.springframework.security.core.Authentication authentication) {
        SecureMessage message = new SecureMessage();

        if (dto.getSenderId() != null) {
            userRepository.findById(dto.getSenderId()).ifPresent(message::setSender);
        }
        if (message.getSender() == null && authentication != null) {
            userRepository.findByUsername(authentication.getName()).ifPresent(message::setSender);
        }
        if (dto.getRecipientId() != null) {
            userRepository.findById(dto.getRecipientId()).ifPresent(message::setRecipient);
        } else if (dto.getReceiverId() != null) {
            userRepository.findById(dto.getReceiverId()).ifPresent(message::setRecipient);
        }

        // Accept messageContent OR body
        String content = dto.getMessageContent() != null ? dto.getMessageContent() : dto.getBody();
        if (content == null) content = "";
        message.setEncryptedBody(content);
        message.setSentAt(LocalDateTime.now());

        SecureMessage sent = secureMessageService.sendMessage(message);
        return new ResponseEntity<>(ApiResponse.success("Secure message sent successfully", sent), HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SecureMessage>> sendMessageAlt(@RequestBody SecureMessageDTO dto, org.springframework.security.core.Authentication authentication) {
        return sendMessage(dto, authentication);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<SecureMessage>>> getUserMessages(@PathVariable Long userId) {
        List<SecureMessage> messages = secureMessageService.getMessages().stream()
                .filter(m -> (m.getSender() != null && m.getSender().getId().equals(userId)) ||
                             (m.getRecipient() != null && m.getRecipient().getId().equals(userId)))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("User messages retrieved", messages));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SecureMessage>>> getConversations(Authentication authentication) {
        List<SecureMessage> messages = secureMessageService.getMessages().stream()
                .filter(m -> (m.getSender() != null && m.getSender().getUsername().equals(authentication.getName())) ||
                             (m.getRecipient() != null && m.getRecipient().getUsername().equals(authentication.getName())))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved", messages));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<SecureMessage>> markMessageRead(@PathVariable Long id) {
        SecureMessage message = secureMessageService.markMessageRead(id);
        return ResponseEntity.ok(ApiResponse.success("Message marked as read", message));
    }
}
