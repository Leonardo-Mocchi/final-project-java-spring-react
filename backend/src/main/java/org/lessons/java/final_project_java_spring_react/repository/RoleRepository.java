package org.lessons.java.final_project_java_spring_react.repository;

import java.util.Optional;

import org.lessons.java.final_project_java_spring_react.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}
