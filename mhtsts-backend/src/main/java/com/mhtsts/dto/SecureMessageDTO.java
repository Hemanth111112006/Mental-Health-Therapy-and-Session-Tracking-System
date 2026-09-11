package com.mhtsts.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecureMessageDTO {
    private Long id;
    private Long senderId;
    private Long recipientId;
    private Long receiverId; // alias for recipientId
    private String messageContent; // primary field
    private String body; // alias for messageContent
    private LocalDateTime sentAt;
    private Boolean readStatus;
}
