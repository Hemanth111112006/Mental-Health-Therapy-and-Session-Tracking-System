package com.mhtsts.service;

import com.mhtsts.entity.SecureMessage;
import com.mhtsts.exception.ResourceNotFoundException;
import com.mhtsts.repository.SecureMessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SecureMessageService {

    private final SecureMessageRepository secureMessageRepository;

    public SecureMessageService(SecureMessageRepository secureMessageRepository) {
        this.secureMessageRepository = secureMessageRepository;
    }

    public SecureMessage sendMessage(SecureMessage message) {
        if (message.getSentAt() == null) {
            message.setSentAt(LocalDateTime.now());
        }
        return secureMessageRepository.save(message);
    }

    public List<SecureMessage> getMessages() {
        return secureMessageRepository.findAll();
    }

    public SecureMessage getMessageById(Long id) {
        return secureMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SecureMessage not found with id: " + id));
    }

    public SecureMessage markMessageRead(Long id) {
        SecureMessage message = getMessageById(id);
        message.setReadAt(LocalDateTime.now());
        return secureMessageRepository.save(message);
    }
}
