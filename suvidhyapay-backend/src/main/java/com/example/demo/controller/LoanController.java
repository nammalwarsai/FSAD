package com.example.demo.controller;

import com.example.demo.model.LoanRequest;
import com.example.demo.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LoanController {
    
    @Autowired
    private LoanRepository loanRepository;

    @PostMapping("/request")
    public ResponseEntity<?> submitLoanRequest(@RequestBody Map<String, String> requestData) {
        try {
            Long userId = Long.parseLong(requestData.get("userId"));
            
            // Check if user already has a loan request
            if (loanRepository.findByUserId(userId).isPresent()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "You already have an active loan request"));
            }

            LoanRequest loanRequest = new LoanRequest();
            loanRequest.setUserId(userId);
            loanRequest.setAmount(Double.parseDouble(requestData.get("amount")));
            loanRequest.setPurpose(requestData.get("purpose"));
            loanRequest.setEmail(requestData.get("email"));
            loanRequest.setStatus("PENDING");
            loanRequest.setRequestDate(LocalDateTime.now());

            LoanRequest savedRequest = loanRepository.save(loanRequest);
            return ResponseEntity.ok(savedRequest);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to submit loan request: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLoanRequestByUserId(@PathVariable Long userId) {
        try {
            return loanRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to fetch loan request: " + e.getMessage()));
        }
    }

    @GetMapping("/statement/{requestId}")
    public ResponseEntity<?> getLoanStatement(@PathVariable Long requestId) {
        try {
            return loanRepository.findById(requestId)
                .map(loan -> {
                    String statement = String.format("""
                        SUVIDHAPAY LOAN REQUEST STATEMENT
                        ----------------------------------
                        Request ID: %d
                        Date: %s
                        
                        DETAILS
                        ----------------------------------
                        Amount Requested: ₹%.2f
                        Status: %s
                        Purpose: %s
                        Email: %s
                        
                        This is an automatically generated statement.
                        For any queries, please contact SuvidhaPay support.
                        """,
                        loan.getId(),
                        loan.getRequestDate().toString(),
                        loan.getAmount(),
                        loan.getStatus(),
                        loan.getPurpose(),
                        loan.getEmail()
                    );
                    
                    return ResponseEntity.ok()
                        .header("Content-Type", "text/plain")
                        .header("Content-Disposition", "attachment; filename=loan-statement-" + requestId + ".txt")
                        .body(statement);
                })
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to generate statement: " + e.getMessage()));
        }
    }

    @DeleteMapping("/cancel/{loanId}")
    public ResponseEntity<?> cancelLoanRequest(@PathVariable Long loanId) {
        try {
            Optional<LoanRequest> loanOpt = loanRepository.findById(loanId);
            if (loanOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            LoanRequest loan = loanOpt.get();
            if (!"PENDING".equals(loan.getStatus())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only pending loans can be cancelled"));
            }

            loanRepository.deleteById(loanId);
            return ResponseEntity.ok(Map.of("message", "Loan request cancelled successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Failed to cancel loan request: " + e.getMessage()));
        }
    }
}
