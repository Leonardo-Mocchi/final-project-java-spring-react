package org.lessons.java.final_project_java_spring_react.service;

import org.lessons.java.final_project_java_spring_react.model.Category;
import org.lessons.java.final_project_java_spring_react.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public List<Category> findAllSortedByName() {
        return categoryRepository.findAll(Sort.by("name"));
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category getById(Long id) {
        Optional<Category> categoryAttempt = categoryRepository.findById(id);

        if (categoryAttempt.isEmpty()) {
            // throw new NotFoundException();
        }

        return categoryAttempt.get();
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Category category) {
        return categoryRepository.save(category);
    }

    public void delete(Category category) {
        categoryRepository.delete(category);
    }

    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

    public Boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    public List<Category> findByNameContaining(String search) {
        return categoryRepository.findByNameContainingIgnoreCase(search);
    }

    public Boolean exists(Category category) {
        return existsById(category.getId());
    }
}
