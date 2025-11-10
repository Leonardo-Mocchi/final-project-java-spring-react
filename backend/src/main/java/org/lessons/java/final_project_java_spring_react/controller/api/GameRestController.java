package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.model.Review;
import org.lessons.java.final_project_java_spring_react.model.User;
import org.lessons.java.final_project_java_spring_react.service.GameService;
import org.lessons.java.final_project_java_spring_react.service.ReviewService;
import org.lessons.java.final_project_java_spring_react.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/games")
@CrossOrigin
public class GameRestController {

    @Autowired
    private GameService gameService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    //> INDEX
    @GetMapping
    public List<Game> index(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return gameService.findByTitle(search);
        }
        return gameService.findAll();
    }

    //> INDEX - Hot Deals
    @GetMapping("/hot-deals")
    public List<Game> hotDeals() {
        return gameService.findGamesWithDiscounts();
    }

    //> SHOW
    @GetMapping("/{id}")
    public ResponseEntity<Game> show(@PathVariable Long id) {
        Optional<Game> gameAttempt = gameService.findById(id);

        if (gameAttempt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(gameAttempt.get(), HttpStatus.OK);
    }

    //> STORE
    @PostMapping
    public ResponseEntity<Game> store(@RequestBody Game game) {
        return new ResponseEntity<>(gameService.create(game), HttpStatus.OK);
    }

    //> UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Game> update(@PathVariable Long id, @RequestBody Game game) {
        if (gameService.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        game.setId(id);
        return new ResponseEntity<>(gameService.update(game), HttpStatus.OK);
    }

    //> DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Game> delete(@PathVariable Long id) {
        if (gameService.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        gameService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //> POST REVIEW FOR GAME
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(
            @PathVariable Long id,
            @RequestBody Map<String, Object> reviewData,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Check if user is authenticated
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "You must be logged in to submit a review"));
        }

        // Check if game exists
        Optional<Game> gameOpt = gameService.findById(id);
        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Game not found"));
        }

        // Get the user from database
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
        }

        // Create the review
        Review review = new Review();
        review.setGame(gameOpt.get());
        review.setUser(userOpt.get());
        review.setRating(((Number) reviewData.get("rating")).intValue());
        review.setComment((String) reviewData.get("comment"));
        review.setCreatedAt(LocalDateTime.now());

        // Save review
        Review savedReview = reviewService.saveReview(review);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    //> GET STOCK FOR SPECIFIC PLATFORM
    @GetMapping("/{gameId}/stock/{platformId}")
    public ResponseEntity<?> getStockByPlatform(
            @PathVariable Long gameId,
            @PathVariable Long platformId) {

        Optional<Game> gameOpt = gameService.findById(gameId);
        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Game not found"));
        }

        Game game = gameOpt.get();
        long availableStock = game.getGameKeys().stream()
                .filter(key -> !key.isSold() && key.getPlatform().getId().equals(platformId))
                .count();

        return ResponseEntity.ok(Map.of(
                "gameId", gameId,
                "platformId", platformId,
                "availableStock", availableStock));
    }
}
