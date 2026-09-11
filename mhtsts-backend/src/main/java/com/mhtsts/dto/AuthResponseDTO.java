package com.mhtsts.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class AuthResponseDTO {

    private String token;
    
    @JsonIgnore
    private String type = "Bearer";
    
    private String username;
    private String role;
    private Long userId;
    private String firstName;
    private String lastName;
    private Long clientId;
    
    @JsonIgnore
    private Date expiration;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String username, String role, Date expiration) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.expiration = expiration;
    }

    public AuthResponseDTO(String token, String type, String username, String role) {
        this.token = token;
        this.type = type;
        this.username = username;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }

    public Date getExpiration() { return expiration; }
    public void setExpiration(Date expiration) { this.expiration = expiration; }
}
