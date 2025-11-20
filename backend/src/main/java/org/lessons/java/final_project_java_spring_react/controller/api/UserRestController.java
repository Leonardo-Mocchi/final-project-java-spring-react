package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.User;
import org.lessons.java.final_project_java_spring_react.repository.UserRepository;
import org.lessons.java.final_project_java_spring_react.security.DatabaseUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal DatabaseUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // Get full user details from database
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("authorities", userDetails.getAuthorities());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(
            @RequestBody Map<String, String> updates,
            @AuthenticationPrincipal DatabaseUserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update username if provided
            if (updates.containsKey("username") && !updates.get("username").isBlank()) {
                String newUsername = updates.get("username");
                // Check if username is already taken by another user
                if (userRepository.findByUsername(newUsername).isPresent() &&
                        !newUsername.equals(user.getUsername())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Username already taken"));
                }
                user.setUsername(newUsername);
            }

            // Update email if provided
            if (updates.containsKey("email") && !updates.get("email").isBlank()) {
                String newEmail = updates.get("email");
                // Check if email is already taken by another user
                if (userRepository.findByEmail(newEmail).isPresent() &&
                        !newEmail.equals(user.getEmail())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Email already taken"));
                }
                user.setEmail(newEmail);
            }

            // Update password if provided
            if (updates.containsKey("currentPassword") &&
                    updates.containsKey("newPassword") &&
                    !updates.get("newPassword").isBlank()) {

                String currentPassword = updates.get("currentPassword");
                String newPassword = updates.get("newPassword");

                // Verify current password
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Current password is incorrect"));
                }

                // Set new password
                user.setPassword(passwordEncoder.encode(newPassword));
            }

            // Save updated user
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("authorities", userDetails.getAuthorities());
            response.put("message", "Profile updated successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
