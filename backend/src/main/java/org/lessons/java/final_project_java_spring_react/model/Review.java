package org.lessons.java.final_project_java_spring_react.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    @Lob
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_blurred")
    private Boolean isBlurred = false; // For admin moderation

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    @JsonBackReference("game-reviews")
    private Game game;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "password", "email", "roles", "reviews", "orders" })
    private User user;

    // Constructors
    public Review() {
    }

    public Review(Integer rating, String comment, Game game, User user) {
        this.rating = rating;
        this.comment = comment;
        this.game = game;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Boolean getIsBlurred() {
        return isBlurred;
    }

    public void setIsBlurred(Boolean isBlurred) {
        this.isBlurred = isBlurred;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
