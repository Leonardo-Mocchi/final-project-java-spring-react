package org.lessons.java.final_project_java_spring_react.controller;

import org.lessons.java.final_project_java_spring_react.model.Category;
import org.lessons.java.final_project_java_spring_react.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/admin/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // List all categories
    @GetMapping
    public String index(@RequestParam(required = false) String search, Model model) {
        if (search != null && !search.trim().isEmpty()) {
            model.addAttribute("categories", categoryService.findByNameContaining(search));
        } else {
            model.addAttribute("categories", categoryService.findAll());
        }
        model.addAttribute("search", search);
        return "categories/index";
    }

    // Show form to create new category
    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("category", new Category());
        return "categories/form";
    }

    // Save new category
    @PostMapping("/create")
    public String store(@Valid @ModelAttribute Category category,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "categories/form";
        }

        categoryService.create(category);
        redirectAttributes.addFlashAttribute("successMessage", "Category created successfully!");
        return "redirect:/admin/categories";
    }

    // Show form to edit category
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Model model) {
        Category category = categoryService.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        model.addAttribute("category", category);
        return "categories/form";
    }

    // Update category
    @PostMapping("/edit/{id}")
    public String update(@PathVariable Long id,
            @Valid @ModelAttribute Category category,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "categories/form";
        }

        category.setId(id);
        categoryService.update(category);
        redirectAttributes.addFlashAttribute("successMessage", "Category updated successfully!");
        return "redirect:/admin/categories";
    }

    // Delete category
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        categoryService.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Category deleted successfully!");
        return "redirect:/admin/categories";
    }
}
