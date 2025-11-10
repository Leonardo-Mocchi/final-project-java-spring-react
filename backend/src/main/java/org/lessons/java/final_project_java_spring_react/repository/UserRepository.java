package org.lessons.java.final_project_java_spring_react.repository;

import java.util.Optional;

import org.lessons.java.final_project_java_spring_react.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
