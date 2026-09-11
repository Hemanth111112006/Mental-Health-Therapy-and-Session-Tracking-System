package com.mhtsts.security;

import com.mhtsts.entity.User;
import com.mhtsts.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + username)));

        String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

        boolean enabled = user.getIsActive() != null ? user.getIsActive() : true;

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash() != null ? user.getPasswordHash() : "",
                enabled,
                true,
                true,
                true,
                Collections.singletonList(authority)
        );
    }
}
