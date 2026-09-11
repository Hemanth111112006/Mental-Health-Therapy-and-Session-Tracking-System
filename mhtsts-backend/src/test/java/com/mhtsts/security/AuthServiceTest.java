package com.mhtsts.security;

import com.mhtsts.dto.AuthResponseDTO;
import com.mhtsts.dto.UserDTO;
import com.mhtsts.entity.User;
import com.mhtsts.exception.ValidationException;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;
    private UserDTO sampleUserDTO;

    @BeforeEach
    public void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setUsername("testuser");
        sampleUser.setEmail("test@example.com");
        sampleUser.setRole("THERAPIST");

        sampleUserDTO = new UserDTO();
        sampleUserDTO.setUsername("testuser");
        sampleUserDTO.setEmail("test@example.com");
        sampleUserDTO.setRole("THERAPIST");
    }

    @Test
    public void testRegisterUser_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtUtil.generateToken(any(), anyString(), anyString())).thenReturn("mockJwtToken");
        when(jwtUtil.extractExpiration(anyString())).thenReturn(new Date());

        AuthResponseDTO result = authService.registerUser(sampleUserDTO, "Password123!");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("mockJwtToken", result.getToken());
    }

    @Test
    public void testRegisterUser_DuplicateUsername_ThrowsValidationException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));

        assertThrows(ValidationException.class, () -> authService.registerUser(sampleUserDTO, "password123"));
    }

    @Test
    public void testAuthenticateUser_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(sampleUser));
        when(jwtUtil.generateToken(any(), anyString(), anyString())).thenReturn("mockJwtToken");
        when(jwtUtil.extractExpiration(anyString())).thenReturn(new Date());

        AuthResponseDTO result = authService.authenticateUser("testuser", "password123");

        assertNotNull(result);
        assertEquals("mockJwtToken", result.getToken());
    }
}
