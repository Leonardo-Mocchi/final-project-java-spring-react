package org.lessons.java.final_project_java_spring_react.controller;

import org.lessons.java.final_project_java_spring_react.model.GameKey;
import org.lessons.java.final_project_java_spring_react.service.GameKeyService;
import org.lessons.java.final_project_java_spring_react.service.GameService;
import org.lessons.java.final_project_java_spring_react.service.PlatformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin/game-keys")
public class GameKeyController {

    @Autowired
    private GameKeyService gameKeyService;

    @Autowired
    private GameService gameService;

    @Autowired
    private PlatformService platformService;

    // List all game keys
    @GetMapping
    public String index(@RequestParam(required = false) String search, Model model) {
        List<GameKey> gameKeys;
        if (search != null && !search.trim().isEmpty()) {
            gameKeys = gameKeyService.searchGameKeys(search);
        } else {
            gameKeys = gameKeyService.getAllGameKeys();
        }
        model.addAttribute("gameKeys", gameKeys);
        model.addAttribute("search", search);
        return "game-keys/index";
    }

    // Show single game key
    @GetMapping("/{id}")
    public String show(@PathVariable Long id, Model model) {
        GameKey gameKey = gameKeyService.getGameKeyById(id)
                .orElseThrow(() -> new RuntimeException("Game key not found"));
        model.addAttribute("gameKey", gameKey);
        return "game-keys/show";
    }

    // Create form
    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("gameKey", new GameKey());
        model.addAttribute("games", gameService.findAll());
        model.addAttribute("platforms", platformService.findAll());
        return "game-keys/form";
    }

    // Store new game key
    @PostMapping
    public String store(@ModelAttribute GameKey gameKey) {
        gameKeyService.saveGameKey(gameKey);
        return "redirect:/admin/game-keys";
    }

    // Edit form
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        GameKey gameKey = gameKeyService.getGameKeyById(id)
                .orElseThrow(() -> new RuntimeException("Game key not found"));
        model.addAttribute("gameKey", gameKey);
        model.addAttribute("games", gameService.findAll());
        model.addAttribute("platforms", platformService.findAll());
        return "game-keys/form";
    }

    // Update game key
    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id, @ModelAttribute GameKey gameKey) {
        gameKey.setId(id);
        gameKeyService.saveGameKey(gameKey);
        return "redirect:/admin/game-keys";
    }

    // Delete game key
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        gameKeyService.deleteGameKey(id);
        return "redirect:/admin/game-keys";
    }
}
