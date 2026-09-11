package com.mhtsts.security.oauth2;

import com.mhtsts.entity.Client;
import com.mhtsts.entity.User;
import com.mhtsts.entity.enums.ClientStatus;
import com.mhtsts.repository.ClientRepository;
import com.mhtsts.repository.UserRepository;
import com.mhtsts.security.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    @Value("${app.oauth2.authorized-redirect-uri:http://localhost:5173/oauth2/redirect}")
    private String redirectUri;

    public OAuth2AuthenticationSuccessHandler(JwtUtil jwtUtil,
                                              UserRepository userRepository,
                                              ClientRepository clientRepository,
                                              @org.springframework.context.annotation.Lazy PasswordEncoder passwordEncoder,
                                              HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (response.isCommitted()) {
            return;
        }

        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = authToken.getPrincipal();
        String registrationId = authToken.getAuthorizedClientRegistrationId();

        // 1. Extract email
        String email = oAuth2User.getAttribute("email");
        if (email == null) email = oAuth2User.getAttribute("mail");
        if (email == null) email = oAuth2User.getAttribute("userPrincipalName");
        if (email == null) {
            String sub = oAuth2User.getAttribute("sub");
            if (sub == null) sub = oAuth2User.getAttribute("id");
            if (sub != null) {
                email = sub + "@" + registrationId + ".oauth";
            } else {
                email = "user_" + UUID.randomUUID().toString().substring(0, 8) + "@oauth.mindcare.com";
            }
        }

        // 2. Extract first and last name
        String firstName = oAuth2User.getAttribute("given_name");
        if (firstName == null) firstName = oAuth2User.getAttribute("givenName");

        String lastName = oAuth2User.getAttribute("family_name");
        if (lastName == null) lastName = oAuth2User.getAttribute("surname");

        if (firstName == null && lastName == null) {
            String fullName = oAuth2User.getAttribute("name");
            if (fullName == null) fullName = oAuth2User.getAttribute("displayName");
            if (fullName != null && !fullName.trim().isEmpty()) {
                String[] parts = fullName.trim().split("\\s+");
                firstName = parts[0];
                if (parts.length > 1) {
                    lastName = fullName.substring(firstName.length()).trim();
                } else {
                    lastName = "";
                }
            } else {
                firstName = registrationId.substring(0, 1).toUpperCase() + registrationId.substring(1);
                lastName = "User";
            }
        }
        if (firstName == null || firstName.trim().isEmpty()) firstName = "User";
        if (lastName == null) lastName = "";

        // 3. Find or provision User and Client in database
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        Long clientId = null;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            if ("CLIENT".equalsIgnoreCase(user.getRole())) {
                Optional<Client> clientOptional = clientRepository.findByEmail(email);
                if (clientOptional.isPresent()) {
                    clientId = clientOptional.get().getId();
                }
            }
        } else {
            // Auto-provision new User as CLIENT
            user = new User();
            String usernameCandidate = email.split("@")[0].replaceAll("[^a-zA-Z0-9._-]", "");
            if (usernameCandidate.isEmpty()) usernameCandidate = "user";
            if (userRepository.findByUsername(usernameCandidate).isPresent()) {
                usernameCandidate = usernameCandidate + "_" + UUID.randomUUID().toString().substring(0, 4);
            }
            user.setUsername(usernameCandidate);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setRole("CLIENT");
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setCreatedDate(LocalDateTime.now());
            user.setLastLogin(LocalDateTime.now());
            user.setIsActive(true);
            User savedUser = userRepository.save(user);
            user = savedUser;

            // Provision corresponding Client record
            try {
                Client client = new Client();
                client.setFirstName(firstName);
                client.setLastName(lastName.isEmpty() ? "User" : lastName);
                client.setEmail(email);
                client.setPhoneNumber("555-0100");
                client.setDateOfBirth(LocalDate.of(1995, 1, 1));
                client.setGender("Other");
                client.setEmergencyContactName("Emergency Contact");
                client.setEmergencyContactPhone("555-0199");
                client.setStatus(ClientStatus.ACTIVE);
                userRepository.findById(2L).ifPresent(client::setAssignedTherapist);
                Client savedClient = clientRepository.save(client);
                clientId = savedClient.getId();
            } catch (Exception ex) {
                // Log and continue with user token
                ex.printStackTrace();
            }
        }

        // 4. Generate MHTSTS JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole(), user.getFirstName(), user.getLastName(), clientId);

        // 5. Clean up request cookies
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        // 6. Redirect to frontend with token
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .queryParam("role", user.getRole())
                .queryParam("username", user.getUsername())
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
