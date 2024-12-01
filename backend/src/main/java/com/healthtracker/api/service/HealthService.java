package com.healthtracker.api.service;

import com.healthtracker.api.model.HealthRecord;
import com.healthtracker.api.model.User;
import com.healthtracker.api.repository.HealthRecordRepository;
import com.healthtracker.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthService {
    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;

    public HealthRecord saveRecord(HealthRecord record) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        record.setUser(currentUser);
        return healthRecordRepository.save(record);
    }

    public List<HealthRecord> getUserRecords() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
            
        return healthRecordRepository.findByUserOrderByDateDesc(currentUser);
    }
} 