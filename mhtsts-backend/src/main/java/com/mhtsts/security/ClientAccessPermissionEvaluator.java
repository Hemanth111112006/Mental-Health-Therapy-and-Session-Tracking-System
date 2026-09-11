package com.mhtsts.security;

import com.mhtsts.entity.Client;
import com.mhtsts.entity.User;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.UserRepository;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Optional;

@Component("customPermissionEvaluator")
public class ClientAccessPermissionEvaluator implements PermissionEvaluator {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientAccessPermissionEvaluator(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (authentication == null || targetDomainObject == null || !(permission instanceof String)) {
            return false;
        }
        return hasPrivilege(authentication, targetDomainObject.getClass().getSimpleName(), (String) permission, null);
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        if (authentication == null || targetType == null || !(permission instanceof String)) {
            return false;
        }
        return hasPrivilege(authentication, targetType, (String) permission, (Long) targetId);
    }

    private boolean hasPrivilege(Authentication auth, String targetType, String permission, Long targetId) {
        String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("");
        
        if (role.equals("ROLE_ADMIN") || role.equals("ROLE_SUPERVISOR")) {
            return true;
        }
        
        if ("Client".equalsIgnoreCase(targetType) && targetId != null) {
            if (role.equals("ROLE_CLIENT")) {
                return userRepository.findByUsername(auth.getName()).map(User::getId).orElse(-1L).equals(targetId);
            }
            return role.startsWith("ROLE_"); // Other clinicians have access for now unless specified
        }
        return false;
    }
}
