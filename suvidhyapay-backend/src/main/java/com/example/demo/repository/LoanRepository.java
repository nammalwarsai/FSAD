package com.example.demo.repository;

import com.example.demo.model.LoanRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<LoanRequest, Long> {
    Optional<LoanRequest> findByUserId(Long userId);
}
