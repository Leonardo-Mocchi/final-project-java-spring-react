package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<Game> findAll() {
        // Use custom query to fetch gameKeys for accurate stock calculation
        return gameRepository.findAllWithKeys();
    }

    public List<Game> findAllSortedByTitle() {
        return gameRepository.findAll(Sort.by("title"));
    }

    public Optional<Game> findById(Long id) {
        // Use custom query to fetch gameKeys for accurate stock calculation
        return gameRepository.findByIdWithKeys(id);
    }

    public Game getById(Long id) {
        Optional<Game> gameAttempt = gameRepository.findByIdWithKeys(id);

        if (gameAttempt.isEmpty()) {
            // throw new NotFoundException();
        }

        return gameAttempt.get();
    }

    public List<Game> findByTitle(String title) {
        // Use custom query to fetch gameKeys for accurate stock calculation
        return gameRepository.findByTitleContainingIgnoreCaseWithKeys(title);
    }

    public List<Game> findGamesWithDiscounts() {
        // Use custom query to fetch gameKeys for accurate stock calculation
        return gameRepository.findByDiscountPercentageGreaterThanWithKeys(0);
    }

    public Game create(Game game) {
        return gameRepository.save(game);
    }

    public Game update(Game game) {
        return gameRepository.save(game);
    }

    public void delete(Game game) {
        gameRepository.delete(game);
    }

    public void deleteById(Long id) {
        gameRepository.deleteById(id);
    }

    public Boolean existsById(Long id) {
        return gameRepository.existsById(id);
    }

    public Boolean exists(Game game) {
        return existsById(game.getId());
    }
}
