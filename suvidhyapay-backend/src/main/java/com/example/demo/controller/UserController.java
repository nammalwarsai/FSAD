package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        String emailid = credentials.get("emailid");
        String password = credentials.get("password");
        
        if (emailid == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }
        
        Optional<User> userOpt = userRepository.findByEmailid(emailid);
        if (userOpt.isPresent() && password.equals(userOpt.get().getPassword())) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("emailid", user.getEmailid());
            response.put("fullName", user.getFullName());
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> userData) {
        try {
            // Validate required fields
            String[] requiredFields = {"username", "password", "fullName", "emailid", "phoneNumber", "aadharnumber", "pannumber"};
            for (String field : requiredFields) {
                if (userData.get(field) == null || userData.get(field).trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("error", field + " is required"));
                }
            }

            // Check if user already exists
            if (userRepository.findByEmailid(userData.get("emailid")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }

            if (userRepository.findByUsername(userData.get("username")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
            }

            User newUser = new User();
            newUser.setUsername(userData.get("username"));
            newUser.setPassword(userData.get("password")); // In production, this should be hashed
            newUser.setFullName(userData.get("fullName"));
            newUser.setPhoneNumber(userData.get("phoneNumber"));
            newUser.setAddress(userData.get("address"));
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setAadharnumber(userData.get("aadharnumber"));
            newUser.setDob(LocalDate.parse(userData.get("dob")));
            newUser.setEmailid(userData.get("emailid"));
            newUser.setPannumber(userData.get("pannumber"));
            newUser.setBank_name(userData.get("bank_name"));
            newUser.setBalance(new BigDecimal("0.00"));

            User savedUser = userRepository.save(newUser);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", savedUser.getId());
            return ResponseEntity.ok(response);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use YYYY-MM-DD"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            logger.info("Fetching profile for user ID: {}", id);
            Optional<User> user = userRepository.findById(id);
            
            if (user.isPresent()) {
                User userProfile = user.get();
                userProfile.setPassword(null); // Don't send password in response
                logger.info("Profile found for user ID: {}", id);
                return ResponseEntity.ok(userProfile);
            }
            
            logger.warn("Profile not found for user ID: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (Exception e) {
            logger.error("Error fetching profile for user ID: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Error fetching profile: " + e.getMessage(),
                "details", e.getClass().getSimpleName()
            ));
        }
    }    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody Map<String, String> updateData) {
        try {
            logger.info("Updating profile for user ID: {} with data: {}", id, updateData);
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                logger.warn("User not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();

            // Validate input data
            if (updateData.containsKey("phoneNumber") && (updateData.get("phoneNumber") == null || updateData.get("phoneNumber").trim().isEmpty())) {
                logger.warn("Phone number validation failed for user ID: {}", id);
                return ResponseEntity.badRequest().body(Map.of("error", "Phone number cannot be empty"));
            }
            if (updateData.containsKey("aadharnumber") && (updateData.get("aadharnumber") == null || updateData.get("aadharnumber").trim().isEmpty())) {
                logger.warn("Aadhar number validation failed for user ID: {}", id);
                return ResponseEntity.badRequest().body(Map.of("error", "Aadhar number cannot be empty"));
            }
            if (updateData.containsKey("pannumber") && (updateData.get("pannumber") == null || updateData.get("pannumber").trim().isEmpty())) {
                logger.warn("PAN number validation failed for user ID: {}", id);
                return ResponseEntity.badRequest().body(Map.of("error", "PAN number cannot be empty"));
            }
            if (updateData.containsKey("dob") && (updateData.get("dob") == null || updateData.get("dob").trim().isEmpty())) {
                logger.warn("DOB validation failed for user ID: {}", id);
                return ResponseEntity.badRequest().body(Map.of("error", "Date of Birth cannot be empty"));
            }            try {
                // Update only the allowed fields
                if (updateData.containsKey("phoneNumber")) {
                    user.setPhoneNumber(updateData.get("phoneNumber").trim());
                }
                if (updateData.containsKey("address")) {
                    user.setAddress(updateData.get("address").trim());
                }
                if (updateData.containsKey("dob")) {
                    try {
                        user.setDob(LocalDate.parse(updateData.get("dob").trim()));
                    } catch (DateTimeParseException e) {
                        logger.error("Invalid date format for DOB: {}", updateData.get("dob"));
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use YYYY-MM-DD"));
                    }
                }
                if (updateData.containsKey("aadharnumber")) {
                    user.setAadharnumber(updateData.get("aadharnumber").trim());
                }
                if (updateData.containsKey("pannumber")) {
                    user.setPannumber(updateData.get("pannumber").trim());
                }

                User updatedUser = userRepository.save(user);
                updatedUser.setPassword(null); // Don't send password in response
                logger.info("Successfully updated profile for user ID: {}", id);
                return ResponseEntity.ok(updatedUser);
            } catch (Exception e) {
                logger.error("Error updating user profile: {}", e.getMessage(), e);
                return ResponseEntity.badRequest().body(Map.of("error", "Error updating profile: " + e.getMessage()));
            }
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid date format. Please use YYYY-MM-DD"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
