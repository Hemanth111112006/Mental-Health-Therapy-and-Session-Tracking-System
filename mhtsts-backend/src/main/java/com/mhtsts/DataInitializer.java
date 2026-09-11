package com.mhtsts;

import com.mhtsts.entity.User;
import com.mhtsts.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        createUserIfNotFound("admin@mindcare.com", "admin123", "ADMIN");
        createUserIfNotFound("therapist@mindcare.com", "therapist123", "THERAPIST");
        createUserIfNotFound("psychologist@mindcare.com", "psychologist123", "PSYCHOLOGIST");
        createUserIfNotFound("psychiatrist@mindcare.com", "psychiatrist123", "PSYCHIATRIST");
        createUserIfNotFound("case_manager@mindcare.com", "case123", "CASE_MANAGER");
        createUserIfNotFound("receptionist@mindcare.com", "receptionist123", "RECEPTIONIST");
        createUserIfNotFound("supervisor@mindcare.com", "supervisor123", "SUPERVISOR");
        createUserIfNotFound("client@mindcare.com", "client123", "CLIENT");
        createUserIfNotFound("counselor@mindcare.com", "counselor123", "COUNSELOR");
    }

    private void createUserIfNotFound(String emailAsUsername, String password, String role) {
        User user = userRepository.findByUsername(emailAsUsername).orElse(null);
        if (user == null) {
            user = new User();
            user.setUsername(emailAsUsername);
            user.setEmail(emailAsUsername);
            user.setCreatedDate(LocalDateTime.now());
        }
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        if ("THERAPIST".equalsIgnoreCase(role) || "PSYCHIATRIST".equalsIgnoreCase(role) || "PSYCHOLOGIST".equalsIgnoreCase(role)) {
            user.setLicenseNumber("LIC12345");
        }
        user.setIsActive(true);
        userRepository.save(user);
    }
}
