package com.mhtsts.integration;

public interface CrisisDirectoryService {
    Object getEmergencyDirectory();
    void dispatchEmergencyProtocol(Long clientId, String location);
}
