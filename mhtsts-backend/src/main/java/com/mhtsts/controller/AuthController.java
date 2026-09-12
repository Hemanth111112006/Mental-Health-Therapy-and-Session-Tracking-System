package com.mhtsts.controller;

import com.mhtsts.dto.ApiResponse;
import com.mhtsts.dto.AuthResponseDTO;
import com.mhtsts.dto.UserDTO;
import com.mhtsts.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(
            @Valid @RequestBody UserDTO userDTO) {

        AuthResponseDTO authResponse = authService.registerUser(userDTO, userDTO.getPassword());
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        if (username == null || username.trim().isEmpty()) {
            username = loginRequest.get("email");
        }
        String password = loginRequest.get("password");

        AuthResponseDTO authResponse = authService.authenticateUser(username, password);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/oauth-login")
    public ResponseEntity<AuthResponseDTO> oauthLogin(@RequestBody Map<String, String> request) {
        String provider = request.getOrDefault("provider", "google");
        String email = request.getOrDefault("email", "hemanthk1106@gmail.com");
        String firstName = request.getOrDefault("firstName", "Hemanth");
        String lastName = request.getOrDefault("lastName", "K");
        String role = request.getOrDefault("role", "CLIENT");

        AuthResponseDTO authResponse = authService.authenticateOAuthUser(provider, email, firstName, lastName, role);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            authService.logoutUser(authHeader);
        }
        return ResponseEntity.ok(ApiResponse.success("User logged out successfully", "SESSION_CLOSED"));
    }
}
