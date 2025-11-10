package org.lessons.java.final_project_java_spring_react.controller;

import org.lessons.java.final_project_java_spring_react.model.Game;
import org.lessons.java.final_project_java_spring_react.service.CategoryService;
import org.lessons.java.final_project_java_spring_react.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * Thymeleaf controller for admin panel (backoffice)
 * Handles server-side rendering with Thymeleaf templates
 */
@Controller
@RequestMapping("/admin/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private CategoryService categoryService;

    // List all games
    @GetMapping
    public String index(Model model, @RequestParam(required = false) String search) {
        List<Game> games;
        if (search != null && !search.isEmpty()) {
            games = gameService.findByTitle(search);
        } else {
            games = gameService.findAll();
        }
        model.addAttribute("games", games);
        model.addAttribute("search", search);
        return "games/index";
    }

    // Show single game
    @GetMapping("/{id}")
    public String show(@PathVariable Long id, Model model) {
        Game game = gameService.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        model.addAttribute("game", game);
        return "games/show";
    }

    // Create form
    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("game", new Game());
        model.addAttribute("categories", categoryService.findAll());
        return "games/form";
    }

    // Store new game
    @PostMapping
    public String store(@Valid @ModelAttribute Game game, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("categories", categoryService.findAll());
            return "games/form";
        }
        gameService.create(game);
        return "redirect:/admin/games";
    }

    // Edit form
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Game game = gameService.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        model.addAttribute("game", game);
        model.addAttribute("categories", categoryService.findAll());
        return "games/form";
    }

    // Update game
    @PostMapping("/update/{id}")
    public String update(@PathVariable Long id, @Valid @ModelAttribute Game game,
            BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("categories", categoryService.findAll());
            return "games/form";
        }
        game.setId(id);
        gameService.update(game);
        return "redirect:/admin/games";
    }

    // Delete game
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        gameService.deleteById(id);
        return "redirect:/admin/games";
    }
}
