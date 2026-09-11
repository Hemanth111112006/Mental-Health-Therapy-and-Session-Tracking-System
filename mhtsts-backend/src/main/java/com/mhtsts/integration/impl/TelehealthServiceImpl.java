package com.mhtsts.integration.impl;

import com.mhtsts.integration.TelehealthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Collections;

@Service
public class TelehealthServiceImpl implements TelehealthService {

    private static final Logger logger = LoggerFactory.getLogger(TelehealthServiceImpl.class);

    @Override
    public String generateHIPAAWebRTCLink(Long appointmentId) {
        String link = "https://secure.telehealth.mock/" + UUID.randomUUID();
        logger.info("MOCK: Generated HIPAA WebRTC link for appointment {}: {}", appointmentId, link);
        return link;
    }

    @Override
    public Object initializeVirtualWaitingRoom() {
        logger.info("MOCK: Initializing virtual waiting room");
        return Collections.singletonMap("status", "WAITING_ROOM_READY");
    }

    @Override
    public void manageConsent(Long clientId, boolean consented) {
        logger.info("MOCK: Managed recording consent for client {}: {}", clientId, consented);
    }

    @Override
    public String saveEncryptedSessionRecording(Long appointmentId, byte[] recordingData) {
        logger.info("MOCK: Saved encrypted session recording for appointment {}", appointmentId);
        return "s3://mock-secure-bucket/recordings/" + appointmentId + ".enc";
    }
}
