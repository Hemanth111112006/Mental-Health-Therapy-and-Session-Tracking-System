package com.mhtsts.integration;

public interface TelehealthService {
    String generateHIPAAWebRTCLink(Long appointmentId);
    Object initializeVirtualWaitingRoom();
    void manageConsent(Long clientId, boolean consented);
    String saveEncryptedSessionRecording(Long appointmentId, byte[] recordingData);
}
