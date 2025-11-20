package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.Review;
import org.lessons.java.final_project_java_spring_react.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewRestController {

    @Autowired
    private ReviewService reviewService;

    //> INDEX
    @GetMapping
    public List<Review> index(@RequestParam(required = false) Long gameId) {
        if (gameId != null) {
            return reviewService.getReviewsByGameId(gameId);
        }
        return reviewService.getAllReviews();
    }

    //> SHOW
    @GetMapping("/{id}")
    public ResponseEntity<Review> show(@PathVariable Long id) {
        Optional<Review> reviewAttempt = reviewService.getReviewById(id);

        if (reviewAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(reviewAttempt.get(), HttpStatus.OK);
    }

    //> STORE
    @PostMapping
    public ResponseEntity<Review> store(@RequestBody Review review) {
        return new ResponseEntity<>(reviewService.saveReview(review), HttpStatus.OK);
    }

    //> UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id, @RequestBody Review review) {
        if (reviewService.getReviewById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        review.setId(id);
        return new ResponseEntity<>(reviewService.saveReview(review), HttpStatus.OK);
    }

    //> DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Review> delete(@PathVariable Long id) {
        if (reviewService.getReviewById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        reviewService.deleteReview(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //> TOGGLE BLUR (Admin moderation)
    @PatchMapping("/{id}/blur")
    public ResponseEntity<Review> toggleBlur(@PathVariable Long id) {
        Optional<Review> reviewAttempt = reviewService.getReviewById(id);

        if (reviewAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Review review = reviewAttempt.get();
        review.setIsBlurred(!review.getIsBlurred());
        Review updated = reviewService.saveReview(review);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    //> MY REVIEWS (for profile page)
    @GetMapping("/my-reviews")
    public ResponseEntity<?> myReviews(@org.springframework.security.core.annotation.AuthenticationPrincipal org.lessons.java.final_project_java_spring_react.security.DatabaseUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        List<Review> reviews = reviewService.getReviewsByUserId(userDetails.getId());
        return ResponseEntity.ok(reviews);
    }
}
