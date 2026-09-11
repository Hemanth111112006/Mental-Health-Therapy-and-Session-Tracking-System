package com.mhtsts.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final String SECRET_KEY_STRING = "MHTSTS_MentalHealthSessionTrackingSystem_SecretKey_2026_Secure_256bit!";
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));

    // Expiration Times in milliseconds
    private static final long CLIENT_EXPIRATION_TIME = 30 * 60 * 1000L;      // 30 minutes
    private static final long CLINICAL_EXPIRATION_TIME = 8 * 60 * 60 * 1000L;  // 8 hours
    private static final long ADMIN_EXPIRATION_TIME = 12 * 60 * 60 * 1000L;    // 12 hours

    // Refresh Token Expiration Times
    private static final long CLIENT_REFRESH_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000L;  // 7 days
    private static final long CLINICAL_REFRESH_EXPIRATION_TIME = 24 * 60 * 60 * 1000L;    // 24 hours

    public long getExpirationTimeForRole(String role) {
        if (role == null) return CLINICAL_EXPIRATION_TIME;
        switch (role.toUpperCase()) {
            case "CLIENT":
                return CLIENT_EXPIRATION_TIME;
            case "ADMIN":
                return ADMIN_EXPIRATION_TIME;
            default:
                return CLINICAL_EXPIRATION_TIME;
        }
    }

    public String generateToken(Long userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);

        long expirationMillis = getExpirationTimeForRole(role);

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String generateRefreshToken(Long userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);
        claims.put("type", "refresh");

        long expirationMillis = "CLIENT".equalsIgnoreCase(role) ? CLIENT_REFRESH_EXPIRATION_TIME : CLINICAL_REFRESH_EXPIRATION_TIME;

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
