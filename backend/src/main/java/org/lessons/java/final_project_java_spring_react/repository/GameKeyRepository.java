package org.lessons.java.final_project_java_spring_react.repository;

import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameKeyRepository extends JpaRepository<GameKey, Long> {
    List<GameKey> findByGameIdAndPlatformIdAndIsSoldFalse(Long gameId, Long platformId);

    Optional<GameKey> findFirstByGameIdAndPlatformIdAndIsSoldFalse(Long gameId, Long platformId);

    Integer countByGameIdAndIsSoldFalse(Long gameId);

    @Query("SELECT gk FROM GameKey gk WHERE LOWER(gk.game.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(gk.keyCode) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<GameKey> searchByGameTitleOrKeyCode(@Param("search") String search);
}
