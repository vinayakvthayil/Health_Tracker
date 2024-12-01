package com.healthtracker.api.service;

import com.healthtracker.api.model.User;
import com.healthtracker.api.repository.UserRepository;
import com.healthtracker.api.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final HealthRecordRepository healthRecordRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Cannot delete admin users");
        }
        
        healthRecordRepository.deleteByUser(user);
        
        userRepository.delete(user);
    }
} 