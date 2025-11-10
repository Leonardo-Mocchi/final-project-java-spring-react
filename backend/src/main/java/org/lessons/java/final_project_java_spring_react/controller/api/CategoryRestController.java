package org.lessons.java.final_project_java_spring_react.controller.api;

import org.lessons.java.final_project_java_spring_react.model.Category;
import org.lessons.java.final_project_java_spring_react.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    //> INDEX - Get all categories
    @GetMapping
    public List<Category> index() {
        return categoryService.findAll();
    }

    //> SHOW - Get single category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> show(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //> CREATE - Add new category (Admin only)
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        Category savedCategory = categoryService.create(category);
        return ResponseEntity.ok(savedCategory);
    }

    //> UPDATE - Update existing category (Admin only)
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.findById(id)
                .map(existing -> {
                    category.setId(id);
                    Category updated = categoryService.update(category);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //> DELETE - Delete category (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(category -> {
                    categoryService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
