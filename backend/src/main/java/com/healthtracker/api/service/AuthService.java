package com.healthtracker.api.service;

import com.healthtracker.api.dto.LoginRequest;
import com.healthtracker.api.dto.LoginResponse;
import com.healthtracker.api.dto.RegisterRequest;
import com.healthtracker.api.model.User;
import com.healthtracker.api.repository.UserRepository;
import com.healthtracker.api.security.JwtTokenProvider;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostConstruct
    public void init() {
        if (!userRepository.findByEmail("admin@admin.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            admin.setStatus("active");
            admin.setLastActive(LocalDateTime.now());
            userRepository.save(admin);
        }
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        user.setLastActive(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user);
        return new LoginResponse(token, user.getRole());
    }

    public LoginResponse adminLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!user.getRole().equals("ADMIN")) {
            throw new BadCredentialsException("Not authorized");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        if (!"admin".equals(request.getAdminCode())) {
            throw new BadCredentialsException("Invalid admin access code");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new LoginResponse(token, "ADMIN");
    }

    public User register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords do not match");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadCredentialsException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setStatus("active");
        user.setLastActive(LocalDateTime.now());

        return userRepository.save(user);
    }
} 