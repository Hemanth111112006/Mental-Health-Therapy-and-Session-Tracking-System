package com.mhtsts.service;

import com.mhtsts.dto.AuthResponseDTO;
import com.mhtsts.dto.UserDTO;
import com.mhtsts.entity.User;
import com.mhtsts.exception.ValidationException;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mhtsts.repository.TokenBlacklistRepository;
import com.mhtsts.entity.TokenBlacklist;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistRepository tokenBlacklistRepository;
    private final com.mhtsts.repository.ClientRepository clientRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       TokenBlacklistRepository tokenBlacklistRepository,
                       com.mhtsts.repository.ClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
        this.clientRepository = clientRepository;
    }

    public AuthResponseDTO registerUser(UserDTO userDTO, String rawPassword) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new ValidationException("Username is already taken");
        }
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new ValidationException("Email is already registered");
        }

        if (rawPassword == null || !rawPassword.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) {
            throw new ValidationException("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setRole(userDTO.getRole() != null ? userDTO.getRole().toUpperCase() : "CLIENT");
        user.setFirstName(userDTO.getFirstName() != null && !userDTO.getFirstName().trim().isEmpty() ? userDTO.getFirstName().trim() : userDTO.getUsername());
        user.setLastName(userDTO.getLastName() != null ? userDTO.getLastName().trim() : "");
        user.setCreatedDate(LocalDateTime.now());
        user.setIsActive(true);

        if ("THERAPIST".equalsIgnoreCase(user.getRole()) || "PSYCHIATRIST".equalsIgnoreCase(user.getRole()) || "PSYCHOLOGIST".equalsIgnoreCase(user.getRole())) {
            if (userDTO.getLicenseNumber() != null && !userDTO.getLicenseNumber().trim().isEmpty()) {
                user.setLicenseNumber(userDTO.getLicenseNumber().replaceAll("[^a-zA-Z0-9]", ""));
            } else {
                user.setLicenseNumber("LIC" + (System.currentTimeMillis() % 1000000));
            }
            if (userDTO.getLicenseType() != null) user.setLicenseType(userDTO.getLicenseType());
            if (userDTO.getLicenseState() != null) user.setLicenseState(userDTO.getLicenseState());
        }

        User savedUser = userRepository.save(user);
        Long createdClientId = null;

        if ("CLIENT".equalsIgnoreCase(savedUser.getRole())) {
            try {
                com.mhtsts.entity.Client client = new com.mhtsts.entity.Client();
                client.setFirstName(savedUser.getFirstName());
                client.setLastName(savedUser.getLastName() != null && !savedUser.getLastName().isEmpty() ? savedUser.getLastName() : "Client");
                client.setEmail(savedUser.getEmail());
                client.setPhoneNumber(userDTO.getPhone() != null && !userDTO.getPhone().trim().isEmpty() ? userDTO.getPhone().trim() : "555-0100");

                if (userDTO.getDateOfBirth() != null && !userDTO.getDateOfBirth().trim().isEmpty()) {
                    try {
                        client.setDateOfBirth(java.time.LocalDate.parse(userDTO.getDateOfBirth().trim()));
                    } catch (Exception e) {
                        client.setDateOfBirth(java.time.LocalDate.of(1995, 1, 1));
                    }
                } else {
                    client.setDateOfBirth(java.time.LocalDate.of(1995, 1, 1));
                }

                if (userDTO.getGender() != null && !userDTO.getGender().trim().isEmpty()) {
                    client.setGender(userDTO.getGender().trim());
                }

                client.setEmergencyContactName(userDTO.getEmergencyContactName() != null && !userDTO.getEmergencyContactName().trim().isEmpty()
                        ? userDTO.getEmergencyContactName().trim()
                        : "Emergency Contact");
                client.setEmergencyContactPhone(userDTO.getEmergencyContactPhone() != null && !userDTO.getEmergencyContactPhone().trim().isEmpty()
                        ? userDTO.getEmergencyContactPhone().trim()
                        : "555-0199");

                client.setStatus(com.mhtsts.entity.enums.ClientStatus.ACTIVE);
                userRepository.findById(2L).ifPresent(client::setAssignedTherapist);
                com.mhtsts.entity.Client savedClient = clientRepository.save(client);
                createdClientId = savedClient.getId();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getRole(), savedUser.getFirstName(), savedUser.getLastName(), createdClientId);
        Date expiration = jwtUtil.extractExpiration(token);

        AuthResponseDTO response = new AuthResponseDTO(token, savedUser.getUsername(), savedUser.getRole(), expiration);
        response.setUserId(savedUser.getId());
        response.setFirstName(savedUser.getFirstName());
        response.setLastName(savedUser.getLastName());
        response.setClientId(createdClientId);
        return response;
    }

    public AuthResponseDTO authenticateUser(String username, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        User user = userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.findByEmail(username)
                        .orElseThrow(() -> new ValidationException("Invalid username or password")));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        Long clientId = null;
        if ("CLIENT".equalsIgnoreCase(user.getRole())) {
            try {
                clientId = clientRepository.findByEmail(user.getEmail()).map(com.mhtsts.entity.Client::getId).orElse(null);
            } catch (Exception ignored) {}
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole(), user.getFirstName(), user.getLastName(), clientId);
        Date expiration = jwtUtil.extractExpiration(token);

        AuthResponseDTO response = new AuthResponseDTO(token, user.getUsername(), user.getRole(), expiration);
        response.setUserId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setClientId(clientId);
        return response;
    }

    public void logoutUser(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (token != null && !token.isEmpty()) {
            Date expiration = jwtUtil.extractExpiration(token);
            TokenBlacklist blacklist = new TokenBlacklist(token, expiration);
            tokenBlacklistRepository.save(blacklist);
        }
    }
}
