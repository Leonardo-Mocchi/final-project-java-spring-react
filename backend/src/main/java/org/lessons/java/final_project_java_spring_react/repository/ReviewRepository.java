package org.lessons.java.final_project_java_spring_react.repository;

import org.lessons.java.final_project_java_spring_react.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByGameId(Long gameId);

    List<Review> findByUserId(Integer userId);

    @Query("SELECT r FROM Review r WHERE LOWER(r.game.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.user.username) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Review> searchByCommentOrGameOrUser(@Param("search") String search);
}
