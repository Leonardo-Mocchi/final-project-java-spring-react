package org.lessons.java.final_project_java_spring_react.security;

import org.lessons.java.final_project_java_spring_react.model.User;
import org.lessons.java.final_project_java_spring_react.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userAttempt = userRepository.findByUsername(username);
        
        if (userAttempt.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        return new DatabaseUserDetails(userAttempt.get());
    }
}
