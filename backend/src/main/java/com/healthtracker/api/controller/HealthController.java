package com.healthtracker.api.controller;

import com.healthtracker.api.model.HealthRecord;
import com.healthtracker.api.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class HealthController {
    
    private final HealthService healthService;
    
    @PostMapping("/records")
    public ResponseEntity<HealthRecord> saveRecord(@RequestBody HealthRecord record) {
        return ResponseEntity.ok(healthService.saveRecord(record));
    }
    
    @GetMapping("/records")
    public ResponseEntity<List<HealthRecord>> getRecords() {
        return ResponseEntity.ok(healthService.getUserRecords());
    }
} 