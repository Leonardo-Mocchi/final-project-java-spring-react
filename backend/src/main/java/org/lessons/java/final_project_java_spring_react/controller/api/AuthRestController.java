package org.lessons.java.final_project_java_spring_react.controller.api;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.lessons.java.final_project_java_spring_react.model.Role;
import org.lessons.java.final_project_java_spring_react.model.User;
import org.lessons.java.final_project_java_spring_react.repository.RoleRepository;
import org.lessons.java.final_project_java_spring_react.repository.UserRepository;
import org.lessons.java.final_project_java_spring_react.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(registrationRequest.getUsername()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Username is already taken"));
            }

            // Check if email already exists
            if (userRepository.findByEmail(registrationRequest.getEmail()).isPresent()) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(new ErrorResponse("Email is already registered"));
            }

            // Create new user
            User user = new User();
            user.setUsername(registrationRequest.getUsername());
            user.setEmail(registrationRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));

            // Assign USER role by default
            Optional<Role> userRole = roleRepository.findByName("ROLE_USER");
            if (userRole.isPresent()) {
                Set<Role> roles = new HashSet<>();
                roles.add(userRole.get());
                user.setRoles(roles);
            } else {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ErrorResponse("User role not found in database"));
            }

            // Save user
            User savedUser = userRepository.save(user);

            // Send welcome email
            try {
                emailService.sendWelcomeEmail(savedUser);
            } catch (Exception emailEx) {
                System.err.println("Failed to send welcome email: " + emailEx.getMessage());
            }

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new SuccessResponse("User registered successfully"));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Registration failed: " + e.getMessage()));
        }
    }

    // Request DTO
    public static class RegistrationRequest {
        private String username;
        private String email;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Response DTOs
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
