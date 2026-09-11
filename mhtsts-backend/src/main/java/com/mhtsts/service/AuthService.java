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

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       TokenBlacklistRepository tokenBlacklistRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistRepository = tokenBlacklistRepository;
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
        user.setCreatedDate(LocalDateTime.now());
        user.setIsActive(true);

        if ("THERAPIST".equalsIgnoreCase(user.getRole()) || "PSYCHIATRIST".equalsIgnoreCase(user.getRole()) || "PSYCHOLOGIST".equalsIgnoreCase(user.getRole())) {
            if (userDTO.getLicenseNumber() != null && !userDTO.getLicenseNumber().trim().isEmpty()) {
                user.setLicenseNumber(userDTO.getLicenseNumber());
            } else {
                user.setLicenseNumber("TEMP" + System.currentTimeMillis());
            }
        }

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getRole());
        Date expiration = jwtUtil.extractExpiration(token);

        return new AuthResponseDTO(token, savedUser.getUsername(), savedUser.getRole(), expiration);
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

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
        Date expiration = jwtUtil.extractExpiration(token);

        return new AuthResponseDTO(token, user.getUsername(), user.getRole(), expiration);
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
