package com.mhtsts.service.privacy;

import com.mhtsts.entity.Client;
import com.mhtsts.entity.User;
import com.mhtsts.exception.MinorAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MinorClientAccessService {

    private static final Logger logger = LoggerFactory.getLogger(MinorClientAccessService.class);

    public void validateGuardianAccess(Client minorClient, User requestingUser) {
        if (Boolean.TRUE.equals(minorClient.getIsMinor())) {
            // Business Rule: Ensure requesting user is legally linked guardian
            if (minorClient.getGuardian() == null || !minorClient.getGuardian().getId().equals(requestingUser.getId())) {
                logger.warn("Unauthorized access attempt to minor record Client {} by User {}", minorClient.getId(), requestingUser.getId());
                throw new MinorAccessException("Unauthorized access. Requesting user is not the legal guardian for this minor.");
            }
        }
    }
}
