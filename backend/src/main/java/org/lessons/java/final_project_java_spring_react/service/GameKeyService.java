package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.lessons.java.final_project_java_spring_react.repository.GameKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameKeyService {

    @Autowired
    private GameKeyRepository gameKeyRepository;

    public List<GameKey> getAllGameKeys() {
        return gameKeyRepository.findAll();
    }

    public Optional<GameKey> getGameKeyById(Long id) {
        return gameKeyRepository.findById(id);
    }

    public List<GameKey> getAvailableKeysByGameAndPlatform(Long gameId, Long platformId) {
        return gameKeyRepository.findByGameIdAndPlatformIdAndIsSoldFalse(gameId, platformId);
    }

    public Optional<GameKey> getFirstAvailableKey(Long gameId, Long platformId) {
        return gameKeyRepository.findFirstByGameIdAndPlatformIdAndIsSoldFalse(gameId, platformId);
    }

    public Integer getAvailableStockCount(Long gameId) {
        return gameKeyRepository.countByGameIdAndIsSoldFalse(gameId);
    }

    public GameKey saveGameKey(GameKey gameKey) {
        return gameKeyRepository.save(gameKey);
    }

    public void deleteGameKey(Long id) {
        gameKeyRepository.deleteById(id);
    }

    // Alias for REST API consistency
    public GameKey findFirstAvailableKey(Long gameId, Long platformId) {
        return getFirstAvailableKey(gameId, platformId).orElse(null);
    }

    public List<GameKey> searchGameKeys(String search) {
        return gameKeyRepository.searchByGameTitleOrKeyCode(search);
    }
}
