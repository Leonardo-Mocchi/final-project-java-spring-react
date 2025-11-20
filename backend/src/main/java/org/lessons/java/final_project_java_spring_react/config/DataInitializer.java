package org.lessons.java.final_project_java_spring_react.config;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.repository.GameRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final GameRepository gameRepository;

    public DataInitializer(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Calculate and persist average ratings for all games on startup
        List<Game> games = gameRepository.findAll();

        for (Game game : games) {
            // Force load reviews to avoid LazyInitializationException
            game.getReviews().size();
            game.calculateAverageRating();
        }

        // Save all games with calculated ratings
        gameRepository.saveAll(games);

        System.out.println("✓ Calculated and saved average ratings for " + games.size() + " games");
    }
}