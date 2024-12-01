package com.healthtracker.api.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String adminCode;
} 