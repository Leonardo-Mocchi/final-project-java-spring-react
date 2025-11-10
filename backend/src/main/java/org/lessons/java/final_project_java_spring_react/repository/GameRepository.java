package org.lessons.java.final_project_java_spring_react.repository;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByTitleContainingIgnoreCase(String title);

    List<Game> findByDiscountPercentageGreaterThan(Integer discount);

    // Custom queries to eagerly fetch gameKeys for accurate stock calculation
    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.gameKeys")
    List<Game> findAllWithKeys();

    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.gameKeys WHERE LOWER(g.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Game> findByTitleContainingIgnoreCaseWithKeys(String title);

    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.gameKeys WHERE g.id = :id")
    Optional<Game> findByIdWithKeys(Long id);

    @Query("SELECT DISTINCT g FROM Game g LEFT JOIN FETCH g.gameKeys WHERE g.discountPercentage > :discount")
    List<Game> findByDiscountPercentageGreaterThanWithKeys(Integer discount);
}
