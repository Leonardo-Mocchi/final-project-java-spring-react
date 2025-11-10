package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.model.Review;
import org.lessons.java.final_project_java_spring_react.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private GameService gameService;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByGameId(Long gameId) {
        return reviewRepository.findByGameId(gameId);
    }

    public List<Review> getReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    public Review saveReview(Review review) {
        Review savedReview = reviewRepository.save(review);

        // Recalculate game's average rating
        Game game = review.getGame();
        game.calculateAverageRating();
        gameService.update(game);

        return savedReview;
    }

    public void deleteReview(Long id) {
        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isPresent()) {
            Game game = reviewOpt.get().getGame();
            reviewRepository.deleteById(id);

            // Recalculate game's average rating after deletion
            game.calculateAverageRating();
            gameService.update(game);
        }
    }

    public List<Review> searchReviews(String search) {
        return reviewRepository.searchByCommentOrGameOrUser(search);
    }
}
