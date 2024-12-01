package com.healthtracker.api.repository;

import com.healthtracker.api.model.HealthRecord;
import com.healthtracker.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByUserOrderByDateDesc(User user);
    void deleteByUser(User user);
} 