package org.lessons.java.final_project_java_spring_react.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @Lob
    private String description;

    @Lob
    private String detailedDescription;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", message = "Price must be positive")
    private Double price;

    private String imageUrl;

    @NotBlank(message = "Publisher is required")
    private String publisher;

    @PastOrPresent(message = "Release date cannot be in the future")
    private LocalDate releaseDate;

    // Calculated field - do not set manually, use calculateAverageRating()
    private Double averageRating = 0.0;

    @Min(value = 0, message = "Discount must be at least 0")
    @Max(value = 100, message = "Discount cannot exceed 100")
    private Integer discountPercentage = 0;

    @ManyToMany
    @JoinTable(name = "game_categories", joinColumns = @JoinColumn(name = "game_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories;

    @ManyToMany
    @JoinTable(name = "game_platforms", joinColumns = @JoinColumn(name = "game_id"), inverseJoinColumns = @JoinColumn(name = "platform_id"))
    private List<Platform> platforms;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @JsonManagedReference("game-reviews")
    private List<Review> reviews;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL)
    @JsonBackReference("game-keys")
    private List<GameKey> gameKeys;

    // Constructors
    public Game() {
    }

    public Game(String title, String description, Double price) {
        this.title = title;
        this.description = description;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetailedDescription() {
        return detailedDescription;
    }

    public void setDetailedDescription(String detailedDescription) {
        this.detailedDescription = detailedDescription;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public List<Platform> getPlatforms() {
        return platforms;
    }

    public void setPlatforms(List<Platform> platforms) {
        this.platforms = platforms;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<GameKey> getGameKeys() {
        return gameKeys;
    }

    public void setGameKeys(List<GameKey> gameKeys) {
        this.gameKeys = gameKeys;
    }

    // Calculate average rating from reviews
    public void calculateAverageRating() {
        // If there are no reviews, set rating to 0
        if (reviews == null || reviews.isEmpty()) {
            this.averageRating = 0.0;
            return;
        }

        // Add up all the ratings
        double sum = 0;
        for (Review review : reviews) {
            sum += review.getRating();
        }

        // Calculate the average
        double average = sum / reviews.size();

        // Round up to 1 decimal place (e.g., 4.51 becomes 4.6, 4.5 stays 4.5)
        this.averageRating = Math.ceil(average * 10.0) / 10.0;
    }

    // Calculate available stock dynamically from unsold game keys
    // Note: This is included in JSON even though gameKeys has @JsonBackReference
    @JsonProperty("availableStock")
    public Integer getAvailableStock() {
        if (gameKeys == null || gameKeys.isEmpty()) {
            return 0;
        }
        return (int) gameKeys.stream()
                .filter(key -> !key.isSold())
                .count();
    }
}
