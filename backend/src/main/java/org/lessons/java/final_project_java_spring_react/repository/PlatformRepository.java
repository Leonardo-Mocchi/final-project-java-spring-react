package org.lessons.java.final_project_java_spring_react.repository;

import org.lessons.java.final_project_java_spring_react.model.Platform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatformRepository extends JpaRepository<Platform, Long> {
}
